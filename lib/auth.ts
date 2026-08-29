import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ROLES_PANEL = ["ADMIN", "SUPERVISOR"] as const;
export type RolPanel = (typeof ROLES_PANEL)[number];

export interface UsuarioSesion {
  id: string;
  email: string;
  nombre: string | null;
  apellidos: string | null;
  rol: string;
}

export async function obtenerUsuarioSesion(): Promise<UsuarioSesion | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) return null;

  const usuario = await prisma.usuario.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      email: true,
      nombre: true,
      apellidos: true,
      rol: true,
    },
  });

  if (!usuario || !ROLES_PANEL.includes(usuario.rol as RolPanel)) {
    return null;
  }

  return usuario;
}

export async function exigirUsuarioPanel() {
  const usuario = await obtenerUsuarioSesion();
  if (!usuario) {
    throw new Error("NO_AUTORIZADO");
  }
  return usuario;
}

export async function exigirAdmin() {
  const usuario = await exigirUsuarioPanel();
  if (usuario.rol !== "ADMIN") {
    throw new Error("SOLO_ADMIN");
  }
  return usuario;
}

export function mensajeErrorPermisos(error: unknown) {
  if (error instanceof Error && error.message === "NO_AUTORIZADO") {
    return "No autorizado. Inicia sesión nuevamente.";
  }
  if (error instanceof Error && error.message === "SOLO_ADMIN") {
    return "Esta operación está reservada al administrador del sistema.";
  }
  return null;
}
