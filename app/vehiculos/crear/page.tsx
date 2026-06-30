"use client";

import { useState } from "react";
import { crearVehiculo } from "@/services/vehicleService";

export default function CrearVehiculoPage() {
  const [form, setForm] = useState({
    placa: "",
    marca: "",
    linea: "",
    modelo: "",
    color: "",
    color_hex: "#ef4444",
    tipo_vehiculo: "Camión",
    observaciones: "",
    activo: true,
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cambiar(campo: string, valor: string) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    if (!form.placa.trim()) {
      setError("La placa es obligatoria.");
      setGuardando(false);
      return;
    }

    const { error } = await crearVehiculo({
      ...form,
      placa: form.placa.toUpperCase().replace(/\s/g, ""),
    });

    if (error) {
      setError(error);
      setGuardando(false);
      return;
    }

    window.location.href = "/vehiculos";
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <p className="font-semibold text-yellow-300">WC Fleet</p>
        <h1 className="mt-2 text-4xl font-black">Crear vehículo</h1>
        <p className="mt-2 text-slate-300">
          Registra un vehículo nuevo en la flota.
        </p>

        <form onSubmit={guardar} className="mt-8 grid gap-5 md:grid-cols-2">
          <input
            value={form.placa}
            onChange={(e) => cambiar("placa", e.target.value)}
            placeholder="Placa"
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none"
          />

          <input
            value={form.marca}
            onChange={(e) => cambiar("marca", e.target.value)}
            placeholder="Marca"
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none"
          />

          <input
            value={form.linea}
            onChange={(e) => cambiar("linea", e.target.value)}
            placeholder="Línea / referencia"
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none"
          />

          <input
            value={form.modelo}
            onChange={(e) => cambiar("modelo", e.target.value)}
            placeholder="Modelo"
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none"
          />

          <input
            value={form.color}
            onChange={(e) => cambiar("color", e.target.value)}
            placeholder="Color"
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none"
          />

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
            <label className="text-sm text-slate-300">Color camión</label>
            <input
              type="color"
              value={form.color_hex}
              onChange={(e) => cambiar("color_hex", e.target.value)}
              className="h-10 w-16 cursor-pointer"
            />
          </div>

          <input
            value={form.tipo_vehiculo}
            onChange={(e) => cambiar("tipo_vehiculo", e.target.value)}
            placeholder="Tipo de vehículo"
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none md:col-span-2"
          />

          <textarea
            value={form.observaciones}
            onChange={(e) => cambiar("observaciones", e.target.value)}
            placeholder="Observaciones"
            className="min-h-32 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none md:col-span-2"
          />

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 md:col-span-2">
              {error}
            </div>
          )}

          <button
            disabled={guardando}
            className="rounded-2xl bg-yellow-400 px-6 py-4 font-black text-slate-950 hover:bg-yellow-300 disabled:opacity-60 md:col-span-2"
          >
            {guardando ? "Guardando..." : "Guardar vehículo"}
          </button>
        </form>
      </section>
    </main>
  );
}