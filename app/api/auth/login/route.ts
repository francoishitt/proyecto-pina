import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function volverLogin(request: NextRequest, mensaje: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", mensaje);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const correo = String(formData.get("correo") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!correo || !password) {
      return volverLogin(request, "Completa correo y contraseña.");
    }

    const usuario = await prisma.usuario.findUnique({ where: { email: correo } });
    if (!usuario) {
      return volverLogin(request, "Correo o contraseña incorrectos.");
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return volverLogin(request, "Correo o contraseña incorrectos.");
    }

    if (!usuario.emailVerificado || !["ADMIN", "SUPERVISOR", "EDITOR"].includes(usuario.rol)) {
      return volverLogin(request, "Esta cuenta no tiene acceso al panel administrativo.");
    }

    const response = NextResponse.redirect(new URL("/admin", request.url), 303);
    response.cookies.set("admin_session", usuario.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60,
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error) {
    console.error("Error en POST /api/auth/login:", error);
    return volverLogin(request, "No se pudo iniciar sesión. Intenta nuevamente.");
  }
}
