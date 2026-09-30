export type DriverLocation = {
    current_lat: number;
    current_lng: number;
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

export type Driver = {
  id: number;
  name: string;
  phone: string;
  status: "offline" | "online" | "busy";
  current_lat: number;  
  current_lng: number;
};

export type Login ={
    phone : string;
    password : string;
}

export type LoginResponse ={
    message : string;
    driver : Driver;
}

export type SessionResponse = {
  driver: Driver;
  totalRides: number;
};
export type DriverStatus = "online" | "offline";

export type StatusResponse ={
  message : string;
}
export type RideAction ={
  action: string;
  rideId: number;
}
