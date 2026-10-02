import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [driverStats] = await db.query<RowDataPacket[]>(
      `SELECT
        COUNT(*) AS total,
        SUM(status = 'online') AS online,
        SUM(status = 'offline') AS offline,
        SUM(status = 'busy') AS busy
      FROM driver`
    );

    const [rideStats] = await db.query<RowDataPacket[]>(
      `SELECT
        COUNT(*) AS total,
        SUM(status = 'completed') AS completed,
        SUM(status = 'searching') AS searching,
        SUM(status = 'cancelled') AS cancelled
      FROM ride`
    );

    const [customers] = await db.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM customer"
    );

    const [recentCustomers] = await db.query<RowDataPacket[]>(
      `SELECT id, name, phone, created_at
       FROM customer
       ORDER BY created_at DESC
       LIMIT 5`
    );

    const d = driverStats[0];
    const r = rideStats[0];

    return Response.json({
      total_drivers: d.total,
      online: Number(d.online),
      offline: Number(d.offline),
      busy: Number(d.busy),

      total_rides: r.total,
      completed_rides: Number(r.completed),
      searching_rides: Number(r.searching),   
      cancelled_rides: Number(r.cancelled),

      total_customers: customers[0].total,
      recent_customers: recentCustomers,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}