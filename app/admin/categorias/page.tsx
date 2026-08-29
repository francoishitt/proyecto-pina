import { redirect } from "next/navigation";
import { obtenerUsuarioSesion } from "@/lib/auth";
import { obtenerCategorias } from "@/actions/categoria.action";
import { CategoriaConRelaciones } from "./types";
import ClienteCategorias from "./components/ClienteCategorias";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function CategoriasPage() {
  const usuario = await obtenerUsuarioSesion();
  if (!usuario) redirect("/login");
  if (!["ADMIN", "SUPERVISOR"].includes(usuario.rol)) redirect("/admin");

  const res = await obtenerCategorias();
  const categorias: CategoriaConRelaciones[] = res.success ? res.data ?? [] : [];

  return <ClienteCategorias categoriasIniciales={categorias} />;
}