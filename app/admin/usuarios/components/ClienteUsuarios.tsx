"use client";

import {
  Fragment,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Edit3,
  KeyRound,
  Loader2,
  Plus,
  Save,
  Trash2,
  UserCog,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  actualizarUsuarioGestionado,
  cambiarPasswordUsuarioOperativo,
  cambiarRolUsuarioOperativo,
  crearUsuarioOperativo,
  eliminarUsuarioOperativo,
} from "@/actions/usuario.action";

// =============================================================================
// TIPOS
// =============================================================================

type RolGestionado =
  | "ADMIN"
  | "SUPERVISOR"
  | "EDITOR";

type RolOperativo =
  | "SUPERVISOR"
  | "EDITOR";

interface UsuarioGestionado {
  id: string;
  nombre: string | null;
  apellidos: string | null;
  email: string;
  rol: string;
  emailVerificado: boolean;
  createdAt: string;
}

interface Props {
  usuariosIniciales: UsuarioGestionado[];
}

// =============================================================================
// FORMULARIOS
// =============================================================================

const formularioVacio = {
  nombre: "",
  apellidos: "",
  email: "",
  password: "",
  rol: "SUPERVISOR" as RolGestionado,
};

const formularioEdicionVacio = {
  nombre: "",
  apellidos: "",
  email: "",
};

// =============================================================================
// COMPONENTE
// =============================================================================

