import API from "@/services/api";
import { IAppointment } from "../types/appointment";

export async function getPendingAppointments(): Promise<IAppointment[]> {
  const res = await API.get("/staff/appointments/pending");
  return res.data;
}