import { supabase } from "@/lib/supabase/client";
import type { Vehiculo } from "@/types/vehicle";

export async function getVehiculos() {
  const { data, error } = await supabase
    .from("vehiculos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return { vehiculos: [], error: error.message };
  }

  return { vehiculos: data as Vehiculo[], error: null };
}

export async function crearVehiculo(payload: Partial<Vehiculo>) {
  const { data, error } = await supabase
    .from("vehiculos")
    .insert([payload])
    .select()
    .single();

  if (error) {
    return { vehiculo: null, error: error.message };
  }

  return { vehiculo: data as Vehiculo, error: null };
}

export async function getVehiculoById(id: number) {
  const { data, error } = await supabase
    .from("vehiculos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { vehiculo: null, error: error.message };
  }

  return { vehiculo: data as Vehiculo, error: null };
}