"use client";

import {
  useEffect,
  useRef,
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

  const categoriaRefs =
    useRef<
      Record<
        string,
        HTMLDivElement | null
      >
    >({});

  const obtenerSubcategorias =
    (
      categoriaId: string
    ) =>
      subcategorias.filter(
        (subcategoria) =>
          subcategoria.categoriaId ===
          categoriaId
      );

  const llevarCategoriaAlInicio =
    (
      categoriaId: string
    ) => {
      setTimeout(() => {
        categoriaRefs.current[
          categoriaId
        ]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    };

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

      setAbiertas({
        [categoriaId]:
          true,
      });

      llevarCategoriaAlInicio(
        categoriaId
      );
    };

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

            llevarCategoriaAlInicio(
              subObj.categoriaId
            );
          }

          return;
        }

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

            llevarCategoriaAlInicio(
              catUrl
            );
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
                ref={(elemento) => {
                  categoriaRefs.current[
                    cat.id
                  ] =
                    elemento;
                }}
                className="space-y-1 w-full scroll-mt-2"
              >
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