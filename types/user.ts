export type Rol = {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
};

export type Usuario = {
  id: number;
  cedula: string;
  nombre: string;
  pin: string;
  rol_id: number;
  activo: boolean;
  correo?: string;
  telefono?: string;
  ultimo_acceso?: string;
  roles?: Rol;
};