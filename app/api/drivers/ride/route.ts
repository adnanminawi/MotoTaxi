import db from "@/lib/db";
import { RowDataPacket,ResultSetHeader  } from "mysql2";
import { findNearestDriver } from "@/lib/findNearestDriver";
import { getDriverId } from "@/lib/getDriverId";



export async function GET() {
  const driverId = await getDriverId();
  if (!driverId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rides] = await db.query<RowDataPacket[]>(
      `SELECT
        ride.*,
        customer.name AS customer_name,
        customer.phone AS customer_phone
      FROM ride
      JOIN customer ON ride.customer_id = customer.id
      WHERE ride.status = 'searching' AND ride.driver_id = ?
      ORDER BY ride.id DESC
      LIMIT 1`,
      [driverId]
    );

    return Response.json({ rides_info: rides });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch rides" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    
    const driverId = await getDriverId();
    if (!driverId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { action, rideId } = await req.json();
  
  
    if (action === "accept") {
      const [result] = await db.query<ResultSetHeader>(
      "UPDATE ride SET driver_id = ?, status = 'assigned', assigned_at = NOW() WHERE id = ? AND status = 'searching'",
      [driverId, rideId]
      );

    if (result.affectedRows === 0) {
    return Response.json({ message: "Ride already taken" }, { status: 409 });
    }

    await db.query("UPDATE driver SET status = 'busy' WHERE id = ?", [driverId]);
    return Response.json({ message: "Ride accepted successfully" })
    }


    if(action ==="arrived"){
      const [result] = await db.query<ResultSetHeader>(
        "UPDATE ride SET status = 'en_route' WHERE id=? AND driver_id= ? AND status='assigned'",
        [rideId,driverId]
      );  
      if (result.affectedRows === 0) {
      return Response.json({ message: "Ride not in a state to mark arrived" }, { status: 409 });
      }
    return Response.json({ message: "Arrived at pickup" });
    }

    if(action == "reject"){
      const [rows] = await db.query<RowDataPacket[]>("SELECT pickup_lat, pickup_lng, rejected_by FROM ride WHERE id=?",
        [rideId]);
        const ride = rows[0];


    const rejected = ride.rejected_by ? ride.rejected_by.split(",").map(Number) : [];
    rejected.push(Number(driverId));

    await db.query("UPDATE ride SET rejected_by = ? WHERE id = ?", [rejected.join(","), rideId]);
    
    const nextDriver = await findNearestDriver(ride.pickup_lat, ride.pickup_lng, rejected);

      if (nextDriver) {
        await db.query("UPDATE ride SET driver_id = ? WHERE id = ?", [nextDriver.id, rideId]);
      } else {
        await db.query("UPDATE ride SET driver_id = NULL, status = 'no_driver_found' WHERE id = ?", [rideId]);
      }
      return Response.json({
        message: nextDriver ? "Reassigned to next driver" : "No drivers left",
        assignedDriver: nextDriver?.id ?? null,
      });
    }

    

  if (action === "complete") {
  
  const [result]: any = await db.query<ResultSetHeader>("UPDATE ride SET status = 'completed', completed_at = NOW() WHERE id = ? AND driver_id = ? AND status = 'en_route'",
  [rideId,driverId]);

  const [driverResult]= await db.query("UPDATE driver SET status='online' WHERE id=?",
    [driverId]);

    if (result.affectedRows === 0) {
    return Response.json({ message: "Ride not in a state to complete" }, { status: 409 });
    }

    await db.query("UPDATE driver SET status = 'online' WHERE id = ?", [driverId]);
    return Response.json({ message: "Ride completed successfully" });
  }

    
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update ride" },
      { status: 500 }
    );
  }
}

