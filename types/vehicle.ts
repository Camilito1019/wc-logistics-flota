export type Vehiculo = {
  id: number;
  placa: string;
  marca?: string;
  linea?: string;
  modelo?: string;
  color?: string;
  color_hex?: string;
  tipo_vehiculo?: string;
  foto_principal?: string;
  observaciones?: string;
  activo: boolean;
  fecha_creacion?: string;
};