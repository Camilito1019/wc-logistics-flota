import Image from "next/image";
import type { Conductor } from "@/types/driver";

type Props = {
  conductor: Conductor;
};

export default function DriverCard({ conductor }: Props) {
  const imagen =
    conductor.foto || "/images/conductores/default-driver.png";

  return (
    <article className="glass relative overflow-hidden rounded-[2rem] p-6 transition hover:-translate-y-1">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,.35),transparent_45%)]" />

      <div className="relative z-10">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/20 px-3 py-2 text-sm font-bold text-emerald-200">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          {conductor.activo ? "Activo" : "Baja"}
        </div>

        <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl">
          <Image
            src={imagen}
            alt={conductor.nombre}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-2xl font-black">{conductor.nombre}</h3>
          <p className="mt-2 text-slate-300">Cédula: {conductor.cedula}</p>
          <p className="mt-1 text-slate-300">
            Teléfono: {conductor.telefono || "No registrado"}
          </p>
        </div>

        <a
          href={`/conductores/${conductor.id}`}
          className="mt-7 flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-lg font-bold text-white transition hover:bg-white/20"
        >
          Ver documentos →
        </a>
      </div>
    </article>
  );
}