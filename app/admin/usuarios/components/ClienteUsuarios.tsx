"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Plus, Trash2, UserCog, X } from "lucide-react";
import { toast } from "sonner";
import {
  cambiarPasswordUsuarioOperativo,
  cambiarRolUsuarioOperativo,
  crearUsuarioOperativo,
  eliminarUsuarioOperativo,
} from "@/actions/usuario.action";

type RolOperativo = "SUPERVISOR" | "EDITOR";

interface UsuarioOperativo {
  id: string;
  nombre: string | null;
  apellidos: string | null;
  email: string;
  rol: string;
  emailVerificado: boolean;
  createdAt: string;
}

interface Props {
  usuariosIniciales: UsuarioOperativo[];
}

const formularioVacio = {
  nombre: "",
  apellidos: "",
  email: "",
  password: "",
  rol: "SUPERVISOR" as RolOperativo,
};


export default function ClienteUsuarios({ usuariosIniciales }: Props) {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState(formularioVacio);
  const [guardando, setGuardando] = useState(false);
  const [resetId, setResetId] = useState<string | null>(null);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  const refrescar = () => router.refresh();

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const res = await crearUsuarioOperativo(form);
    setGuardando(false);

    if (!res.success) {
      toast.error(res.error || "No se pudo crear el usuario.");
      return;
    }

    toast.success(`${form.rol === "SUPERVISOR" ? "Supervisor" : "Editor"} creado correctamente.`);
    setForm(formularioVacio);
    setMostrarFormulario(false);
    refrescar();
  };

  const handleCambiarRol = async (id: string, rol: RolOperativo) => {
    setProcesandoId(id);
    const res = await cambiarRolUsuarioOperativo(id, rol);
    setProcesandoId(null);

    if (!res.success) {
      toast.error(res.error || "No se pudo cambiar el rol.");
      return;
    }

    toast.success("Rol actualizado.");
    refrescar();
  };

  const handleReset = async (id: string) => {
    if (!nuevaPassword) return;
    setProcesandoId(id);
    const res = await cambiarPasswordUsuarioOperativo(id, nuevaPassword);
    setProcesandoId(null);

    if (!res.success) {
      toast.error(res.error || "No se pudo cambiar la contraseña.");
      return;
    }

    toast.success("Contraseña actualizada.");
    setResetId(null);
    setNuevaPassword("");
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Eliminar el acceso de ${nombre}?`)) return;
    setProcesandoId(id);
    const res = await eliminarUsuarioOperativo(id);
    setProcesandoId(null);

    if (!res.success) {
      toast.error(res.error || "No se pudo eliminar el acceso.");
      return;
    }

    toast.success("Acceso eliminado.");
    refrescar();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Usuarios</h1>
          <p className="text-sm text-slate-500 mt-1">
            Crea supervisores para gestionar la cinta y materiales, o editores para cargar materiales PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarFormulario((v) => !v)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          {mostrarFormulario ? <X size={18} /> : <Plus size={18} />}
          {mostrarFormulario ? "Cancelar" : "Nuevo usuario"}
        </button>
      </div>

      {mostrarFormulario && (
        <form
          onSubmit={handleCrear}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <UserCog size={20} className="text-orange-600" />
            Nuevo acceso operativo
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-600">Nombre</span>
              <input
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-600">Apellidos</span>
              <input
                required
                value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-600">Correo</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-600">Contraseña temporal</span>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="8+ caracteres, mayús., minús., número y símbolo"
              />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase text-slate-600">Rol</span>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value as RolOperativo })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white"
              >
                <option value="SUPERVISOR">SUPERVISOR — cinta + categorías + subcategorías + materiales</option>
                <option value="EDITOR">EDITOR — solo materiales PDF</option>
              </select>
            </label>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-1">
            <p><strong>SUPERVISOR:</strong> crea, edita y elimina categorías/subcategorías; también crea, edita y publica materiales.</p>
            <p><strong>EDITOR:</strong> crea, edita y publica materiales; no modifica la cinta ni administra usuarios.</p>
            <p><strong>ADMIN:</strong> conserva el control total y la eliminación definitiva de materiales.</p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={guardando}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {guardando && <Loader2 size={16} className="animate-spin" />}
              Crear usuario
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Usuario</th>
                <th className="px-5 py-4">Rol</th>
                <th className="px-5 py-4">Correo</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuariosIniciales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    Aún no hay supervisores ni editores creados.
                  </td>
                </tr>
              ) : (
                usuariosIniciales.map((u) => {
                  const nombre = `${u.nombre || ""} ${u.apellidos || ""}`.trim() || u.email;
                  const esSupervisor = u.rol === "SUPERVISOR";
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-800">{nombre}</td>
                      <td className="px-5 py-4">
                        <select
                          value={u.rol}
                          disabled={procesandoId === u.id}
                          onChange={(e) => handleCambiarRol(u.id, e.target.value as RolOperativo)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer ${
                            esSupervisor
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                          title="Cambiar rol"
                        >
                          <option value="SUPERVISOR">SUPERVISOR</option>
                          <option value="EDITOR">EDITOR</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          Activo
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setResetId(resetId === u.id ? null : u.id);
                              setNuevaPassword("");
                            }}
                            className="p-2 text-slate-500 hover:text-orange-600"
                            title="Cambiar contraseña"
                          >
                            <KeyRound size={17} />
                          </button>
                          <button
                            type="button"
                            disabled={procesandoId === u.id}
                            onClick={() => handleEliminar(u.id, nombre)}
                            className="p-2 text-slate-500 hover:text-red-600 disabled:opacity-50"
                            title="Eliminar acceso"
                          >
                            {procesandoId === u.id ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}
                          </button>
                        </div>
                        {resetId === u.id && (
                          <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
                            <input
                              type="password"
                              value={nuevaPassword}
                              onChange={(e) => setNuevaPassword(e.target.value)}
                              placeholder="Nueva contraseña"
                              className="px-3 py-2 border border-slate-300 rounded-lg text-xs min-w-[220px]"
                            />
                            <button
                              type="button"
                              disabled={procesandoId === u.id || !nuevaPassword}
                              onClick={() => handleReset(u.id)}
                              className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                            >
                              Guardar clave
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
