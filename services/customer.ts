import api from "./axios";
import {  type DriverLocation, type CreateRide, type RideResult } from "@/types";


export async function fetchRideLocation(rideId :number): Promise<DriverLocation >{
    const res = await api.get<{location: DriverLocation }>(`/ride/${rideId}`);
    return res.data.location;

}

export async function createRide(data : CreateRide): Promise<RideResult>{
    const res = await api.post<RideResult>("/ride", data);
    return res.data;
    
}