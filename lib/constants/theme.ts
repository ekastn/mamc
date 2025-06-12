// Theme colors and style constants
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Helper function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Main color palette based on Bauhaus design principles
export const COLORS = {
  // Primary colors
  PRIMARY: {
    YELLOW: "#FFD500",
    BLUE: "#1C3F95",
    RED: "#E41E26",
    BLACK: "#000000",
    WHITE: "#FFFFFF",
  },
  // Secondary/shade variations
  SECONDARY: {
    YELLOW_DARK: "#E6C000",
    BLUE_DARK: "#15307A",
    RED_DARK: "#C41920",
  },
  // For future expansion
  GRAY: {
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  }
}

// Tailwind CSS classes for colors
export const COLOR_CLASSES = {
  // Background colors
  BG: {
    YELLOW: "bg-[#FFD500]",
    YELLOW_LIGHT: "bg-[#FFD500]/10",
    BLUE: "bg-[#1C3F95]",
    BLUE_LIGHT: "bg-[#1C3F95]/10",
    RED: "bg-[#E41E26]",
    RED_LIGHT: "bg-[#E41E26]/10",
    BLACK: "bg-black",
    BLACK_LIGHT: "bg-black/10",
    WHITE: "bg-white",
  },
  // Border colors
  BORDER: {
    YELLOW: "border-[#FFD500]",
    BLUE: "border-[#1C3F95]",
    RED: "border-[#E41E26]",
    BLACK: "border-black",
    WHITE: "border-white",
  },
  // Text colors
  TEXT: {
    YELLOW: "text-[#FFD500]",
    BLUE: "text-[#1C3F95]",
    RED: "text-[#E41E26]",
    BLACK: "text-black",
    WHITE: "text-white",
  },
  // Gradients
  GRADIENT: {
    YELLOW: "bg-gradient-to-r from-[#FFD500] to-[#FFA500]",
    BLUE: "bg-gradient-to-r from-[#1C3F95] to-[#0F2A63]",
    RED: "bg-gradient-to-r from-[#E41E26] to-[#B71C1C]",
    BLACK: "bg-gradient-to-r from-black to-gray-800",
  }
}

// CSS variable mappings (for future reference)
export const CSS_VARIABLES = {
  // These map to the CSS variables defined in globals.css
  BACKGROUND: "var(--background)",
  FOREGROUND: "var(--foreground)",
  CARD: "var(--card)",
  CARD_FOREGROUND: "var(--card-foreground)",
  POPOVER: "var(--popover)",
  POPOVER_FOREGROUND: "var(--popover-foreground)",
  PRIMARY: "var(--primary)",
  PRIMARY_FOREGROUND: "var(--primary-foreground)",
  SECONDARY: "var(--secondary)",
  SECONDARY_FOREGROUND: "var(--secondary-foreground)",
  MUTED: "var(--muted)",
  MUTED_FOREGROUND: "var(--muted-foreground)",
  ACCENT: "var(--accent)",
  ACCENT_FOREGROUND: "var(--accent-foreground)",
  DESTRUCTIVE: "var(--destructive)",
  DESTRUCTIVE_FOREGROUND: "var(--destructive-foreground)",
  BORDER: "var(--border)",
  INPUT: "var(--input)",
  RING: "var(--ring)",
}
