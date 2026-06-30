import { supabase } from "@/lib/supabase/client";
import type { Conductor } from "@/types/driver";

export async function getConductores() {
  const { data, error } = await supabase
    .from("conductores")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return { conductores: [], error: error.message };
  }

  return { conductores: data as Conductor[], error: null };
}