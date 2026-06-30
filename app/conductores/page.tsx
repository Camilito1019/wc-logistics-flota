"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import DriverCard from "@/components/drivers/DriverCard";
import { getConductores } from "@/services/driverService";
import type { Conductor } from "@/types/driver";

export default function ConductoresPage() {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { conductores } = await getConductores();
      setConductores(conductores);
      setCargando(false);
    }

    cargar();
  }, []);

  return (
    <AppShell>
      <section className="mb-6 flex shrink-0 flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black md:text-5xl">
            Conductores 👤
          </h1>
          <p className="mt-3 text-lg text-slate-200">
            Gestiona los conductores y sus documentos.
          </p>
        </div>

        <button className="rounded-2xl bg-blue-600 px-8 py-4 text-center text-lg font-black text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500">
          + Crear conductor
        </button>
      </section>

      <section className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {cargando ? (
          <p className="text-slate-300">Cargando conductores...</p>
        ) : conductores.length === 0 ? (
          <div className="glass rounded-[2rem] p-10 text-center">
            <h2 className="text-2xl font-black">Sin conductores registrados</h2>
            <p className="mt-3 text-slate-300">
              Aún no hay conductores creados.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 lg:grid-cols-2 2xl:grid-cols-3">
            {conductores.map((conductor) => (
              <DriverCard key={conductor.id} conductor={conductor} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}