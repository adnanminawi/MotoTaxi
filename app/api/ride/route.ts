import db from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { findNearestDriver } from "@/lib/findNearestDriver";
async function getAddress(lat: number, lng: number) {
  try{
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    {headers: { "User-Agent": "MotoTaxiApp/1.0" }});
    const data = await res.json();
    return data.display_name ?? null;
  } catch(error){
    return null;
    }
}

export async function GET() {
    try{
        const [ride_info] = await db.query("SELECT r.id,c.name AS customer_name, d.name AS driver_name, r.pickup_address, r.destination_address, r.status FROM ride r LEFT JOIN driver d ON driver_id=d.id JOIN customer c ON customer_id=c.id");
        return Response.json({ rides_info: ride_info});
    } catch (error) {
  console.error(error);
  return Response.json({ message: "Something went wrong." }, { status: 500 });
}
}

export async function POST(request:Request){
  const {name, phone,pickup_lat,pickup_lng,destination_lat,destination_lng,status} = await request.json();
 if (!name || !phone ||pickup_lat === undefined || pickup_lng === undefined || destination_lat === undefined ||destination_lng === undefined) {
  return Response.json(
    { message: "Missing required fields: name, phone, and pickup/destination coordinates are required." },
    { status: 400 }
  );
}
  try{
    const[get_cust]= await db.query<RowDataPacket[]>("SELECT id FROM customer Where phone=?",
    [phone]);


let customer_id;
if (get_cust.length > 0) {
customer_id = get_cust[0].id;
} else {
const [newCust] = await db.query<ResultSetHeader>("INSERT INTO customer (name, phone) VALUES (?, ?)", [name, phone]);
customer_id = newCust.insertId;
}

const pickup_address = await getAddress(pickup_lat, pickup_lng);
const destination_address = await getAddress(destination_lat, destination_lng);

    const [create_ride] = await db.query<ResultSetHeader>("INSERT INTO ride(customer_id,pickup_lat,pickup_lng,pickup_address,destination_lat,destination_lng,destination_address,status) VALUES (?,?,?,?,?,?,?,?)",
    [customer_id,pickup_lat,pickup_lng,pickup_address,destination_lat,destination_lng,destination_address,'searching']);
    const rideId = create_ride.insertId;


     const driver = await findNearestDriver(pickup_lat, pickup_lng);

    if (driver) {
      await db.query("UPDATE ride SET driver_id = ? WHERE id = ?", [driver.id, rideId]);
    } else {
      await db.query("UPDATE ride SET status = 'no_driver_found' WHERE id = ?", [rideId]);
    }

    const [driv] = await db.query<RowDataPacket[]>("SELECT d.name, d.phone FROM ride r JOIN driver d ON driver_id=d.id WHERE r.id=?",
      [rideId]);

    return Response.json(
      { ok: true, driver: driv[0] ?? null, rideId, assignedDriver: driver?.id ?? null },
      { status: 201 }
    );
  }catch (error) {
  console.error(error);
  return Response.json({ message: "Something went wrong." }, { status: 500 });
}

}