// Slice 1 starter lists. The spec calls for the project's already-standardised
// bilingual (Albanian/Serbian) municipality list — swap this placeholder for
// that list before rollout (see docs/setup.md → "Open items").
export const MUNICIPALITIES = [
  "Prishtinë / Priština",
  "Prizren",
  "Ferizaj / Uroševac",
  "Pejë / Peć",
  "Gjakovë / Đakovica",
  "Gjilan / Gnjilane",
  "Mitrovicë / Mitrovica",
  "Podujevë / Podujevo",
  "Vushtrri / Vučitrn",
  "Suharekë / Suva Reka",
  "Rahovec / Orahovac",
  "Lipjan / Lipljan",
  "Drenas / Glogovac",
  "Skenderaj / Srbica",
  "Malishevë / Mališevo",
  "Deçan / Dečani",
  "Istog / Istok",
  "Klinë / Klina",
  "Kamenicë / Kamenica",
  "Viti / Vitina",
  "Other / Tjetër",
];

export const SUBSECTORS = [
  "Apparel / clothing manufacturing",
  "Textile production (fabric/yarn)",
  "Leather goods",
  "Footwear",
  "Traditional / handicraft textiles (embroidery, weaving)",
  "Fashion design / branding",
  "Other",
];

export const FORMALITY_STATUSES = [
  { value: "formal", label: "Formal (KBRA-registered)" },
  { value: "informal", label: "Informal (not registered)" },
] as const;
