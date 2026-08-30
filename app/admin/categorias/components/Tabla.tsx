import {
  Edit2,
  Trash2,
  Eye,
  Layers,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { CategoriaConRelaciones } from "../types";

interface Props {
  categorias: CategoriaConRelaciones[];

  esAdmin: boolean;

  puedeReordenar: boolean;

  reordenandoId:
    | string
    | null;

  hayMasCategorias: boolean;

  onVerDetalle: (
    cat: CategoriaConRelaciones
  ) => void;

  onEditar: (
    cat: CategoriaConRelaciones
  ) => void;

  onEliminar: (
    cat: CategoriaConRelaciones
  ) => void;

  onMover: (
    cat: CategoriaConRelaciones,
    direccion:
      | "SUBIR"
      | "BAJAR"
  ) => void;
}

export default function Tabla({
  categorias,
  esAdmin,
  puedeReordenar,
  reordenandoId,
  hayMasCategorias,
  onVerDetalle,
  onEditar,
  onEliminar,
  onMover,
}: Props) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">

          {/* ============================================================= */}
          {/* CABECERA */}
          {/* ============================================================= */}

          <thead className="bg-slate-50 border-b border-slate-300">
            <tr>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-xs">
                Nombre
              </th>

              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">
                Slug
              </th>

              <th className="px-3 py-4 text-slate-400 font-semibold uppercase text-xs text-center">
                Orden
              </th>

              <th className="px-3 py-4 text-slate-400 font-semibold uppercase text-xs text-center">
                Mover
              </th>

              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">
                Estado
              </th>

              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">
                Subcategorías
              </th>

              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">
                Cursos
              </th>

              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">
                Ver
              </th>

              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">
                Acciones
              </th>
            </tr>
          </thead>

          {/* ============================================================= */}
          {/* CUERPO */}
          {/* ============================================================= */}

          <tbody className="divide-y divide-slate-200">

            {/* =========================================================== */}
            {/* VACÍO */}
            {/* =========================================================== */}

            {categorias.length ===
              0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-16 text-slate-500"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center mb-4">
                      <Layers
                        size={28}
                        strokeWidth={
                          1.5
                        }
                      />
                    </div>

                    <p className="text-sm font-bold text-slate-700">
                      No se
                      encontraron
                      categorías
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Ajusta la
                      búsqueda o crea
                      una nueva.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* =========================================================== */}
            {/* CATEGORÍAS */}
            {/* =========================================================== */}

            {categorias.map(
              (
                cat,
                index
              ) => {
                const procesando =
                  reordenandoId ===
                  cat.id;

                const esPrimera =
                  index === 0;

                // Si todavía existen
                // categorías ocultas
                // por "Ver más", la
                // última visible NO
                // necesariamente es
                // la última global.
                const esUltima =
                  index ===
                    categorias.length -
                      1 &&
                  !hayMasCategorias;

                return (
                  <tr
                    key={
                      cat.id
                    }
                    className="hover:bg-slate-50 transition"
                  >

                    {/* Nombre */}
                    <td className="px-5 py-4 font-semibold text-slate-800 truncate max-w-[200px]">
                      {
                        cat.nombre
                      }
                    </td>

                    {/* Slug */}
                    <td className="hidden md:table-cell px-5 py-4 font-mono text-xs text-slate-500">
                      {
                        cat.slug
                      }
                    </td>

                    {/* Orden */}
                    <td className="px-3 py-4 text-center">
                      <span className="inline-flex min-w-8 justify-center rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        {
                          cat.orden
                        }
                      </span>
                    </td>

                    {/* Mover */}
                    <td className="px-3 py-4 text-center">
                      <div className="flex justify-center items-center gap-1">

                        {procesando ? (
                          <Loader2
                            size={
                              17
                            }
                            className="animate-spin text-orange-600"
                          />
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onMover(
                                  cat,
                                  "SUBIR"
                                )
                              }
                              disabled={
                                !puedeReordenar ||
                                esPrimera ||
                                reordenandoId !==
                                  null
                              }
                              className="p-1.5 rounded-md text-slate-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-25 disabled:cursor-not-allowed transition cursor-pointer"
                              title={
                                !puedeReordenar
                                  ? "Limpia la búsqueda para reordenar"
                                  : esPrimera
                                  ? "Ya es la primera categoría"
                                  : "Subir categoría"
                              }
                            >
                              <ArrowUp
                                size={
                                  17
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onMover(
                                  cat,
                                  "BAJAR"
                                )
                              }
                              disabled={
                                !puedeReordenar ||
                                esUltima ||
                                reordenandoId !==
                                  null
                              }
                              className="p-1.5 rounded-md text-slate-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-25 disabled:cursor-not-allowed transition cursor-pointer"
                              title={
                                !puedeReordenar
                                  ? "Limpia la búsqueda para reordenar"
                                  : esUltima
                                  ? "Ya es la última categoría"
                                  : "Bajar categoría"
                              }
                            >
                              <ArrowDown
                                size={
                                  17
                                }
                              />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="hidden sm:table-cell px-5 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          cat.visible
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cat.visible
                          ? "Visible"
                          : "Oculta"}
                      </span>
                    </td>

                    {/* Subcategorías */}
                    <td className="hidden sm:table-cell px-5 py-4 text-center font-bold text-slate-700">
                      {cat._count
                        ?.subcategorias ??
                        0}
                    </td>

                    {/* Cursos */}
                    <td className="hidden sm:table-cell px-5 py-4 text-center font-bold text-slate-700">
                      {cat._count
                        ?.cursos ??
                        0}
                    </td>

                    {/* Ver */}
                    <td className="hidden sm:table-cell px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          onVerDetalle(
                            cat
                          )
                        }
                        className="p-1.5 text-slate-400 hover:text-orange-600 transition cursor-pointer"
                        title="Ver detalle"
                      >
                        <Eye
                          size={
                            18
                          }
                        />
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-1.5">

                        {/* Ver en móvil */}
                        <button
                          type="button"
                          onClick={() =>
                            onVerDetalle(
                              cat
                            )
                          }
                          className="sm:hidden p-1.5 text-orange-600 hover:text-orange-700 cursor-pointer"
                          title="Ver"
                        >
                          <Eye
                            size={
                              16
                            }
                          />
                        </button>

                        {/* SOLO ADMIN */}
                        {esAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onEditar(
                                  cat
                                )
                              }
                              className="p-1.5 text-slate-400 hover:text-orange-600 transition cursor-pointer"
                              title="Editar"
                            >
                              <Edit2
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onEliminar(
                                  cat
                                )
                              }
                              className="p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2
                                size={
                                  16
                                }
                              />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}