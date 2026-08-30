"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import {
  exigirAdmin,
  exigirGestorEstructura,
  mensajeErrorPermisos,
} from "@/lib/auth";

import { categoriaSchema } from "@/lib/validations/categoria.schema";

// =============================================================================
// TIPOS
// =============================================================================

interface PrismaError extends Error {
  code: string;
}

const isPrismaError = (
  error: unknown
): error is PrismaError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error;

// =============================================================================
// REVALIDACIÓN
// =============================================================================

const limpiar = () => {
  revalidatePath("/", "layout");
  revalidatePath("/cursos");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/subcategorias");
};

// =============================================================================
// OBTENER CATEGORÍAS
// =============================================================================

export async function obtenerCategorias() {
  try {
    const data =
      await prisma.categoria.findMany({
        orderBy: [
          {
            orden: "asc",
          },
          {
            nombre: "asc",
          },
        ],

        include: {
          _count: {
            select: {
              subcategorias: true,
              cursos: true,
            },
          },

          subcategorias: {
            orderBy: [
              {
                orden: "asc",
              },
              {
                nombre: "asc",
              },
            ],

            select: {
              id: true,
              nombre: true,
              orden: true,
              visible: true,

              _count: {
                select: {
                  cursos: true,
                },
              },
            },
          },

          cursos: {
            select: {
              id: true,
              titulo: true,
            },
          },
        },
      });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "obtenerCategorias",
      error
    );

    return {
      success: false,
      error:
        "No se pudieron cargar las categorías.",
    };
  }
}

// =============================================================================
// CONVERTIR FORMDATA
// =============================================================================

function raw(fd: FormData) {
  return {
    nombre: fd.get("nombre"),
    slug: fd.get("slug"),
    descripcion:
      fd.get("descripcion"),

    orden: Number(
      fd.get("orden") || 0
    ),

    visible:
      fd.get("visible") === "true",
  };
}

// =============================================================================
// CREAR CATEGORÍA
// SOLO ADMIN
// =============================================================================

export async function crearCategoria(
  fd: FormData
) {
  try {
    await exigirAdmin();

    const datos =
      categoriaSchema.parse(
        raw(fd)
      );

    const data =
      await prisma.categoria.create({
        data: datos,
      });

    limpiar();

    return {
      success: true,
      data,
    };
  } catch (error) {
    const permiso =
      mensajeErrorPermisos(error);

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        error:
          error.issues[0]
            ?.message ||
          "Datos inválidos.",
      };
    }

    if (
      isPrismaError(error) &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error:
          "El nombre o slug ya existe.",
      };
    }

    console.error(
      "crearCategoria",
      error
    );

    return {
      success: false,
      error:
        "Error al crear la categoría.",
    };
  }
}

// =============================================================================
// ACTUALIZAR CATEGORÍA
// SOLO ADMIN
// =============================================================================

export async function actualizarCategoria(
  id: string,
  fd: FormData
) {
  try {
    await exigirAdmin();

    const datos =
      categoriaSchema.parse(
        raw(fd)
      );

    const data =
      await prisma.categoria.update({
        where: {
          id,
        },

        data: datos,
      });

    limpiar();

    return {
      success: true,
      data,
    };
  } catch (error) {
    const permiso =
      mensajeErrorPermisos(error);

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        error:
          error.issues[0]
            ?.message ||
          "Datos inválidos.",
      };
    }

    if (
      isPrismaError(error) &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error:
          "El nombre o slug ya existe.",
      };
    }

    console.error(
      "actualizarCategoria",
      error
    );

    return {
      success: false,
      error:
        "Error al actualizar la categoría.",
    };
  }
}

// =============================================================================
// ELIMINAR CATEGORÍA
// SOLO ADMIN
// =============================================================================

