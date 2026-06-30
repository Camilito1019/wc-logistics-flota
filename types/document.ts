export type TipoDocumento = {
  id: number;
  categoria_id: number;
  nombre: string;
  requiere_vencimiento: boolean;
  activo: boolean;
};

export type Documento = {
  id: number;
  vehiculo_id?: number;
  conductor_id?: number;
  tipo_documento_id: number;
  nombre_archivo?: string;
  ruta_archivo?: string;
  mime_type?: string;
  fecha_vencimiento?: string;
  observaciones?: string;
  activo: boolean;
  fecha_subida?: string;
  tipos_documentos?: TipoDocumento;
};