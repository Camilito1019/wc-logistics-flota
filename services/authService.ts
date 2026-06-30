import { supabase } from "@/lib/supabase/client";
import type { Usuario } from "@/types/user";

export async function loginWithCedulaAndPin(
  cedula: string,
  pin: string
): Promise<{ user: Usuario | null; error: string | null }> {
  if (!/^\d+$/.test(cedula) || !/^\d+$/.test(pin)) {
    return {
      user: null,
      error: "La cédula y el PIN solo pueden contener números.",
    };
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("cedula", cedula)
    .eq("pin", pin)
    .eq("activo", true)
    .single();

  if (error || !data) {
    console.log("ERROR LOGIN SUPABASE:", error);

    return {
      user: null,
      error: error?.message || "Cédula o PIN incorrectos.",
    };
  }

  return {
    user: data as Usuario,
    error: null,
  };
}