export default function ClienteUsuarios({
  usuariosIniciales,
}: Props) {
  const router = useRouter();

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState(
    formularioVacio
  );

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    resetId,
    setResetId,
  ] = useState<
    string | null
  >(null);

  const [
    nuevaPassword,
    setNuevaPassword,
  ] = useState("");

  const [
    procesandoId,
    setProcesandoId,
  ] = useState<
    string | null
  >(null);

  const [
    editandoId,
    setEditandoId,
  ] = useState<
    string | null
  >(null);

  const [
    formEdicion,
    setFormEdicion,
  ] = useState(
    formularioEdicionVacio
  );

  const refrescar = () =>
    router.refresh();

  // ===========================================================================
  // CREAR
  // ===========================================================================

  const handleCrear = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setGuardando(true);

    const res =
      await crearUsuarioOperativo(
        form
      );

    setGuardando(false);

    if (!res.success) {
      toast.error(
        res.error ||
          "No se pudo crear el usuario."
      );

      return;
    }

    const etiquetaRol =
      form.rol === "ADMIN"
        ? "Administrador"
        : form.rol ===
            "SUPERVISOR"
          ? "Supervisor"
          : "Editor";

    toast.success(
      `${etiquetaRol} creado correctamente.`
    );

    setForm(
      formularioVacio
    );

    setMostrarFormulario(
      false
    );

    refrescar();
  };

  // ===========================================================================
  // EDITAR DATOS
  // ===========================================================================

  const abrirEdicion = (
    usuario: UsuarioGestionado
  ) => {
    setEditandoId(
      usuario.id
    );

    setFormEdicion({
      nombre:
        usuario.nombre || "",

      apellidos:
        usuario.apellidos ||
        "",

      email:
        usuario.email,
    });

    setResetId(null);
    setNuevaPassword("");
  };

  const cancelarEdicion =
    () => {
      setEditandoId(null);

      setFormEdicion(
        formularioEdicionVacio
      );
    };

  const handleEditar =
    async (
      e: React.FormEvent,
      id: string
    ) => {
      e.preventDefault();

      setProcesandoId(
        id
      );

      const res =
        await actualizarUsuarioGestionado(
          id,
          formEdicion
        );

      setProcesandoId(
        null
      );

      if (!res.success) {
        toast.error(
          res.error ||
            "No se pudieron actualizar los datos."
        );

        return;
      }

      toast.success(
        "Datos del usuario actualizados."
      );

      cancelarEdicion();

      refrescar();
    };

  // ===========================================================================
  // CAMBIAR ROL
  // SOLO SUPERVISOR <-> EDITOR
  // ===========================================================================

  const handleCambiarRol =
    async (
      id: string,
      rol: RolOperativo
    ) => {
      setProcesandoId(
        id
      );

      const res =
        await cambiarRolUsuarioOperativo(
          id,
          rol
        );

      setProcesandoId(
        null
      );

      if (!res.success) {
        toast.error(
          res.error ||
            "No se pudo cambiar el rol."
        );

        return;
      }

      toast.success(
        "Rol actualizado."
      );

      refrescar();
    };

  // ===========================================================================
  // CAMBIAR CONTRASEÑA
  // ===========================================================================

  const handleReset =
    async (
      id: string
    ) => {
      if (!nuevaPassword)
        return;

      setProcesandoId(
        id
      );

      const res =
        await cambiarPasswordUsuarioOperativo(
          id,
          nuevaPassword
        );

      setProcesandoId(
        null
      );

      if (!res.success) {
        toast.error(
          res.error ||
            "No se pudo cambiar la contraseña."
        );

        return;
      }

      toast.success(
        "Contraseña actualizada."
      );

      setResetId(null);

      setNuevaPassword(
        ""
      );
    };

  // ===========================================================================
  // ELIMINAR
  // SOLO SUPERVISOR / EDITOR
  // ===========================================================================

  const handleEliminar =
    async (
      id: string,
      nombre: string
    ) => {
      if (
        !window.confirm(
          `¿Eliminar el acceso de ${nombre}?`
        )
      ) {
        return;
      }

      setProcesandoId(
        id
      );

      const res =
        await eliminarUsuarioOperativo(
          id
        );

      setProcesandoId(
        null
      );

      if (!res.success) {
        toast.error(
          res.error ||
            "No se pudo eliminar el acceso."
        );

        return;
      }

      toast.success(
        "Acceso eliminado."
      );

      refrescar();
    };

  // ===========================================================================
  // UI
  // ===========================================================================

  return (
    <div className="space-y-6">
      {/* CABECERA */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Usuarios
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Administra administradores, supervisores y editores de Proyecto Piña.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setMostrarFormulario(
              (valor) =>
                !valor
            )
          }
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          {mostrarFormulario ? (
            <X size={18} />
          ) : (
            <Plus size={18} />
          )}

          {mostrarFormulario
            ? "Cancelar"
            : "Nuevo usuario"}
        </button>
      </div>

      {/* CREAR USUARIO */}

      {mostrarFormulario && (
        <form
          onSubmit={
            handleCrear
          }
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <UserCog
              size={20}
              className="text-orange-600"
            />

            Nuevo acceso
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-600">
                Nombre
              </span>

              <input
                required
                value={
                  form.nombre
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    nombre:
                      e.target
                        .value,
                  })
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-600">
                Apellidos
              </span>

              <input
                required
                value={
                  form.apellidos
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    apellidos:
                      e.target
                        .value,
                  })
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-600">
                Correo
              </span>

              <input
                required
                type="email"
                value={
                  form.email
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    email:
                      e.target
                        .value,
                  })
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-600">
                Contraseña temporal
              </span>

              <input
                required
                type="password"
                value={
                  form.password
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    password:
                      e.target
                        .value,
                  })
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="8+ caracteres, mayús., minús., número y símbolo"
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase text-slate-600">
                Rol
              </span>

              <select
                value={
                  form.rol
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,

                    rol:
                      e.target
                        .value as RolGestionado,
                  })
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white"
              >
                <option value="ADMIN">
                  ADMIN — control administrativo completo
                </option>

                <option value="SUPERVISOR">
                  SUPERVISOR — materiales + publicación + orden de categorías
                </option>

                <option value="EDITOR">
                  EDITOR — gestión de materiales
                </option>
              </select>
            </label>
          </div>

          {/* EXPLICACIÓN DE ROLES */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <p>
              <strong>
                ADMIN:
              </strong>{" "}
              administra usuarios, categorías, subcategorías, materiales y configuración.
            </p>

            <p>
              <strong>
                SUPERVISOR:
              </strong>{" "}
              crea, edita y publica materiales y puede cambiar el orden de las categorías; no crea ni elimina estructura.
            </p>

            <p>
              <strong>
                EDITOR:
              </strong>{" "}
              trabaja con materiales y no administra usuarios ni estructura.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                guardando
              }
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {guardando && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              Crear usuario
            </button>
          </div>
        </form>
      )}

      {/* TABLA */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">
                  Usuario
                </th>

                <th className="px-5 py-4">
                  Rol
                </th>

                <th className="px-5 py-4">
                  Correo
                </th>

                <th className="px-5 py-4">
                  Estado
                </th>

                <th className="px-5 py-4 text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {usuariosIniciales.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={
                      5
                    }
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Aún no hay usuarios administrativos creados.
                  </td>
                </tr>
              ) : (
                usuariosIniciales.map(
                  (usuario) => {
                    const nombre =
                      `${usuario.nombre || ""} ${usuario.apellidos || ""}`.trim() ||
                      usuario.email;

                    const esAdmin =
                      usuario.rol ===
                      "ADMIN";

                    const esSupervisor =
                      usuario.rol ===
                      "SUPERVISOR";

                    return (
                      <Fragment
                        key={
                          usuario.id
                        }
                      >
                        <tr className="hover:bg-slate-50">
                          {/* NOMBRE */}

                          <td className="px-5 py-4 font-semibold text-slate-800">
                            {
                              nombre
                            }
                          </td>

                          {/* ROL */}

                          <td className="px-5 py-4">
                            {esAdmin ? (
                              <span className="inline-flex px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                ADMIN
                              </span>
                            ) : (
                              <select
                                value={
                                  usuario.rol
                                }
                                disabled={
                                  procesandoId ===
                                  usuario.id
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleCambiarRol(
                                    usuario.id,

                                    e
                                      .target
                                      .value as RolOperativo
                                  )
                                }
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer ${
                                  esSupervisor
                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                                title="Cambiar rol"
                              >
                                <option value="SUPERVISOR">
                                  SUPERVISOR
                                </option>

                                <option value="EDITOR">
                                  EDITOR
                                </option>
                              </select>
                            )}
                          </td>

                          {/* CORREO */}

                          <td className="px-5 py-4 text-slate-600">
                            {
                              usuario.email
                            }
                          </td>

                          {/* ESTADO */}

                          <td className="px-5 py-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                              Activo
                            </span>
                          </td>

                          {/* ACCIONES */}

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* EDITAR */}

                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    editandoId ===
                                    usuario.id
                                  ) {
                                    cancelarEdicion();
                                  } else {
                                    abrirEdicion(
                                      usuario
                                    );
                                  }
                                }}
                                className="p-2 text-slate-500 hover:text-blue-600"
                                title="Editar nombre y correo"
                              >
                                {editandoId ===
                                usuario.id ? (
                                  <X
                                    size={
                                      17
                                    }
                                  />
                                ) : (
                                  <Edit3
                                    size={
                                      17
                                    }
                                  />
                                )}
                              </button>

                              {/* CONTRASEÑA */}

                              <button
                                type="button"
                                onClick={() => {
                                  setResetId(
                                    resetId ===
                                      usuario.id
                                      ? null
                                      : usuario.id
                                  );

                                  setNuevaPassword(
                                    ""
                                  );

                                  setEditandoId(
                                    null
                                  );
                                }}
                                className="p-2 text-slate-500 hover:text-orange-600"
                                title="Cambiar contraseña"
                              >
                                <KeyRound
                                  size={
                                    17
                                  }
                                />
                              </button>

                              {/* ELIMINAR:
                                  nunca se muestra para ADMIN */}

                              {!esAdmin && (
                                <button
                                  type="button"
                                  disabled={
                                    procesandoId ===
                                    usuario.id
                                  }
                                  onClick={() =>
                                    handleEliminar(
                                      usuario.id,
                                      nombre
                                    )
                                  }
                                  className="p-2 text-slate-500 hover:text-red-600 disabled:opacity-50"
                                  title="Eliminar acceso"
                                >
                                  {procesandoId ===
                                  usuario.id ? (
                                    <Loader2
                                      size={
                                        17
                                      }
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2
                                      size={
                                        17
                                      }
                                    />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* EDICIÓN */}

                        {editandoId ===
                          usuario.id && (
                          <tr className="bg-blue-50/30">
                            <td
                              colSpan={
                                5
                              }
                              className="px-5 py-5"
                            >
                              <form
                                onSubmit={(
                                  e
                                ) =>
                                  handleEditar(
                                    e,
                                    usuario.id
                                  )
                                }
                                className="max-w-4xl mx-auto"
                              >
                                <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700">
                                  <Edit3
                                    size={
                                      18
                                    }
                                    className="text-blue-600"
                                  />

                                  Editar datos de {nombre}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <label className="space-y-1">
                                    <span className="text-xs font-semibold uppercase text-slate-500">
                                      Nombre
                                    </span>

                                    <input
                                      required
                                      value={
                                        formEdicion.nombre
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        setFormEdicion(
                                          {
                                            ...formEdicion,

                                            nombre:
                                              e
                                                .target
                                                .value,
                                          }
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                                    />
                                  </label>

                                  <label className="space-y-1">
                                    <span className="text-xs font-semibold uppercase text-slate-500">
                                      Apellidos
                                    </span>

                                    <input
                                      required
                                      value={
                                        formEdicion.apellidos
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        setFormEdicion(
                                          {
                                            ...formEdicion,

                                            apellidos:
                                              e
                                                .target
                                                .value,
                                          }
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                                    />
                                  </label>

                                  <label className="space-y-1">
                                    <span className="text-xs font-semibold uppercase text-slate-500">
                                      Correo
                                    </span>

                                    <input
                                      required
                                      type="email"
                                      value={
                                        formEdicion.email
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        setFormEdicion(
                                          {
                                            ...formEdicion,

                                            email:
                                              e
                                                .target
                                                .value,
                                          }
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                                    />
                                  </label>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                  <button
                                    type="button"
                                    onClick={
                                      cancelarEdicion
                                    }
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                                  >
                                    Cancelar
                                  </button>

                                  <button
                                    type="submit"
                                    disabled={
                                      procesandoId ===
                                      usuario.id
                                    }
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
                                  >
                                    {procesandoId ===
                                      usuario.id && (
                                      <Loader2
                                        size={
                                          15
                                        }
                                        className="animate-spin"
                                      />
                                    )}

                                    <Save
                                      size={
                                        15
                                      }
                                    />

                                    Guardar cambios
                                  </button>
                                </div>
                              </form>
                            </td>
                          </tr>
                        )}

                        {/* RESET CONTRASEÑA */}

                        {resetId ===
                          usuario.id && (
                          <tr className="bg-orange-50/30">
                            <td
                              colSpan={
                                5
                              }
                              className="px-5 py-4"
                            >
                              <div className="max-w-xl mx-auto">
                                <div className="text-xs font-semibold text-slate-600 mb-2">
                                  Nueva contraseña para {nombre}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="password"
                                    value={
                                      nuevaPassword
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      setNuevaPassword(
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                    placeholder="Nueva contraseña"
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                                  />

                                  <button
                                    type="button"
                                    disabled={
                                      procesandoId ===
                                        usuario.id ||
                                      !nuevaPassword
                                    }
                                    onClick={() =>
                                      handleReset(
                                        usuario.id
                                      )
                                    }
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                                  >
                                    Guardar clave
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}