"use client";

import { useState } from "react";
import { loginWithCedulaAndPin } from "@/services/authService";

export default function LoginPage() {
  const [cedula, setCedula] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const ingresar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const { user, error } = await loginWithCedulaAndPin(cedula, pin);

    if (error || !user) {
      setError(error || "No fue posible iniciar sesión.");
      setCargando(false);
      return;
    }

    localStorage.setItem("wc_fleet_user", JSON.stringify(user));
    window.location.href = "/vehiculos";
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#2563eb55,transparent_35%),radial-gradient(circle_at_bottom_right,#facc1550,transparent_35%)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5">
        <form
          onSubmit={ingresar}
          className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-5xl shadow-xl">
              🚛
            </div>

            <h1 className="text-4xl font-black tracking-tight">WC Fleet</h1>
            <p className="mt-2 text-sm text-slate-300">
              Sistema de Gestión Documental
            </p>
            <p className="mt-1 font-semibold text-yellow-300">
              WC Logistics Group
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Cédula
              </label>
              <input
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-yellow-300/70 focus:bg-white/15"
                placeholder="Ingrese su cédula"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                PIN
              </label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                type="password"
                inputMode="numeric"
                maxLength={8}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-yellow-300/70 focus:bg-white/15"
                placeholder="Ingrese su PIN"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              disabled={cargando}
              className="w-full rounded-2xl bg-yellow-400 px-5 py-4 font-black text-slate-950 shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}