"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Eye } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { getVehiculoById } from "@/services/vehicleService";
import {
  descargarDocumento,
  eliminarDocumento,
  getDocumentosVehiculo,
  subirDocumentoVehiculo,
} from "@/services/documentService";
import type { Vehiculo } from "@/types/vehicle";
import type { Documento } from "@/types/document";

const tiposVehiculo = [
  { id: 1, nombre: "Acta inspección sanitaria" },
  { id: 2, nombre: "Certificado control de plagas" },
  { id: 3, nombre: "Licencia de tránsito" },
  { id: 4, nombre: "Póliza todo riesgo" },
  { id: 5, nombre: "Revisión Técnico Mecánica" },
  { id: 6, nombre: "SOAT" },
  { id: 7, nombre: "Fotos del vehículo" },
];

type ModalAccion =
  | { tipo: "eliminar"; documento: Documento }
  | { tipo: "descargar"; documento: Documento }
  | null;

export default function VehiculoDetallePage() {
  const params = useParams();
  const vehiculoId = Number(params.id);

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [mostrarCarga, setMostrarCarga] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [tipoDocumentoId, setTipoDocumentoId] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [modalAccion, setModalAccion] = useState<ModalAccion>(null);

  useEffect(() => {
    if (!vehiculoId) return;
    cargarTodo();
  }, [vehiculoId]);

  async function cargarTodo() {
    setCargando(true);

    const vehiculoResp = await getVehiculoById(vehiculoId);
    const documentosResp = await getDocumentosVehiculo(vehiculoId);

    setVehiculo(vehiculoResp.vehiculo);
    setDocumentos(documentosResp.documentos);
    setCargando(false);
  }

  async function guardarDocumento(e: React.FormEvent) {
    e.preventDefault();
    setMensaje("");

    if (!archivo || !tipoDocumentoId) {
      setMensaje("Selecciona el tipo de documento y el archivo.");
      return;
    }

    const { error } = await subirDocumentoVehiculo({
      vehiculoId,
      tipoDocumentoId: Number(tipoDocumentoId),
      archivo,
      fechaVencimiento,
    });

    if (error) {
      setMensaje(error);
      return;
    }

    setArchivo(null);
    setTipoDocumentoId("");
    setFechaVencimiento("");
    setMostrarCarga(false);
    setMensaje("Documento cargado correctamente.");
    cargarTodo();
  }

  async function abrirDocumento(doc: Documento) {
    if (!doc.ruta_archivo) return;

    const { url, error } = await descargarDocumento(doc.ruta_archivo);

    if (error || !url) {
      setMensaje(error || "No se pudo abrir el documento.");
      return;
    }

    window.open(url, "_blank");
  }

  async function confirmarDescarga() {
    if (!modalAccion || modalAccion.tipo !== "descargar") return;

    const doc = modalAccion.documento;

    if (!doc.ruta_archivo) {
      setMensaje("Este documento no tiene archivo asociado.");
      setModalAccion(null);
      return;
    }

    const { url, error } = await descargarDocumento(doc.ruta_archivo);

    if (error || !url) {
      setMensaje(error || "No se pudo descargar.");
      setModalAccion(null);
      return;
    }

    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = doc.nombre_archivo || "documento";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(blobUrl);
    setModalAccion(null);
  }

  async function confirmarEliminacion() {
    if (!modalAccion || modalAccion.tipo !== "eliminar") return;

    const { error } = await eliminarDocumento(modalAccion.documento.id);

    if (error) {
      setMensaje(error);
      setModalAccion(null);
      return;
    }

    setMensaje("Documento eliminado correctamente.");
    setModalAccion(null);
    cargarTodo();
  }

  if (cargando) {
    return (
      <AppShell>
        <p className="text-slate-300">Cargando información...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-yellow-300">WC Fleet</p>
          <h1 className="text-4xl font-black">
            Documentos {vehiculo?.placa || ""}
          </h1>
          <p className="mt-2 text-slate-300">
            Consulta, descarga o reemplaza los documentos del vehículo.
          </p>
        </div>

        <button
          onClick={() => setMostrarCarga(true)}
          className="rounded-2xl bg-blue-600 px-7 py-4 font-black text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500"
        >
          + Cargar documento
        </button>
      </section>

      {mensaje && (
        <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 px-5 py-4 text-yellow-100">
          {mensaje}
        </div>
      )}

      <section className="h-[calc(100vh-285px)] overflow-y-auto pr-2">
        {documentos.length === 0 ? (
          <div className="glass rounded-[2rem] p-10 text-center">
            <h2 className="text-2xl font-black">Sin documentos cargados</h2>
            <p className="mt-3 text-slate-300">
              Este vehículo todavía no tiene documentos registrados.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {documentos.map((doc) => (
              <article key={doc.id} className="glass rounded-[2rem] p-6">
                <p className="text-sm font-bold text-yellow-300">
                  {doc.tipos_documentos?.nombre || "Documento"}
                </p>

                <h3 className="mt-2 text-xl font-black">
                  {doc.nombre_archivo}
                </h3>

                <p className="mt-2 text-sm text-slate-300">
                  Vence: {doc.fecha_vencimiento || "No aplica"}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => abrirDocumento(doc)}
                    className="flex items-center gap-2 rounded-xl bg-blue-500/20 px-4 py-3 font-bold text-blue-100 hover:bg-blue-500/30"
                  >
                    <Eye size={18} strokeWidth={1.8} />
                    Ver
                  </button>

                  <button
                    onClick={() =>
                      setModalAccion({ tipo: "descargar", documento: doc })
                    }
                    className="rounded-xl bg-white/10 px-4 py-3 font-bold hover:bg-white/20"
                  >
                    Descargar
                  </button>

                  <button
                    onClick={() =>
                      setModalAccion({ tipo: "eliminar", documento: doc })
                    }
                    className="rounded-xl bg-red-500/20 px-4 py-3 font-bold text-red-200 hover:bg-red-500/30"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {mostrarCarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
          <form
            onSubmit={guardarDocumento}
            className="glass w-full max-w-lg rounded-[2rem] p-7"
          >
            <h2 className="text-2xl font-black">Cargar documento</h2>
            <p className="mt-2 text-sm text-slate-300">
              Selecciona el tipo de documento y adjunta el archivo
              correspondiente.
            </p>

            <label className="mt-5 block text-sm font-semibold text-slate-200">
              Tipo de documento
            </label>
            <select
              value={tipoDocumentoId}
              onChange={(e) => setTipoDocumentoId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 outline-none"
            >
              <option value="" disabled>
                Selecciona un tipo de documento
              </option>
              {tiposVehiculo.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-semibold text-slate-200">
              Seleccione fecha de vencimiento del documento
            </label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none"
            />

            <label className="mt-4 block text-sm font-semibold text-slate-200">
              Archivo del documento
            </label>
            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-yellow-300/40 bg-yellow-400/10 px-5 py-6 text-center hover:bg-yellow-400/20">
              <span className="font-black text-yellow-200">
                {archivo ? archivo.name : "Seleccionar archivo para cargar"}
              </span>
              <span className="mt-1 text-xs text-slate-300">
                PDF, PNG, JPG, JPEG o WEBP
              </span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setMostrarCarga(false)}
                className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 font-bold hover:bg-white/20"
              >
                Cancelar
              </button>

              <button className="flex-1 rounded-2xl bg-yellow-400 px-5 py-4 font-black text-slate-950 hover:bg-yellow-300">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {modalAccion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-[2rem] p-7 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
              {modalAccion.tipo === "eliminar" ? "🗑️" : "⬇️"}
            </div>

            <h2 className="text-2xl font-black">
              {modalAccion.tipo === "eliminar"
                ? "¿Eliminar documento?"
                : "¿Descargar documento?"}
            </h2>

            <p className="mt-3 text-slate-300">
              {modalAccion.tipo === "eliminar"
                ? `¿Deseas eliminar este documento del vehículo ${vehiculo?.placa}?`
                : `¿Deseas descargar este documento del vehículo ${vehiculo?.placa}?`}
            </p>

            <p className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200">
              {modalAccion.documento.nombre_archivo}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalAccion(null)}
                className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 font-bold hover:bg-white/20"
              >
                Cancelar
              </button>

              <button
                onClick={
                  modalAccion.tipo === "eliminar"
                    ? confirmarEliminacion
                    : confirmarDescarga
                }
                className={`flex-1 rounded-2xl px-5 py-4 font-black ${
                  modalAccion.tipo === "eliminar"
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-yellow-400 text-slate-950 hover:bg-yellow-300"
                }`}
              >
                {modalAccion.tipo === "eliminar" ? "Eliminar" : "Descargar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}