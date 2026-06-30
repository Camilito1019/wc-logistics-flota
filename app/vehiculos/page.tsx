"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { getVehiculos } from "@/services/vehicleService";
import type { Vehiculo } from "@/types/vehicle";

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { vehiculos } = await getVehiculos();
      setVehiculos(vehiculos);
      setCargando(false);
    }

    cargar();
  }, []);

  return (
    <AppShell>
      <section className="mb-6 flex shrink-0 flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black md:text-5xl">
            Mis Vehículos 🚚
          </h1>
          <p className="mt-3 text-lg text-slate-200">
            Selecciona un vehículo para gestionar sus documentos
          </p>
        </div>

        <Link
          href="/vehiculos/crear"
          className="rounded-2xl bg-blue-600 px-8 py-4 text-center text-lg font-black text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500"
        >
          + Crear vehículo
        </Link>
      </section>

      <section className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {cargando ? (
          <p className="text-slate-300">Cargando vehículos...</p>
        ) : (
          <div className="grid gap-7 lg:grid-cols-2 2xl:grid-cols-3">
            {vehiculos.map((vehiculo) => (
              <VehicleCard key={vehiculo.id} vehiculo={vehiculo} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}