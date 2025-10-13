export interface DecodedToken {
  id: number;
  name: string;
  role: "admin" | "analyst";
  iat?: number;
  exp?: number;
}