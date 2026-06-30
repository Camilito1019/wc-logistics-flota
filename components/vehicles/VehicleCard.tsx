import Image from "next/image";
import type { Vehiculo } from "@/types/vehicle";

type Props = {
  vehiculo: Vehiculo;
};

const imagenesVehiculos: Record<string, string> = {
  KSQ126: "/images/vehiculos/KSQ126.png",
  PUP024: "/images/vehiculos/PUP024.png",
  NUZ109: "/images/vehiculos/NUZ109.png",
};

export default function VehicleCard({ vehiculo }: Props) {
  const placa = vehiculo.placa?.toUpperCase().replace(/\s/g, "");
  const color = vehiculo.color_hex || "#2563eb";

  const imagen =
    vehiculo.foto_principal ||
    imagenesVehiculos[placa] ||
    "/images/vehiculos/default-truck.png";

  return (
    <article className="glass group relative h-[520px] overflow-hidden rounded-[2rem] p-6 transition hover:-translate-y-1">
      <div
        className="absolute inset-0 opacity-45"
        style={{
          background: `radial-gradient(circle at 50% 72%, ${color}, transparent 48%)`,
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,.08),rgba(15,23,42,.40))]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/20 px-3 py-2 text-sm font-bold text-emerald-200">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          {vehiculo.activo ? "Activo" : "Baja"}
        </div>

        <div className="relative mx-auto mt-1 h-64 w-full">
          <Image
            src={imagen}
            alt={`Camión ${placa}`}
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        <div className="plate mx-auto mt-1 w-fit rounded-xl px-7 py-2 text-center text-4xl font-black">
          {placa}
          <div className="text-[10px] tracking-[3px]">COLOMBIA</div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-200">
          <span style={{ color }}>●</span>
          <span>Marca: {vehiculo.marca || "N/A"}</span>
          <span>Modelo: {vehiculo.modelo || "N/A"}</span>
          <span>Color: {vehiculo.color || "N/A"}</span>
        </div>

        <a
          href={`/vehiculos/${vehiculo.id}`}
          className="mt-auto flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-lg font-bold text-white transition hover:bg-white/20"
        >
          Ver documentos →
        </a>
      </div>
    </article>
  );
}