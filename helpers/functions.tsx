import { ProductProps } from "@/helpers/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  abujaDeliveryFees,
  countryGroups,
  expressInternationalDeliveryFees,
  nigeriaDeliveryFees,
  scalingFactors,
  standardInternationalDeliveryFees,
} from "./shipping-fees";

// ======================
// Type Definitions
// ======================
type ShippingTier = {
  min: number;
  max: number;
  standard: number;
  express: number;
};

type InternationalShippingTier = Omit<ShippingTier, "standard" | "express"> & {
  [region: string]: number;
};

type ShippingType = "standard" | "express";

// ======================
// Constants
// ======================
const MAX_ALLOWED_WEIGHT_KG = 20;
const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

// ======================
// Helper Functions
// ======================
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "") ?? "";
};

export const formatPrice = (currency: string, price: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });
  return formatter.format(price);
};

export function groupMerchByCategory(
  merch: any[]
): Record<string, ProductProps[]> {
  return merch?.reduce((acc: Record<string, ProductProps[]>, item: any) => {
    if (!acc[item?.category]) {
      acc[item?.category] = [];
    }
    acc[item?.category].push(item);
    return acc;
  }, {});
}

// ======================
// Shipping Functions
// ======================
function getRegionByCountry(country: string): string {
  const countryLower = country.toLowerCase();
  for (const [region, countries] of Object.entries(countryGroups)) {
    if (countries.includes(countryLower)) {
      return region;
    }
  }
  return "UNKNOWN";
}

function getScalingFactor(quantity: number): number | null {
  const factor = scalingFactors?.find(
    (s) => quantity >= s.min && quantity <= s.max
  )?.sf;

  if (!factor) {
    toast.error("Too many items to ship. Please contact us for bulk orders.", TOAST_CONFIG);
    return null;
  }
  return factor;
}

export function getShippingFee(
  address: { country: string; state?: string; city?: string },
  weights: Array<{ quantity: number; weight: number }>,
  type: ShippingType = "standard"
): number | null {
  const { state, country, city } = address;

  try {
    // ======================
    // 1. Calculate Total Weight (All Products Combined)
    // ======================
    const totalWeight = weights.reduce((sum, product) => {
      const productTotalWeight = product.weight * product.quantity;
      return sum + productTotalWeight;
    }, 0);

    // Handle floating point precision
    const preciseWeight = parseFloat(totalWeight.toFixed(2));

    // ======================
    // 2. Validate Weight Limit
    // ======================
    if (preciseWeight > MAX_ALLOWED_WEIGHT_KG) {
      toast.error(
        `Total order weight (${preciseWeight}kg) exceeds maximum ${MAX_ALLOWED_WEIGHT_KG}kg limit.`,
        TOAST_CONFIG
      );
      return null;
    }

    // ======================
    // 3. Nigeria Shipping Calculation
    // ======================
    if (country.toLowerCase() === "nigeria") {
      // Abuja special cases
      if (state?.toLowerCase() === "abuja") {
        const cityKey = city?.toLowerCase() || "";
        if (!abujaDeliveryFees[cityKey]) {
          toast.error("Delivery not available for this area of Abuja.", TOAST_CONFIG);
          return null;
        }
        return abujaDeliveryFees[cityKey];
      }

      // Find correct tier for calculated weight
      const feeTier = nigeriaDeliveryFees.find(tier => 
        preciseWeight > tier.min && preciseWeight <= tier.max
      );

      if (!feeTier) {
        // Fallback to highest tier if no match found
        return nigeriaDeliveryFees[nigeriaDeliveryFees.length - 1][type];
      }

      return feeTier[type];
    }

    // ======================
    // 4. International Shipping Calculation
    // ======================
    const region = getRegionByCountry(country);
    if (region === "UNKNOWN") {
      toast.error("We don't currently deliver to this country.", TOAST_CONFIG);
      return null;
    }

    // Apply scaling factor only for international
    const itemCount = weights.reduce((sum, item) => sum + item.quantity, 0);
    const sf = getScalingFactor(itemCount) || 1;
    const scaledWeight = preciseWeight * sf;

    const feeTable = type === "standard"
      ? standardInternationalDeliveryFees
      : expressInternationalDeliveryFees;

    const feeTier = feeTable.find(
      (tier) => scaledWeight > tier.min && scaledWeight <= tier.max
    ) || feeTable[feeTable.length - 1];

    return feeTier[region as keyof typeof feeTier];

  } catch (error) {
    console.error("Shipping calculation error:", error);
    toast.error("Failed to calculate shipping. Please try again.", TOAST_CONFIG);
    return null;
  }
}