import db from "@/lib/db";

export async function GET() {
  try {
    const [ride_info] = await db.query(
      "SELECT r.id, c.name AS customer_name, d.name AS driver_name, r.pickup_address, r.destination_address, r.status FROM ride r LEFT JOIN driver d ON r.driver_id = d.id JOIN customer c ON r.customer_id = c.id"
    );
    return Response.json({ rides_info: ride_info });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}