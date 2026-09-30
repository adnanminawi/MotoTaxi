  // app/api/drivers/me/route.ts
  import { cookies } from "next/headers";
  import jwt from "jsonwebtoken";
  import db from "@/lib/db";

  export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { driverId: number; role: string };
      // fetch fresh driver data using the id FROM THE TOKEN
      const [rows]: any = await db.query("SELECT id, name, phone, status, current_lat,current_lng FROM driver WHERE id = ?", [payload.driverId]);
      const driver = rows[0];
      const [countRows]: any = await db.query("SELECT COUNT(*) AS total FROM ride WHERE driver_id = ? AND status = 'completed'", [payload.driverId]);
      if (!driver) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json({ driver, totalRides: countRows[0].total });
    } catch {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }
  }