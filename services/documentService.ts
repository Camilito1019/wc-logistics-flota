import { supabase } from "@/lib/supabase/client";
import type { Documento } from "@/types/document";

export async function getDocumentosVehiculo(vehiculoId: number) {
  const { data, error } = await supabase
    .from("documentos")
    .select(`
      *,
      tipos_documentos (
        id,
        categoria_id,
        nombre,
        requiere_vencimiento,
        activo
      )
    `)
    .eq("vehiculo_id", vehiculoId)
    .eq("activo", true)
    .order("id", { ascending: true });

  if (error) {
    return { documentos: [], error: error.message };
  }

  return { documentos: data as Documento[], error: null };
}

export async function subirDocumentoVehiculo(params: {
  vehiculoId: number;
  tipoDocumentoId: number;
  archivo: File;
  fechaVencimiento?: string;
  observaciones?: string;
}) {
  const extension = params.archivo.name.split(".").pop();
  const nombreArchivo = `${Date.now()}-${params.archivo.name}`;
  const ruta = `vehiculos/${params.vehiculoId}/${nombreArchivo}`;

  const { error: uploadError } = await supabase.storage
    .from("documentos-flota")
    .upload(ruta, params.archivo, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    return { documento: null, error: uploadError.message };
  }

  const { data, error } = await supabase
    .from("documentos")
    .insert([
      {
        vehiculo_id: params.vehiculoId,
        tipo_documento_id: params.tipoDocumentoId,
        nombre_archivo: params.archivo.name,
        ruta_archivo: ruta,
        mime_type: params.archivo.type || extension,
        fecha_vencimiento: params.fechaVencimiento || null,
        observaciones: params.observaciones || null,
        activo: true,
      },
    ])
    .select()
    .single();

  if (error) {
    return { documento: null, error: error.message };
  }

  return { documento: data as Documento, error: null };
}

export async function descargarDocumento(rutaArchivo: string) {
  const { data, error } = await supabase.storage
    .from("documentos-flota")
    .createSignedUrl(rutaArchivo, 60);

  if (error || !data) {
    return { url: null, error: error?.message || "No se pudo generar la descarga." };
  }

  return { url: data.signedUrl, error: null };
}

export async function eliminarDocumento(id: number) {
  const { error } = await supabase
    .from("documentos")
    .update({ activo: false })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, error: null };
}