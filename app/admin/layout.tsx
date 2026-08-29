import { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";
import { obtenerUsuarioSesion } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const usuario = await obtenerUsuarioSesion();

  if (!usuario) {
    redirect("/login");
  }

  return (
    <AdminClientLayout
      usuarioInicial={{
        nombre: usuario.nombre || "",
        apellidos: usuario.apellidos || "",
        email: usuario.email,
        rol: usuario.rol,
      }}
    >
      {children}
    </AdminClientLayout>
  );
}
