"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ChevronDown,
} from "lucide-react";

import {
  useSearchParams,
} from "next/navigation";

interface Categoria {
  id: string;
  nombre: string;
}

interface Subcategoria {
  id: string;
  nombre: string;
  categoriaId: string;
}

interface SidebarProps {
  categorias: Categoria[];
  subcategorias: Subcategoria[];

  categoriaSel: string;
  setCategoriaSel: (
    id: string
  ) => void;

  subcategoriaSel: string;
  setSubcategoriaSel: (
    id: string
  ) => void;
}

export default function Sidebar({
  categorias,
  subcategorias,
  categoriaSel,
  setCategoriaSel,
  subcategoriaSel,
  setSubcategoriaSel,
}: SidebarProps) {
  const [
    abiertas,
    setAbiertas,
  ] = useState<
    Record<string, boolean>
  >({});

  const searchParams =
    useSearchParams();

  // ---------------------------------------------------------------------------
  // Obtiene únicamente las subcategorías pertenecientes a una categoría.
  // ---------------------------------------------------------------------------

  const obtenerSubcategorias =
    (
      categoriaId: string
    ) =>
      subcategorias.filter(
        (subcategoria) =>
          subcategoria.categoriaId ===
          categoriaId
      );

  // ---------------------------------------------------------------------------
  // Seleccionar una categoría:
  //
  // 1. Selecciona la categoría.
  // 2. Abre sus subcategorías.
  // 3. Si tiene subcategorías, selecciona automáticamente la primera.
  // 4. Si no tiene, deja subcategoriaSel vacío.
  // ---------------------------------------------------------------------------

  const seleccionarCategoria =
    (
      categoriaId: string
    ) => {
      const subs =
        obtenerSubcategorias(
          categoriaId
        );

      setCategoriaSel(
        categoriaId
      );

      setSubcategoriaSel(
        subs.length > 0
          ? subs[0].id
          : ""
      );

      // Dejamos abierta únicamente
      // la categoría seleccionada.
      setAbiertas({
        [categoriaId]:
          true,
      });
    };

  // ---------------------------------------------------------------------------
  // Selecciones que llegan mediante URL.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const catUrl =
      searchParams.get(
        "categoria"
      );

    const subUrl =
      searchParams.get(
        "subcategoria"
      );

    const timer =
      setTimeout(() => {
        // ---------------------------------------------------------------
        // Si viene una subcategoría específica en la URL,
        // respetamos esa selección.
        // ---------------------------------------------------------------

        if (subUrl) {
          const subObj =
            subcategorias.find(
              (sub) =>
                sub.id ===
                subUrl
            );

          if (subObj) {
            setCategoriaSel(
              subObj.categoriaId
            );

            setSubcategoriaSel(
              subObj.id
            );

            setAbiertas({
              [subObj.categoriaId]:
                true,
            });
          }

          return;
        }

        // ---------------------------------------------------------------
        // Si viene solamente una categoría,
        // seleccionamos automáticamente su primera subcategoría.
        // ---------------------------------------------------------------

        if (catUrl) {
          const categoriaExiste =
            categorias.some(
              (categoria) =>
                categoria.id ===
                catUrl
            );

          if (
            categoriaExiste
          ) {
            const subs =
              subcategorias.filter(
                (
                  subcategoria
                ) =>
                  subcategoria.categoriaId ===
                  catUrl
              );

            setCategoriaSel(
              catUrl
            );

            setSubcategoriaSel(
              subs.length > 0
                ? subs[0].id
                : ""
            );

            setAbiertas({
              [catUrl]:
                true,
            });
          }
        }
      }, 0);

    return () =>
      clearTimeout(
        timer
      );
  }, [
    searchParams,
    categorias,
    subcategorias,
    setCategoriaSel,
    setSubcategoriaSel,
  ]);

  // ---------------------------------------------------------------------------
  // Flecha del acordeón.
  //
  // La flecha solamente abre/cierra visualmente las subcategorías.
  // No cambia el filtro seleccionado.
  // ---------------------------------------------------------------------------

  const toggleCategoria =
    (
      catId: string,
      e: React.MouseEvent
    ) => {
      e.stopPropagation();

      setAbiertas(
        (prev) => ({
          ...prev,
          [catId]:
            !prev[
              catId
            ],
        })
      );
    };

  // ---------------------------------------------------------------------------
  // Todas las áreas
  // ---------------------------------------------------------------------------

  const seleccionarTodas =
    () => {
      setCategoriaSel(
        ""
      );

      setSubcategoriaSel(
        ""
      );

      setAbiertas({});
    };

  return (
    <div className="w-full">
      <div className="space-y-1.5 w-full">
        {/* Todas las áreas */}
        <button
          type="button"
          onClick={
            seleccionarTodas
          }
          className={`w-full text-left font-medium text-sm py-2.5 px-3 rounded-xl transition-colors cursor-pointer ${
            categoriaSel ===
            ""
              ? "bg-blue-950 text-white shadow-md shadow-blue-950/20"
              : "text-slate-600 hover:text-blue-950 hover:bg-slate-100"
          }`}
        >
          Todas las áreas
        </button>

        {categorias.map(
          (cat) => {
            const estaActiva =
              categoriaSel ===
              cat.id;

            const subcatsDeEsta =
              obtenerSubcategorias(
                cat.id
              );

            const estaExpandida =
              Boolean(
                abiertas[
                  cat.id
                ]
              );

            return (
              <div
                key={
                  cat.id
                }
                className="space-y-1 w-full"
              >
                {/* Categoría */}
                <div
                  onClick={() =>
                    seleccionarCategoria(
                      cat.id
                    )
                  }
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-colors border ${
                    estaActiva
                      ? "bg-blue-50 text-blue-950 font-semibold border-blue-200"
                      : "border-transparent text-slate-600 hover:text-blue-950 hover:bg-slate-100"
                  }`}
                >
                  <span className="pr-2 text-sm line-clamp-2 leading-snug">
                    {
                      cat.nombre
                    }
                  </span>

                  {subcatsDeEsta.length >
                    0 && (
                    <button
                      type="button"
                      onClick={(
                        e
                      ) =>
                        toggleCategoria(
                          cat.id,
                          e
                        )
                      }
                      className={`p-1.5 rounded-lg hover:bg-slate-200/60 transition-transform duration-300 shrink-0 cursor-pointer ${
                        estaExpandida
                          ? "rotate-180 text-blue-950"
                          : "text-slate-400"
                      }`}
                      aria-label={
                        estaExpandida
                          ? "Ocultar subcategorías"
                          : "Mostrar subcategorías"
                      }
                    >
                      <ChevronDown
                        size={
                          14
                        }
                      />
                    </button>
                  )}
                </div>

                {/* Subcategorías de la categoría seleccionada */}
                {estaExpandida &&
                  subcatsDeEsta.length >
                    0 && (
                    <div className="pl-4 space-y-1 my-1 border-l-2 border-blue-100 ml-3 w-full">
                      {subcatsDeEsta.map(
                        (
                          sub
                        ) => {
                          const isSubSelected =
                            subcategoriaSel ===
                            sub.id;

                          return (
                            <button
                              key={
                                sub.id
                              }
                              type="button"
                              onClick={() => {
                                setCategoriaSel(
                                  cat.id
                                );

                                setSubcategoriaSel(
                                  sub.id
                                );

                                setAbiertas({
                                  [cat.id]:
                                    true,
                                });
                              }}
                              className={`w-full text-left text-xs py-2 px-2.5 rounded-lg transition-colors cursor-pointer line-clamp-2 leading-snug border ${
                                isSubSelected
                                  ? "bg-blue-100 text-blue-950 font-semibold border-blue-200"
                                  : "font-medium text-slate-500 border-transparent hover:text-blue-950 hover:bg-slate-100"
                              }`}
                            >
                              {
                                sub.nombre
                              }
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}