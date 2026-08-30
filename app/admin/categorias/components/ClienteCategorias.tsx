"use client";

import {
  useState,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  ArrowUpDown,
} from "lucide-react";
import { CategoriaConRelaciones } from "../types";
import {
  eliminarCategoria,
  moverCategoria,
} from "@/actions/categoria.action";
import Filtros from "./Filtros";
import Tabla from "./Tabla";
import Formulario from "./Formulario";
import Detalle from "./Detalle";
import EliminarConfirmacion from "./EliminarConfirmacion";

type Vista =
  | "lista"
  | "formulario"
  | "detalle"
  | "eliminar";

interface Props {
  categoriasIniciales: CategoriaConRelaciones[];
  esAdmin: boolean;
}

export default function ClienteCategorias({
  categoriasIniciales,
  esAdmin,
}: Props) {
  const router = useRouter();

  const [vista, setVista] =
    useState<Vista>("lista");

  const [modo, setModo] =
    useState<
      "crear" | "editar"
    >("crear");

  const [
    seleccionada,
    setSeleccionada,
  ] =
    useState<CategoriaConRelaciones | null>(
      null
    );

  const [busqueda, setBusqueda] =
    useState("");

  const [limite, setLimite] =
    useState(15);

  const [
    reordenandoId,
    setReordenandoId,
  ] =
    useState<string | null>(
      null
    );

  // ===========================================================================
  // FILTRADO
  // ===========================================================================

  const categoriasFiltradas =
    useMemo(() => {
      return categoriasIniciales.filter(
        (cat) => {
          const texto =
            busqueda
              .toLowerCase()
              .trim();

          return (
            cat.nombre
              .toLowerCase()
              .includes(texto) ||
            cat.slug
              .toLowerCase()
              .includes(texto)
          );
        }
      );
    }, [
      categoriasIniciales,
      busqueda,
    ]);

  const categoriasVisibles =
    useMemo(
      () =>
        categoriasFiltradas.slice(
          0,
          limite
        ),
      [
        categoriasFiltradas,
        limite,
      ]
    );

  // Para evitar confusión:
  // mientras hay búsqueda activa,
  // no permitimos reordenar.
  const puedeReordenar =
    busqueda.trim() === "";

  const hayMasCategorias =
    categoriasFiltradas.length >
    limite;

  // ===========================================================================
  // VOLVER
  // ===========================================================================

  const volverALista =
    useCallback(() => {
      setVista("lista");
      setSeleccionada(null);
      router.refresh();
    }, [router]);

  // ===========================================================================
  // ELIMINAR
  // ===========================================================================

  const handleEliminar =
    async () => {
      if (
        !seleccionada ||
        !esAdmin
      ) {
        return;
      }

      const res =
        await eliminarCategoria(
          seleccionada.id
        );

      if (res.success) {
        toast.success(
          "Categoría eliminada"
        );

        volverALista();
      } else {
        toast.error(
          res.error ||
            "Error al eliminar"
        );
      }
    };

  // ===========================================================================
  // MOVER
  // ===========================================================================

  const handleMover =
    async (
      categoria: CategoriaConRelaciones,
      direccion:
        | "SUBIR"
        | "BAJAR"
    ) => {
      if (!puedeReordenar) {
        toast.error(
          "Limpia la búsqueda antes de cambiar el orden."
        );
        return;
      }

      try {
        setReordenandoId(
          categoria.id
        );

        const res =
          await moverCategoria(
            categoria.id,
            direccion
          );

        if (res.success) {
          toast.success(
            "Orden actualizado"
          );

          router.refresh();
        } else {
          toast.error(
            res.error ||
              "No se pudo cambiar el orden"
          );
        }
      } catch (error) {
        console.error(error);

        toast.error(
          "No se pudo cambiar el orden"
        );
      } finally {
        setReordenandoId(
          null
        );
      }
    };

  // ===========================================================================
  // INTERFAZ
  // ===========================================================================

  return (
    <div className="w-full space-y-6">
      {vista !== "eliminar" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Categorías
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Administra las
              categorías y su orden
              de aparición en la web.
            </p>
          </div>

          {vista === "lista" &&
            esAdmin && (
              <button
                onClick={() => {
                  setModo(
                    "crear"
                  );

                  setSeleccionada(
                    null
                  );

                  setVista(
                    "formulario"
                  );
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
              >
                <Plus size={18} />

                Nueva categoría
              </button>
            )}

          {(vista ===
            "formulario" ||
            vista ===
              "detalle") && (
            <button
              onClick={
                volverALista
              }
              className="text-slate-600 hover:text-slate-800 font-semibold text-sm cursor-pointer"
            >
              ← Volver al listado
            </button>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* INFORMACIÓN SOBRE EL ORDEN */}
      {/* ================================================================ */}

      {vista === "lista" && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <ArrowUpDown
            size={18}
            className="text-orange-600 shrink-0 mt-0.5"
          />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Orden de aparición
            </p>

            <p className="text-xs text-slate-500 mt-0.5">
              Usa las flechas ↑ ↓
              para cambiar la
              posición de las
              categorías. Este orden
              también se refleja en
              la web pública.
            </p>

            {!puedeReordenar && (
              <p className="text-xs font-semibold text-orange-700 mt-1">
                Limpia la búsqueda
                para habilitar el
                reordenamiento.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* LISTA */}
      {/* ================================================================ */}

      {vista === "lista" && (
        <>
          <Filtros
            busqueda={busqueda}
            setBusqueda={
              setBusqueda
            }
          />

          <Tabla
            categorias={
              categoriasVisibles
            }
            esAdmin={esAdmin}
            puedeReordenar={
              puedeReordenar
            }
            reordenandoId={
              reordenandoId
            }
            hayMasCategorias={
              hayMasCategorias
            }
            onMover={
              handleMover
            }
            onVerDetalle={(
              cat
            ) => {
              setSeleccionada(
                cat
              );

              setVista(
                "detalle"
              );
            }}
            onEditar={(cat) => {
              if (!esAdmin) {
                return;
              }

              setModo(
                "editar"
              );

              setSeleccionada(
                cat
              );

              setVista(
                "formulario"
              );
            }}
            onEliminar={(
              cat
            ) => {
              if (!esAdmin) {
                return;
              }

              setSeleccionada(
                cat
              );

              setVista(
                "eliminar"
              );
            }}
          />

          {categoriasFiltradas.length >
            limite && (
            <div className="flex justify-center">
              <button
                onClick={() =>
                  setLimite(
                    (prev) =>
                      prev + 15
                  )
                }
                className="bg-white border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition cursor-pointer"
              >
                Ver más
                categorías…
              </button>
            </div>
          )}
        </>
      )}

      {/* ================================================================ */}
      {/* FORMULARIO - SOLO ADMIN */}
      {/* ================================================================ */}

      {vista ===
        "formulario" &&
        esAdmin && (
          <Formulario
            modo={modo}
            categoria={
              seleccionada
            }
            onGuardado={
              volverALista
            }
            onCancelar={
              volverALista
            }
          />
        )}

      {/* ================================================================ */}
      {/* DETALLE */}
      {/* ================================================================ */}

      {vista === "detalle" &&
        seleccionada && (
          <Detalle
            categoria={
              seleccionada
            }
            onVolver={
              volverALista
            }
          />
        )}

      {/* ================================================================ */}
      {/* ELIMINAR - SOLO ADMIN */}
      {/* ================================================================ */}

      {vista ===
        "eliminar" &&
        seleccionada &&
        esAdmin && (
          <EliminarConfirmacion
            nombre={
              seleccionada.nombre
            }
            slug={
              seleccionada.slug
            }
            onConfirmar={
              handleEliminar
            }
            onCancelar={
              volverALista
            }
          />
        )}
    </div>
  );
}