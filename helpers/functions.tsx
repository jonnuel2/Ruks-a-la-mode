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

// Type Definitions
type ShippingTier = {
  min: number;
  max: number;
  standard: number;
  express: number;
};

type InternationalShippingTier = Omit<ShippingTier, "standard" | "express"> & {
  [region: string]: number; // Index signature for regions
};

type ShippingType = "standard" | "express";

// Constants
const MAX_ALLOWED_WEIGHT_KG = 20;
const BASE_WEIGHT = 1;

export const slugify = (text: string) => {
  return (
    text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "") ?? ""
  );
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
    toast.error("Too many items to ship. Please contact us for bulk orders.", {
      position: "top-right",
      autoClose: 5000,
    });
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
    // 1. Calculate ACTUAL total weight (sum of all items' total weights)
    const totalUnscaledWeight = weights.reduce(
      (sum, item) => sum + item.weight * item.quantity,
      0
    );

    // 2. Immediate weight check (before scaling)
    if (totalUnscaledWeight > MAX_ALLOWED_WEIGHT_KG) {
      toast.error(
        `Order exceeds maximum shippable weight (${MAX_ALLOWED_WEIGHT_KG}kg). Please reduce quantity or contact us.`,
        { position: "top-right", autoClose: 5000 }
      );
      return null;
    }

    // 3. Get scaling factor
    const itemCount = weights.reduce((sum, item) => sum + item.quantity, 0);
    const sf = getScalingFactor(itemCount);
    if (!sf) return null;

    // 4. Calculate final scaled weight
    // const totalWeight = (BASE_WEIGHT + totalUnscaledWeight) * (sf || 1);
    const totalWeight = totalUnscaledWeight * (sf || 1);

    // Nigeria shipping
    if (country.toLowerCase() === "nigeria") {
      if (state?.toLowerCase() === "abuja") {
        const cityKey = city?.toLowerCase() || "";
        if (!(cityKey in abujaDeliveryFees)) {
          toast.error("Invalid Abuja City.");
          return null;
        }
        return abujaDeliveryFees[cityKey];
      }

      // const feeTier = (nigeriaDeliveryFees as ShippingTier[]).find(
      //   (tier) => totalWeight >= tier.min && totalWeight < tier.max
      // ) || nigeriaDeliveryFees[nigeriaDeliveryFees.length - 1];

      // With this (strict tier bounds):
      const feeTier =
        (nigeriaDeliveryFees as ShippingTier[]).find(
          (tier) => totalWeight > tier.min && totalWeight <= tier.max
        ) || nigeriaDeliveryFees[0]; // Fallback to first tier

      return feeTier[type];

      console.log({
        inputWeights: weights,
        totalUnscaledWeight,
        scalingFactor: sf,
        calculatedWeight: totalWeight,
        selectedTier: feeTier
      });
    }

    

    // International shipping
    const region = getRegionByCountry(country);
    if (region === "UNKNOWN") {
      toast.error("We don't deliver to this location yet.");
      return null;
    }

    const feeTable =
      type === "standard"
        ? (standardInternationalDeliveryFees as InternationalShippingTier[])
        : (expressInternationalDeliveryFees as unknown as InternationalShippingTier[]);

    const feeTier =
      feeTable.find(
        (tier) => totalWeight >= tier.min && totalWeight < tier.max
      ) || feeTable[feeTable.length - 1];

    return feeTier[region];
  } catch (error) {
    console.error("Shipping calculation error:", error);
    toast.error("Error calculating shipping. Please try again.");
    return null;
  }
}