export async function eliminarCategoria(
  id: string
) {
  try {
    await exigirAdmin();

    // -------------------------------------------------------------------------
    // Primero comprobamos la estructura asociada.
    //
    // Una categoría NO puede eliminarse si todavía contiene:
    // - subcategorías;
    // - materiales asociados directamente.
    //
    // Así evitamos depender únicamente del error P2003 de Prisma.
    // -------------------------------------------------------------------------

    const categoria =
      await prisma.categoria.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          nombre: true,

          _count: {
            select: {
              subcategorias: true,
              cursos: true,
            },
          },
        },
      });

    if (!categoria) {
      return {
        success: false,
        error:
          "La categoría no existe.",
      };
    }

    if (
      categoria._count.subcategorias > 0
    ) {
      return {
        success: false,
        error:
          `No puedes eliminar la categoría "${categoria.nombre}" ` +
          `porque contiene ${categoria._count.subcategorias} subcategoría(s). ` +
          "Primero debes reasignar o eliminar esas subcategorías.",
      };
    }

    if (
      categoria._count.cursos > 0
    ) {
      return {
        success: false,
        error:
          `No puedes eliminar la categoría "${categoria.nombre}" ` +
          `porque tiene ${categoria._count.cursos} material(es) asociado(s). ` +
          "Primero debes reasignar esos materiales.",
      };
    }

    await prisma.categoria.delete({
      where: {
        id,
      },
    });

    limpiar();

    return {
      success: true,
    };
  } catch (error) {
    const permiso =
      mensajeErrorPermisos(error);

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    // Respaldo adicional de integridad referencial.
    if (
      isPrismaError(error) &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        error:
          "La categoría todavía tiene información asociada y no puede eliminarse.",
      };
    }

    console.error(
      "eliminarCategoria",
      error
    );

    return {
      success: false,
      error:
        "No se pudo eliminar la categoría.",
    };
  }
}

// =============================================================================
// MOVER / REORDENAR CATEGORÍA
// ADMIN + SUPERVISOR
// =============================================================================

export async function moverCategoria(
  id: string,
  direccion: "SUBIR" | "BAJAR"
) {
  try {
    // ADMIN y SUPERVISOR pueden modificar únicamente el orden.
    await exigirGestorEstructura();

    const categorias =
      await prisma.categoria.findMany({
        orderBy: [
          {
            orden: "asc",
          },
          {
            nombre: "asc",
          },
        ],

        select: {
          id: true,
          orden: true,
          nombre: true,
        },
      });

    const indiceActual =
      categorias.findIndex(
        (categoria) =>
          categoria.id === id
      );

    if (indiceActual === -1) {
      return {
        success: false,
        error:
          "La categoría no existe.",
      };
    }

    const indiceDestino =
      direccion === "SUBIR"
        ? indiceActual - 1
        : indiceActual + 1;

    // Ya se encuentra en uno de los extremos.
    if (
      indiceDestino < 0 ||
      indiceDestino >=
        categorias.length
    ) {
      return {
        success: true,
      };
    }

    const categoriasOrdenadas = [
      ...categorias,
    ];

    [
      categoriasOrdenadas[
        indiceActual
      ],
      categoriasOrdenadas[
        indiceDestino
      ],
    ] = [
      categoriasOrdenadas[
        indiceDestino
      ],
      categoriasOrdenadas[
        indiceActual
      ],
    ];

    // Renumeramos toda la lista 1, 2, 3...
    // para impedir órdenes repetidos o huecos.

    await prisma.$transaction(
      categoriasOrdenadas.map(
        (
          categoria,
          indice
        ) =>
          prisma.categoria.update({
            where: {
              id: categoria.id,
            },

            data: {
              orden:
                indice + 1,
            },
          })
      )
    );

    limpiar();

    return {
      success: true,
    };
  } catch (error) {
    const permiso =
      mensajeErrorPermisos(error);

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    console.error(
      "moverCategoria",
      error
    );

    return {
      success: false,
      error:
        "No se pudo cambiar el orden de la categoría.",
    };
  }
}