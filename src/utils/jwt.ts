import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export function generateJWT(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function checkAuthToken(headers: Record<string, string | undefined>) {
  const authHeader = headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    throw new Error("Missing or invalid Authorization header");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload as { id: string; email: string }; // adjust based on your token payload
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}