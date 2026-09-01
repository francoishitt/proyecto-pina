"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  exigirAdmin,
  mensajeErrorPermisos,
} from "@/lib/auth";

const CONFIG_DEFAULT = {
  id: "1",

  nombreCentro:
    "Academias Proyecto Piña",

  tituloSitio:
    "Academias Proyecto Piña | Preparación Preuniversitaria",

  descripcionSeo:
    "Preparación preuniversitaria en Iquitos",

  logoUrl: null,

  whatsapp:
    "51925030648",

  whatsappMensaje:
    "Hola Proyecto Piña, deseo solicitar información.",

  telefono:
    "+51 925 030 648",

  direccion:
    "Iquitos, Loreto, Perú",

  emailContacto:
    "informes@proyectopina.com",

  facebook: null,
  instagram: null,
  tiktok: null,
  youtube: null,

  heroTitulo:
    "Prepárate para ingresar",

  heroSubtitulo:
    "Material académico y preparación preuniversitaria",

  mostrarVideosInicio:
    true,

  cantidadVideosInicio:
    6,
};

// =============================================================================
// OBTENER CONFIGURACIÓN
//
// Se mantiene sin exigir ADMIN porque esta información también es utilizada
// por partes públicas de la web.
// =============================================================================

export async function obtenerConfiguracion() {
  try {
    const data =
      await prisma.configuracionWeb.findUnique({
        where: {
          id: "1",
        },
      });

    return {
      success: true,
      data:
        data ??
        CONFIG_DEFAULT,
    };
  } catch (error) {
    console.error(
      "obtenerConfiguracion:",
      error
    );

    return {
      success: false,
      data:
        CONFIG_DEFAULT,

      error:
        "No se pudo cargar la configuración.",
    };
  }
}

// =============================================================================
// GUARDAR CONFIGURACIÓN
// SOLO ADMIN
// =============================================================================

export async function guardarConfiguracion(
  datos: Record<
    string,
    unknown
  >
) {
  try {
    await exigirAdmin();

    const clean = {
      nombreCentro: String(
        datos.nombreCentro ||
          "Academias Proyecto Piña"
      ).trim(),

      tituloSitio: String(
        datos.tituloSitio ||
          "Proyecto Piña"
      ).trim(),

      descripcionSeo:
        String(
          datos.descripcionSeo ||
            ""
        ).trim() ||
        null,

      logoUrl: null,

      whatsapp: String(
        datos.whatsapp ||
          ""
      ).replace(
        /\D/g,
        ""
      ),

      whatsappMensaje:
        String(
          datos.whatsappMensaje ||
            ""
        ).trim() ||
        null,

      telefono:
        String(
          datos.telefono ||
            ""
        ).trim() ||
        null,

      direccion:
        String(
          datos.direccion ||
            ""
        ).trim() ||
        null,

      emailContacto:
        String(
          datos.emailContacto ||
            ""
        ).trim(),

      facebook:
        String(
          datos.facebook ||
            ""
        ).trim() ||
        null,

      instagram:
        String(
          datos.instagram ||
            ""
        ).trim() ||
        null,

      tiktok:
        String(
          datos.tiktok ||
            ""
        ).trim() ||
        null,

      youtube:
        String(
          datos.youtube ||
            ""
        ).trim() ||
        null,

      heroTitulo:
        String(
          datos.heroTitulo ||
            "Prepárate para ingresar"
        ).trim(),

      heroSubtitulo:
        String(
          datos.heroSubtitulo ||
            "Material académico y preparación preuniversitaria"
        ).trim(),

      mostrarVideosInicio:
        Boolean(
          datos.mostrarVideosInicio
        ),

      cantidadVideosInicio:
        Math.max(
          1,
          Math.min(
            12,
            Number(
              datos.cantidadVideosInicio
            ) || 6
          )
        ),
    };

    const data =
      await prisma.configuracionWeb.upsert({
        where: {
          id: "1",
        },

        update:
          clean,

        create: {
          id: "1",
          ...clean,
        },
      });

    revalidatePath(
      "/",
      "layout"
    );

    revalidatePath(
      "/contacto"
    );

    revalidatePath(
      "/cursos"
    );

    revalidatePath(
      "/videos"
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    const permiso =
      mensajeErrorPermisos(
        error
      );

    if (permiso) {
      return {
        success: false,
        error:
          permiso,
      };
    }

    console.error(
      "guardarConfiguracion:",
      error
    );

    return {
      success: false,
      error:
        "No se pudo guardar la configuración.",
    };
  }
}