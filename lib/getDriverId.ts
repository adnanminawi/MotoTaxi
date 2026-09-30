import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getDriverId(): Promise<number | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { driverId: number };
    return payload.driverId;
  } catch {
    return null;
  }
}