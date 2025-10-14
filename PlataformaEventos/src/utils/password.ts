import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // Podrías usar parseInt(process.env.SALT_ROUNDS || "10")

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};
