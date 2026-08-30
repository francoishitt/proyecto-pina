import { redirect } from "next/navigation";

import { obtenerUsuarioSesion } from "@/lib/auth";
import { obtenerEstadoRedes } from "@/actions/social.action";

import RedesClient from "./RedesClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const usuario = await obtenerUsuarioSesion();

  if (!usuario) {
    redirect("/login");
  }

  if (usuario.rol !== "ADMIN") {
    redirect("/admin");
  }

  const resultado =
    await obtenerEstadoRedes();

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://proyectopiña.com"
  ).replace(/\/$/, "");

  return (
    <RedesClient
      estado={
        resultado.data || []
      }
      config={
        resultado.config || {
          tiktok: false,
          instagram: false,
        }
      }
      siteUrl={siteUrl}
    />
  );
}