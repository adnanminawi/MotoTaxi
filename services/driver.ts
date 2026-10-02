import api from "./axios";
import { DriverLogin, DriverLoginResponse, SessionResponse, StatusResponse, DriverStatus, RideAction } from "@/types";

export async function login(data : DriverLogin): Promise<DriverLoginResponse>{
    const res = await api.post<DriverLoginResponse>("/drivers/login", data);
    return res.data;
}
export async function driverSession(): Promise<SessionResponse> {
    const res = await api.get<SessionResponse>("/drivers/session");
    return res.data;
}
export async function setStatus(status : DriverStatus): Promise<StatusResponse> {
    const res = await api.post<StatusResponse>("/drivers/status", {status});
    return res.data;
}
export async function rideService(data: RideAction){
    const res = await api.put("/drivers/ride", data);
    return res.data;
}

export async function logout() {
    const res = await api.post("/drivers/logout");
    return res.data;   
}