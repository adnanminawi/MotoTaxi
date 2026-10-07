import db from "@/lib/db";
import { getDriverId } from "@/lib/getDriverId";

export async function GET() {
  const driverId = await getDriverId();
  if (!driverId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT id, name, phone, status, current_lat, current_lng FROM driver WHERE id = ?",
      [driverId]
    );
    const driver = rows[0];
    if (!driver) return Response.json({ error: "Not found" }, { status: 404 });

    const [countRows]: any = await db.query(
      "SELECT COUNT(*) AS total FROM ride WHERE driver_id = ? AND status = 'completed'",
      [driverId]
    );

    return Response.json({ driver, totalRides: countRows[0].total });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}