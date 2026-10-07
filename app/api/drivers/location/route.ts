import db from "@/lib/db";
import { getDriverId } from "@/lib/getDriverId";

export async function POST(req: Request) {
  const driverId = await getDriverId();
  if (!driverId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { lat, lng } = await req.json();

    if (lat === undefined || lng === undefined) {
      return Response.json({ error: "lat and lng are required" }, { status: 400 });
    }

    await db.query(
      "UPDATE driver SET current_lat = ?, current_lng = ?, last_location_update = NOW() WHERE id = ?",
      [lat, lng, driverId]
    );

    return Response.json({ message: "Location updated" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}