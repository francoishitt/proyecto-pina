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

const supervisorSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa el nombre."),
  apellidos: z.string().trim().min(2, "Ingresa los apellidos."),
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido."),
  password: passwordSchema,
});

export async function obtenerSupervisores() {
  try {
    await exigirAdmin();
    const usuarios = await prisma.usuario.findMany({
      where: { rol: "SUPERVISOR" },
      orderBy: { createdAt: "desc" },
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
    console.error("obtenerSupervisores:", error);
    return { success: false, error: "No se pudieron cargar los supervisores." };
  }
}

export async function crearSupervisor(datos: {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}) {
  try {
    await exigirAdmin();
    const validado = supervisorSchema.parse(datos);

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
        rol: "SUPERVISOR",
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
    console.error("crearSupervisor:", error);
    return { success: false, error: "No se pudo crear el supervisor." };
  }
}

export async function cambiarPasswordSupervisor(id: string, nuevaPassword: string) {
  try {
    await exigirAdmin();
    const passwordValidada = passwordSchema.parse(nuevaPassword);

    const supervisor = await prisma.usuario.findFirst({
      where: { id, rol: "SUPERVISOR" },
      select: { id: true },
    });
    if (!supervisor) {
      return { success: false, error: "Supervisor no encontrado." };
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
    console.error("cambiarPasswordSupervisor:", error);
    return { success: false, error: "No se pudo cambiar la contraseña." };
  }
}

export async function eliminarSupervisor(id: string) {
  try {
    await exigirAdmin();

    const supervisor = await prisma.usuario.findFirst({
      where: { id, rol: "SUPERVISOR" },
      select: { id: true },
    });
    if (!supervisor) {
      return { success: false, error: "Supervisor no encontrado." };
    }

    await prisma.usuario.delete({ where: { id } });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error: unknown) {
    const permiso = mensajeErrorPermisos(error);
    if (permiso) return { success: false, error: permiso };
    console.error("eliminarSupervisor:", error);
    return { success: false, error: "No se pudo eliminar el supervisor." };
  }
}
