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

type InternationalShippingTier = {
  min: number;
  max: number;
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
function getRegionByCountry(country: string): string | null {
  const countryLower = country.toLowerCase().trim();
  
  // First check exact matches
  for (const [region, countries] of Object.entries(countryGroups)) {
    if (countries.some(c => c.toLowerCase() === countryLower)) {
      // Special case for France in standard shipping
      // if (countryLower === "france") return "FRA"; 

      return region;
    }
  }

  // Handle common alternative names
  const countryAliases: Record<string, string> = {
    "usa": "United States",
    "u.s.a": "United States",
    "u.s.": "United States",
    "america": "United States",
    "uk": "United Kingdom",
    "england": "United Kingdom",
    "great britain": "United Kingdom",
    "gb": "United Kingdom",
    "ivory coast": "Cote D Ivoire",
  };

  if (countryLower in countryAliases) {
    return getRegionByCountry(countryAliases[countryLower]);
  }

  return null;
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

function checkShippingSupport(region: string, type: ShippingType): boolean {
  if (type === "standard") {
    return standardInternationalDeliveryFees.some(tier => tier[region as keyof typeof tier] !== undefined);
  } else {
    return expressInternationalDeliveryFees.some(tier => tier[region as keyof typeof tier] !== undefined);
  }
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
      return sum + (product.weight * product.quantity);
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
    
    if (!region) {
      // Suggest similar countries if available
      const allCountries = Object.values(countryGroups).flat();
      const suggestions = allCountries.filter(c => 
        c.toLowerCase().includes(country.toLowerCase()) ||
        country.toLowerCase().includes(c.toLowerCase())
      ).slice(0, 3);
      
      const message = suggestions.length 
        ? `We don't deliver to ${country}. Did you mean: ${suggestions.join(", ")}?`
        : `We don't currently deliver to ${country}.`;
      
      toast.error(message, TOAST_CONFIG);
      return null;
    }

    // Check if shipping type is supported for this region
    // if (!checkShippingSupport(region, type)) {
    //   toast.error(
    //     `${type.charAt(0).toUpperCase() + type.slice(1)} shipping is not available to ${country}.`,
    //     TOAST_CONFIG
    //   );
    //   return null;
    // }
    if (!checkShippingSupport(region, type)) {
      const alternativeType = type === 'standard' ? 'express' : 'standard';
      
      if (checkShippingSupport(region, alternativeType)) {
        toast.error(
          `${type.charAt(0).toUpperCase() + type.slice(1)} shipping is not available to ${country}. ` +
          `Would you like to try ${alternativeType} shipping instead?`,
          {
            ...TOAST_CONFIG,
            autoClose: 8000 // Longer display for more complex message
          }
        );
      } else {
        toast.warning(
          // `${type.charAt(0).toUpperCase() + type.slice(1)} shipping is not available to ${country}. ` +
          `We don't currently deliver to ${country}. Please contact us.`,
         
          {
            ...TOAST_CONFIG,
            autoClose: 8000 // Longer display for more complex message
          }
        );
      }
      return null;
    }

    // Apply scaling factor only for international
    const itemCount = weights.reduce((sum, item) => sum + item.quantity, 0);
    const sf = getScalingFactor(itemCount) || 1;
    const scaledWeight = preciseWeight * sf;

    const feeTable = type === "standard"
      ? standardInternationalDeliveryFees
      : expressInternationalDeliveryFees;

    const feeTier = feeTable.find(tier => 
      scaledWeight > tier.min && scaledWeight <= tier.max
    );

    if (!feeTier) {
      toast.error("Weight exceeds international shipping limits", TOAST_CONFIG);
      return null;
    }

    // Handle special cases for US/CAN and UK
    if (region === "US_CAN") {
      if (country.toLowerCase() === "united states") {
        return "US" in feeTier ? (feeTier["US"] as number | null) : (feeTier["US_CAN"] as number | null);
      }
      if (country.toLowerCase() === "canada") {
        return "CAN" in feeTier ? feeTier["CAN"] : feeTier["US_CAN"];
      }
    }
    else if (region === "UK") {
      return feeTier["UK"] || ("EUROPE" in feeTier ? feeTier["EUROPE"] : null);
    }
    else if (region === "EUROPE" && country.toLowerCase() === "france") {
      return "FRA" in feeTier ? feeTier["FRA"] : ("EUROPE" in feeTier ? feeTier["EUROPE"] : null);
    }

    const fee = feeTier[region as keyof typeof feeTier];
    if (fee === undefined || fee === null) {
      toast.error(
        `Shipping to ${country} is currently unavailable. Please check back later.`,
        TOAST_CONFIG
      );
      return null;
    }

    return fee;

  } catch (error) {
    console.error("Shipping calculation error:", error);
    toast.error("Failed to calculate shipping. Please try again.", TOAST_CONFIG);
    return null;
  }
}