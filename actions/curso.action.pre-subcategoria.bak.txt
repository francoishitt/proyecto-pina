"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { cursoSchema } from "@/lib/validations/curso.schema";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET } from "@/lib/r2";
import {
  exigirAdmin,
  exigirUsuarioPanel,
  mensajeErrorPermisos,
} from "@/lib/auth";

// --- Guachimán de Tipos para Prisma ---
interface PrismaError extends Error {
  code: string;
}

function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "string"
  );
}

// =========================================================================
// ARCHIVOS EN CLOUDFLARE R2
// =========================================================================

async function uploadFile(
  file: File,
  tipoLog: "PDF" | "Portada"
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (tipoLog === "PDF") {
    if (file.size > 20 * 1024 * 1024) {
      throw new Error("El PDF no puede superar 20 MB.");
    }

    if (file.type !== "application/pdf" || ext !== "pdf") {
      throw new Error("Solo se permiten archivos PDF.");
    }
  } else {
    const extensiones = ["jpg", "jpeg", "png", "webp"];
    const tipos = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("La portada no puede superar 5 MB.");
    }

    if (
      !ext ||
      !extensiones.includes(ext) ||
      !tipos.includes(file.type)
    ) {
      throw new Error("La portada debe ser JPG, PNG o WEBP.");
    }
  }

  const fileName = `${uuidv4()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    console.log(
      `Archivo guardado correctamente en R2: ${fileName} (${tipoLog})`
    );

    // La URL pública interna de Proyecto Piña NO cambia.
    return `/api/archivos/${fileName}`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error al guardar archivo en R2:",
        error.message
      );
    }

    throw new Error("Error al guardar archivo.");
  }
}

async function deleteFile(url: string) {
  // Ejemplo:
  // /api/archivos/archivo.pdf -> archivo.pdf
  const fileName = url.split("/").pop();

  if (!fileName) {
    return;
  }

  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileName,
      })
    );

    console.log(
      `Archivo eliminado correctamente de R2: ${fileName}`
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "No se pudo eliminar archivo de R2:",
        error.message
      );
    }
  }
}

// =========================================================================
// OBTENER CURSOS
// =========================================================================

export async function obtenerCursos() {
  try {
    await exigirUsuarioPanel();

    const cursos = await prisma.curso.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
        subcategoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    return {
      success: true,
      data: cursos,
    };
  } catch (error: unknown) {
    const permiso = mensajeErrorPermisos(error);

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (error instanceof Error) {
      console.error(
        "obtenerCursos:",
        error.message
      );
    }

    return {
      success: false,
      error: "No se pudieron cargar los cursos.",
    };
  }
}

// =========================================================================
// CREAR CURSO
// =========================================================================

export async function crearCurso(formData: FormData) {
  try {
    await exigirUsuarioPanel();

    const raw = {
      titulo:
        formData.get("titulo")?.toString() || "",

      slug:
        formData.get("slug")?.toString() || "",

      descripcionCorta:
        formData.get("descripcionCorta")?.toString() || "",

      descripcion:
        formData.get("descripcion")?.toString() || "",

      esGratis:
        formData.get("esGratis") === "true",

      precio: formData.get("precio")
        ? parseFloat(formData.get("precio") as string)
        : undefined,

      publicado:
        formData.get("publicado") === "true",

      categoriaId:
        formData.get("categoriaId")?.toString() || "",

      subcategoriaId:
        formData.get("subcategoriaId")?.toString() ||
        undefined,
    };

    const {
      portada: _p,
      pdf: _pdf,
      ...schemaSinArchivos
    } = cursoSchema.shape;

    const schemaParcial = z.object(schemaSinArchivos);

    const validacion =
      schemaParcial.safeParse(raw);

    if (!validacion.success) {
      return {
        success: false,
        error:
          validacion.error.issues[0].message,
      };
    }

    const datosValidados =
      validacion.data;

    const portadaFile =
      formData.get("portada") as File | null;

    const pdfFile =
      formData.get("pdf") as File | null;

    if (
      !pdfFile ||
      pdfFile.size === 0
    ) {
      throw new Error(
        "El archivo PDF es obligatorio."
      );
    }

    // PDF -> R2
    const pdfUrl =
      await uploadFile(
        pdfFile,
        "PDF"
      );

    // Portada -> R2
    let portadaUrl: string | null =
      null;

    if (
      portadaFile &&
      portadaFile.size > 0
    ) {
      portadaUrl =
        await uploadFile(
          portadaFile,
          "Portada"
        );
    }

    const curso =
      await prisma.curso.create({
        data: {
          ...datosValidados,

          precio:
            datosValidados.precio ??
            null,

          subcategoriaId:
            datosValidados.subcategoriaId ??
            null,

          tituloBusqueda:
            datosValidados.titulo
              .normalize("NFD")
              .replace(
                /[\u0300-\u036f]/g,
                ""
              )
              .toLowerCase(),

          portadaUrl,
          pdfUrl,
        },
      });

    revalidatePath(
      "/",
      "layout"
    );

    return {
      success: true,
      data: curso,
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(error);

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (
      isPrismaError(error) &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error:
          "El título o slug ya existe.",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al crear el material.",
    };
  }
}

// =========================================================================
// ACTUALIZAR CURSO
// =========================================================================

export async function actualizarCurso(
  id: string,
  formData: FormData
) {
  try {
    await exigirUsuarioPanel();

    const cursoActual =
      await prisma.curso.findUnique({
        where: {
          id,
        },
      });

    if (!cursoActual) {
      throw new Error(
        "Curso no encontrado."
      );
    }

    const raw = {
      titulo:
        formData.get("titulo")?.toString() || "",

      slug:
        formData.get("slug")?.toString() || "",

      descripcionCorta:
        formData.get("descripcionCorta")?.toString() || "",

      descripcion:
        formData.get("descripcion")?.toString() || "",

      esGratis:
        formData.get("esGratis") === "true",

      precio: formData.get("precio")
        ? parseFloat(formData.get("precio") as string)
        : undefined,

      publicado:
        formData.get("publicado") === "true",

      categoriaId:
        formData.get("categoriaId")?.toString() || "",

      subcategoriaId:
        formData.get("subcategoriaId")?.toString() ||
        undefined,
    };

    const {
      portada: _p,
      pdf: _pdf,
      ...schemaSinArchivos
    } = cursoSchema.shape;

    const schemaParcial =
      z.object(schemaSinArchivos);

    const validacion =
      schemaParcial.safeParse(raw);

    if (!validacion.success) {
      return {
        success: false,
        error:
          validacion.error.issues[0]
            .message,
      };
    }

    const datosValidados =
      validacion.data;

    const portadaFile =
      formData.get("portada") as File | null;

    const pdfFile =
      formData.get("pdf") as File | null;

    let portadaUrl =
      cursoActual.portadaUrl;

    let pdfUrl =
      cursoActual.pdfUrl;

    // Nueva portada
    if (
      portadaFile &&
      portadaFile.size > 0
    ) {
      if (portadaUrl) {
        await deleteFile(
          portadaUrl
        );
      }

      portadaUrl =
        await uploadFile(
          portadaFile,
          "Portada"
        );
    }

    // Nuevo PDF
    if (
      pdfFile &&
      pdfFile.size > 0
    ) {
      if (pdfUrl) {
        await deleteFile(
          pdfUrl
        );
      }

      pdfUrl =
        await uploadFile(
          pdfFile,
          "PDF"
        );
    }

    const curso =
      await prisma.curso.update({
        where: {
          id,
        },

        data: {
          ...datosValidados,

          precio:
            datosValidados.precio ??
            null,

          subcategoriaId:
            datosValidados.subcategoriaId ??
            null,

          tituloBusqueda:
            datosValidados.titulo
              .normalize("NFD")
              .replace(
                /[\u0300-\u036f]/g,
                ""
              )
              .toLowerCase(),

          portadaUrl,
          pdfUrl,
        },
      });

    revalidatePath(
      "/",
      "layout"
    );

    revalidatePath(
      `/cursos/${datosValidados.slug}`
    );

    return {
      success: true,
      data: curso,
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(error);

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (
      isPrismaError(error) &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error:
          "El título o slug ya está en uso.",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar el material.",
    };
  }
}

// =========================================================================
// ELIMINAR CURSO
// =========================================================================

export async function eliminarCurso(
  id: string
) {
  try {
    await exigirAdmin();

    const curso =
      await prisma.curso.findUnique({
        where: {
          id,
        },
      });

    if (!curso) {
      throw new Error(
        "Curso no encontrado."
      );
    }

    if (curso.portadaUrl) {
      await deleteFile(
        curso.portadaUrl
      );
    }

    if (curso.pdfUrl) {
      await deleteFile(
        curso.pdfUrl
      );
    }

    await prisma.curso.delete({
      where: {
        id,
      },
    });

    revalidatePath(
      "/",
      "layout"
    );

    return {
      success: true,
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(error);

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (
      isPrismaError(error) &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        error:
          "No se puede eliminar: tiene dependencias.",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al eliminar.",
    };
  }
}

// =========================================================================
// BUSCADOR RÁPIDO
// =========================================================================

export async function buscarCursosRapido(
  termino: string
) {
  try {
    const cursosRaw =
      await prisma.$queryRaw`
        SELECT id, titulo, slug
        FROM Curso
        WHERE publicado = 1
          AND titulo LIKE ${`%${termino}%`}
        LIMIT 5
      `;

    const cursos =
      Array.isArray(cursosRaw)
        ? cursosRaw
        : [];

    return {
      success: true,
      data: cursos,
    };
  } catch (error) {
    console.error(
      "Error en el buscador rápido:",
      error
    );

    return {
      success: false,
      error:
        "Error al buscar cursos",
    };
  }
}