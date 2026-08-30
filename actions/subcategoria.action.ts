"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import {
  exigirAdmin,
  mensajeErrorPermisos,
} from "@/lib/auth";

import { subcategoriaSchema } from "@/lib/validations/subcategoria.schema";

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
// OBTENER SUBCATEGORÍAS
// =============================================================================

export async function obtenerSubcategorias() {
  try {
    const data =
      await prisma.subcategoria.findMany({
        orderBy: [
          {
            orden: "asc",
          },
          {
            nombre: "asc",
          },
        ],

        include: {
          categoria: {
            select: {
              id: true,
              nombre: true,
            },
          },

          _count: {
            select: {
              cursos: true,
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
      "obtenerSubcategorias",
      error
    );

    return {
      success: false,
      error:
        "No se pudieron cargar las subcategorías.",
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
    categoriaId:
      fd.get("categoriaId"),

    orden: Number(
      fd.get("orden") || 0
    ),

    visible:
      fd.get("visible") === "true",
  };
}

// =============================================================================
// CREAR SUBCATEGORÍA
// SOLO ADMIN
// =============================================================================

export async function crearSubcategoria(
  fd: FormData
) {
  try {
    await exigirAdmin();

    const datos =
      subcategoriaSchema.parse(
        raw(fd)
      );

    const data =
      await prisma.subcategoria.create({
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
      "crearSubcategoria",
      error
    );

    return {
      success: false,
      error:
        "Error al crear la subcategoría.",
    };
  }
}

// =============================================================================
// ACTUALIZAR SUBCATEGORÍA
// SOLO ADMIN
// =============================================================================

export async function actualizarSubcategoria(
  id: string,
  fd: FormData
) {
  try {
    await exigirAdmin();

    const datos =
      subcategoriaSchema.parse(
        raw(fd)
      );

    const data =
      await prisma.subcategoria.update({
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
      "actualizarSubcategoria",
      error
    );

    return {
      success: false,
      error:
        "Error al actualizar la subcategoría.",
    };
  }
}

// =============================================================================
// ELIMINAR SUBCATEGORÍA
// SOLO ADMIN
// =============================================================================

export async function eliminarSubcategoria(
  id: string
) {
  try {
    await exigirAdmin();

    // -------------------------------------------------------------------------
    // Primero comprobamos si existe y si tiene materiales.
    // No dependemos únicamente de la restricción P2003 de la base.
    // -------------------------------------------------------------------------

    const subcategoria =
      await prisma.subcategoria.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          nombre: true,

          _count: {
            select: {
              cursos: true,
            },
          },
        },
      });

    if (!subcategoria) {
      return {
        success: false,
        error:
          "La subcategoría no existe.",
      };
    }

    if (
      subcategoria._count.cursos > 0
    ) {
      return {
        success: false,
        error:
          `No puedes eliminar la subcategoría "${subcategoria.nombre}" ` +
          `porque tiene ${subcategoria._count.cursos} material(es) asociado(s). ` +
          "Primero reasigna o elimina esos materiales.",
      };
    }

    await prisma.subcategoria.delete({
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

    // Respaldo adicional por integridad referencial.
    if (
      isPrismaError(error) &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        error:
          "La subcategoría todavía tiene materiales asociados y no puede eliminarse.",
      };
    }

    console.error(
      "eliminarSubcategoria",
      error
    );

    return {
      success: false,
      error:
        "No se pudo eliminar la subcategoría.",
    };
  }
}