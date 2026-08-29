"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigirAdmin, mensajeErrorPermisos } from "@/lib/auth";

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(72, "La contraseña es demasiado larga.")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula.")
  .regex(/[a-z]/, "Debe contener al menos una minúscula.")
  .regex(/[0-9]/, "Debe contener al menos un número.")
  .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial.");

const rolOperativoSchema = z.enum(["SUPERVISOR", "EDITOR"]);

const usuarioOperativoSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa el nombre."),
  apellidos: z.string().trim().min(2, "Ingresa los apellidos."),
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido."),
  password: passwordSchema,
  rol: rolOperativoSchema,
});

export async function obtenerUsuariosOperativos() {
  try {
    await exigirAdmin();
    const usuarios = await prisma.usuario.findMany({
      where: { rol: { in: ["SUPERVISOR", "EDITOR"] } },
      orderBy: [{ rol: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
        emailVerificado: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: usuarios.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
    };
  } catch (error: unknown) {
    const permiso = mensajeErrorPermisos(error);
    if (permiso) return { success: false, error: permiso };
    console.error("obtenerUsuariosOperativos:", error);
    return { success: false, error: "No se pudieron cargar los usuarios operativos." };
  }
}

export async function crearUsuarioOperativo(datos: {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  rol: "SUPERVISOR" | "EDITOR";
}) {
  try {
    await exigirAdmin();
    const validado = usuarioOperativoSchema.parse(datos);

    const existente = await prisma.usuario.findUnique({
      where: { email: validado.email },
      select: { id: true },
    });

    if (existente) {
      return { success: false, error: "Ya existe un usuario con ese correo." };
    }

    const password = await bcrypt.hash(validado.password, 10);
    await prisma.usuario.create({
      data: {
        nombre: validado.nombre,
        apellidos: validado.apellidos,
        email: validado.email,
        password,
        rol: validado.rol,
        emailVerificado: true,
        otp: null,
        otpExpires: null,
      },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error: unknown) {
    const permiso = mensajeErrorPermisos(error);
    if (permiso) return { success: false, error: permiso };
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Datos inválidos." };
    }
    console.error("crearUsuarioOperativo:", error);
    return { success: false, error: "No se pudo crear el usuario." };
  }
}


export async function cambiarRolUsuarioOperativo(id: string, rol: "SUPERVISOR" | "EDITOR") {
  try {
    await exigirAdmin();
    const rolValidado = rolOperativoSchema.parse(rol);

    const usuario = await prisma.usuario.findFirst({
      where: { id, rol: { in: ["SUPERVISOR", "EDITOR"] } },
      select: { id: true },
    });
    if (!usuario) {
      return { success: false, error: "Usuario no encontrado." };
    }

    await prisma.usuario.update({
      where: { id },
      data: { rol: rolValidado },
    });

    revalidatePath("/admin/usuarios");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const permiso = mensajeErrorPermisos(error);
    if (permiso) return { success: false, error: permiso };
    if (error instanceof z.ZodError) {
      return { success: false, error: "Rol inválido." };
    }
    console.error("cambiarRolUsuarioOperativo:", error);
    return { success: false, error: "No se pudo cambiar el rol." };
  }
}

export async function cambiarPasswordUsuarioOperativo(id: string, nuevaPassword: string) {
  try {
    await exigirAdmin();
    const passwordValidada = passwordSchema.parse(nuevaPassword);

    const usuario = await prisma.usuario.findFirst({
      where: { id, rol: { in: ["SUPERVISOR", "EDITOR"] } },
      select: { id: true },
    });
    if (!usuario) {
      return { success: false, error: "Usuario no encontrado." };
    }

    const password = await bcrypt.hash(passwordValidada, 10);
    await prisma.usuario.update({
      where: { id },
      data: { password },
    });

    return { success: true };
  } catch (error: unknown) {
    const permiso = mensajeErrorPermisos(error);
    if (permiso) return { success: false, error: permiso };
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Contraseña inválida." };
    }
    console.error("cambiarPasswordUsuarioOperativo:", error);
    return { success: false, error: "No se pudo cambiar la contraseña." };
  }
}

export async function eliminarUsuarioOperativo(id: string) {
  try {
    await exigirAdmin();

    const usuario = await prisma.usuario.findFirst({
      where: { id, rol: { in: ["SUPERVISOR", "EDITOR"] } },
      select: { id: true },
    });
    if (!usuario) {
      return { success: false, error: "Usuario no encontrado." };
    }

    await prisma.usuario.delete({ where: { id } });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error: unknown) {
    const permiso = mensajeErrorPermisos(error);
    if (permiso) return { success: false, error: permiso };
    console.error("eliminarUsuarioOperativo:", error);
    return { success: false, error: "No se pudo eliminar el acceso." };
  }
}
