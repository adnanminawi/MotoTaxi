import db from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { findNearestDriver } from "@/lib/findNearestDriver";

export type RideResult =
    | { ok: true }
    | { ok: false; reason: "conflict" | "not_found" };

export type RejectResult = { ok: true; assignedDriver: number | null };

export async function acceptRide(rideId: number, driverId: number): Promise<RideResult> {

    const [result] = await db.query<ResultSetHeader>(
        "UPDATE ride SET status = 'assigned', assigned_at = NOW() WHERE id = ? AND driver_id = ? AND status = 'searching'",
        [rideId, driverId]

    );
    if (result.affectedRows === 0) return { ok: false, reason: "conflict" };

    await db.query("UPDATE driver SET status = 'busy' WHERE id = ?", [driverId]);
    return { ok: true };
}

export async function markArrived(rideId: number, driverId: number): Promise<RideResult> {
    const [result] = await db.query<ResultSetHeader>(
        "UPDATE ride SET status = 'en_route' WHERE id = ? AND driver_id = ? AND status = 'assigned'",
        [rideId, driverId]
    );
    if (result.affectedRows === 0) return { ok: false, reason: "conflict" };
    return { ok: true };
}

export async function completeRide(rideId: number, driverId: number): Promise<RideResult> {
    const [result] = await db.query<ResultSetHeader>(
        "UPDATE ride SET status = 'completed', completed_at = NOW() WHERE id = ? AND driver_id = ? AND status = 'en_route'",
        [rideId, driverId]
    );

    if (result.affectedRows === 0) return { ok: false, reason: "conflict" };

    await db.query("UPDATE driver SET status = 'online' WHERE id = ?", [driverId]);
    return { ok: true };
}

export async function rejectRide(rideId: number, driverId: number): Promise<RejectResult> {
    // BUG (kept): no ownership or state check
    const [rows] = await db.query<RowDataPacket[]>(
        "SELECT pickup_lat, pickup_lng, rejected_by FROM ride WHERE id = ?",
        [rideId]
    );
    const ride = rows[0]; // BUG (kept): undefined if the ride doesn't exist, so the next line crashes

    const rejected: number[] = ride.rejected_by ? ride.rejected_by.split(",").map(Number) : [];
    rejected.push(driverId);

    await db.query("UPDATE ride SET rejected_by = ? WHERE id = ?", [rejected.join(","), rideId]);

    const nextDriver = await findNearestDriver(ride.pickup_lat, ride.pickup_lng, rejected);

    if (nextDriver) {
        await db.query("UPDATE ride SET driver_id = ? WHERE id = ?", [nextDriver.id, rideId]);
    } else {
        await db.query("UPDATE ride SET driver_id = NULL, status = 'no_driver_found' WHERE id = ?", [rideId]);
    }

    return { ok: true, assignedDriver: nextDriver?.id ?? null };
}