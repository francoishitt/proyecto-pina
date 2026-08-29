import { redirect } from "next/navigation";
import { obtenerUsuarioSesion } from "@/lib/auth";
import { obtenerUsuariosOperativos } from "@/actions/usuario.action";
import ClienteUsuarios from "./components/ClienteUsuarios";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function UsuariosPage() {
  const usuario = await obtenerUsuarioSesion();
  if (!usuario) redirect("/login");
  if (usuario.rol !== "ADMIN") redirect("/admin");

  const res = await obtenerUsuariosOperativos();

  return (
    <ClienteUsuarios
      usuariosIniciales={res.success && res.data ? res.data : []}
    />
  );
}
