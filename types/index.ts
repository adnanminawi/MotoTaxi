export type DriverLocation = {
    current_lat: string;
    current_lng: string;
    name : string;
    phone: string;
}
export type CreateRide = {
    name : string;
    phone : string;
    pickup_lat: number;
    pickup_lng: number;
    destination_lat : number;
    destination_lng : number;
}

export type RideResult = {
  ok: boolean;
  driver: { name: string; phone: string } | null;
  rideId: number;
  assignedDriver: number | null;
}