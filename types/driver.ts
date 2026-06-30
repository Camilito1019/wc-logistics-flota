export type Conductor = {
  id: number;
  nombre: string;
  cedula: string;
  telefono?: string;
  direccion?: string;
  foto?: string;
  activo: boolean;
  fecha_creacion?: string;
};