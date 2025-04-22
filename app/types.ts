export type MBTIType = "EI" | "SN" | "TF" | "JP";

export type MBTIResult = {
  type: string;
  description: string;
  compatibleTypes: string[];
}; 