"use server";

import { prisma } from "@/lib/prisma";
import { exigirGestorEstructura, mensajeErrorPermisos } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type Plataforma = "TIKTOK" | "INSTAGRAM";

async function revocarTikTok(accessToken?: string | null) {
  if (!accessToken) return;
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) return;

  try {
    const body = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      token: accessToken,
    });
    const response = await fetch("https://open.tiktokapis.com/v2/oauth/revoke/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("TikTok revoke error", response.status, await response.text());
    }
  } catch (error) {
    // La desconexión local debe continuar aunque TikTok no responda.
    console.error("TikTok revoke exception", error);
  }
}

async function borrarConexion(plataforma: Plataforma) {
  const conexion = await prisma.conexionSocial.findUnique({ where: { plataforma } });
  if (plataforma === "TIKTOK") await revocarTikTok(conexion?.accessToken);
  await prisma.conexionSocial.deleteMany({ where: { plataforma } });
  revalidatePath("/videos");
  revalidatePath("/admin/videos");
  revalidatePath("/");
}

export async function obtenerEstadoRedes() {
  try {
    await exigirGestorEstructura();
    const data = await prisma.conexionSocial.findMany({
      select: {
        plataforma: true,
        username: true,
        displayName: true,
        profileUrl: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });
    return {
      success: true,
      data,
      config: {
        tiktok: Boolean(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET),
        instagram: Boolean(process.env.INSTAGRAM_APP_ID && process.env.INSTAGRAM_APP_SECRET),
      },
    };
  } catch (error) {
    return { success: false, error: mensajeErrorPermisos(error) || "No se pudo leer las conexiones." };
  }
}

export async function desconectarRed(plataforma: Plataforma) {
  try {
    await exigirGestorEstructura();
    await borrarConexion(plataforma);
    return { success: true };
  } catch (error) {
    return { success: false, error: mensajeErrorPermisos(error) || "No se pudo desconectar." };
  }
}

export async function cambiarRed(plataforma: Plataforma) {
  try {
    await exigirGestorEstructura();
    await borrarConexion(plataforma);
    return {
      success: true,
      url: `/api/social/${plataforma.toLowerCase()}/connect?cambiar=1`,
    };
  } catch (error) {
    return { success: false, error: mensajeErrorPermisos(error) || "No se pudo preparar el cambio de cuenta." };
  }
}
