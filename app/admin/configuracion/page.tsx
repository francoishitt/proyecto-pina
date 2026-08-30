import { redirect } from "next/navigation";

import { obtenerUsuarioSesion } from "@/lib/auth";
import { obtenerConfiguracion } from "@/actions/configuracion.action";

import ConfigForm from "./ConfigForm";

export const dynamic = "force-dynamic";

export default async function Page() {
  const usuario = await obtenerUsuarioSesion();

  if (!usuario) {
    redirect("/login");
  }

  if (usuario.rol !== "ADMIN") {
    redirect("/admin");
  }

  const resultado = await obtenerConfiguracion();

  return (
    <ConfigForm
      inicial={resultado.data}
    />
  );
}