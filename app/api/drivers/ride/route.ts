import db from "@/lib/db";
import { RowDataPacket,ResultSetHeader  } from "mysql2";
import { findNearestDriver } from "@/lib/findNearestDriver";
import { getDriverId } from "@/lib/getDriverId";
export async function GET() {
  try {
   const [rides] = await db.query(
  `SELECT
    ride.*,
    customer.name AS customer_name,
    customer.phone AS customer_phone
FROM ride
JOIN customer
    ON ride.customer_id = customer.id
WHERE ride.status = 'searching'
ORDER BY ride.id DESC
LIMIT 1`
);

    return Response.json({
      rides_info: rides,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch rides" },
      { status: 500 }
    );
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
  
  const [result]: any = await db.query(`UPDATE ride SET status = 'completed', completed_at = NOW() WHERE id = ?`,
  [rideId]);

  const [driverResult]= await db.query("UPDATE driver SET status='online' WHERE id=?",
    [driverId]);


      console.log("Complete update result:");

  return Response.json({
    message: "Ride completed successfully",
    result,
  });
}

    
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update ride" },
      { status: 500 }
    );
  }
}

