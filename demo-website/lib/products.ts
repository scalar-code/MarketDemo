export type Heat = "mild" | "hot" | "insane";

export type Product = {
  id: string;
  no: string;
  name: string;
  tagline: string;
  notes: string[];
  price: number;
  heat: Heat;
  scoville: number;
  sauce: string;
  accent: string;
  label: string;
};

export const products: Product[] = [
  {
    id: "original",
    no: "01",
    name: "Molten Original",
    tagline: "Habanero × roasted garlic",
    notes: ["Bright", "Garlicky", "Slow burn"],
    price: 14,
    heat: "hot",
    scoville: 48000,
    sauce: "#ff4d12",
    accent: "#ff6a1f",
    label: "#0b0908",
  },
  {
    id: "smoked-ember",
    no: "02",
    name: "Smoked Ember",
    tagline: "Chipotle × black garlic",
    notes: ["Smoky", "Umami", "Deep"],
    price: 16,
    heat: "mild",
    scoville: 9000,
    sauce: "#7a2410",
    accent: "#c2551f",
    label: "#1a1210",
  },
  {
    id: "citrus-flare",
    no: "03",
    name: "Citrus Flare",
    tagline: "Scotch bonnet × mango",
    notes: ["Tropical", "Zesty", "Punchy"],
    price: 15,
    heat: "hot",
    scoville: 110000,
    sauce: "#ff9a1a",
    accent: "#ffb23f",
    label: "#0b0908",
  },
  {
    id: "black-label",
    no: "04",
    name: "Black Label Reserve",
    tagline: "Ghost pepper × aged molasses",
    notes: ["Aged 12 mo", "Complex", "Savage"],
    price: 28,
    heat: "insane",
    scoville: 850000,
    sauce: "#a8140b",
    accent: "#ff3b1f",
    label: "#000000",
  },
];

export const heatLabel: Record<Heat, string> = {
  mild: "Warm",
  hot: "Hot",
  insane: "Molten",
};

export const heatLevel: Record<Heat, number> = { mild: 2, hot: 4, insane: 5 };
