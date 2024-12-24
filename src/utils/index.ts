import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with a complexity of 10
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using the generated salt
    return hashedPassword; // Return the hashed password
  } catch (error) {
    // Handle error
    throw new Error("Error hashing password");
  }
}

export function generateJwtToken(user: any): string {
  const payload = {
    username: user.username,
    userId: user._id,
    role: user?.role ?? "admin",
  };
  const secretKey = process.env.JWT_SECRET_KEY || "default-secret-key";
  const expiresIn = process.env.JWT_ACCESS_LIFETIME || "2d";
  return jwt.sign(payload, secretKey, { expiresIn });
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
