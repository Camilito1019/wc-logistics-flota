"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Home,
  Truck,
  User,
  Users,
  LogOut,
  ShieldCheck,
  Bell,
  Menu,
} from "lucide-react";

type Props = {
  children: React.ReactNode;
};

type UsuarioSesion = {
  nombre: string;
  roles?: {
    nombre: string;
  };
};

export default function AppShell({ children }: Props) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("wc_fleet_user");
    if (data) setUsuario(JSON.parse(data));
  }, []);

  function cerrarSesion() {
    localStorage.removeItem("wc_fleet_user");
    window.location.href = "/login";
  }

  return (
    <main className="wc-bg h-screen overflow-hidden p-3 md:p-5">
      <div className="mx-auto flex h-full max-w-[1800px] overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 shadow-2xl backdrop-blur-xl">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/75 p-6 lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-blue-200">
              <ShieldCheck size={34} strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-lg font-black leading-5">FLOTA</h2>
              <h2 className="text-lg font-black leading-5">DOCUMENTAL</h2>
              <p className="text-sm text-slate-400">Gestión segura</p>
            </div>
          </div>

          <nav className="space-y-3 text-sm">
            <Link
              href="/vehiculos"
              className="flex items-center gap-4 rounded-2xl bg-blue-600/30 px-5 py-4 font-bold text-blue-100 shadow-lg shadow-blue-600/20"
            >
              <Home size={23} strokeWidth={1.8} />
              Inicio
            </Link>

            <p className="px-5 pt-4 text-xs uppercase tracking-widest text-slate-500">
              Gestión
            </p>

            <Link
              href="/vehiculos"
              className="flex items-center gap-4 rounded-2xl px-5 py-4 font-semibold hover:bg-white/10"
            >
              <Truck size={23} strokeWidth={1.8} />
              Vehículos
            </Link>

            <Link
              href="/conductores"
              className="flex items-center gap-4 rounded-2xl px-5 py-4 font-semibold hover:bg-white/10"
            >
              <User size={23} strokeWidth={1.8} />
              Conductores
            </Link>

            <Link
              href="/propietario"
              className="flex items-center gap-4 rounded-2xl px-5 py-4 font-semibold hover:bg-white/10"
            >
              <Users size={23} strokeWidth={1.8} />
              Propietario
            </Link>
          </nav>

          <button
            onClick={cerrarSesion}
            className="mt-auto flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold hover:bg-red-500/20"
          >
            <LogOut size={22} strokeWidth={1.8} />
            Cerrar sesión
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-white/10 px-5 py-6 md:px-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <button className="rounded-xl p-2 hover:bg-white/10">
                  <Menu size={28} strokeWidth={1.8} />
                </button>

                <div>
                  <p className="text-lg font-semibold">
                    Bienvenido, {usuario?.nombre || "Usuario"}
                  </p>
                  <p className="text-sm text-blue-300">
                    {usuario?.roles?.nombre || "Administrador"}
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-5 md:flex">
                <div className="relative">
                  <Bell size={26} strokeWidth={1.8} />
                  <span className="absolute -right-2 -top-2 rounded-full bg-blue-600 px-2 text-xs font-black">
                    3
                  </span>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                  <User size={26} strokeWidth={1.8} />
                </div>

                <span>{usuario?.nombre || "Usuario"}</span>
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-hidden px-5 py-8 md:px-10">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}