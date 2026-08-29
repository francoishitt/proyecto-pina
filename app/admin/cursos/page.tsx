import { redirect } from "next/navigation";
import { obtenerCursos } from "@/actions/curso.action";
import { obtenerCategorias } from "@/actions/categoria.action";
import { obtenerUsuarioSesion } from "@/lib/auth";
import { CursoConRelaciones } from "./types";
import ClienteCursos from "./components/ClienteCursos";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

interface CategoriaResponse {
  id: string;
  nombre: string;
  subcategorias?: {
    id: string;
    nombre: string;
  }[];
}

export default async function CursosPage() {
  const usuario = await obtenerUsuarioSesion();
  if (!usuario) redirect("/login");

  const [resCursos, resCats] = await Promise.all([
    obtenerCursos(),
    obtenerCategorias(),
  ]);

  const cursos: CursoConRelaciones[] = resCursos.success
    ? resCursos.data ?? []
    : [];

  const categorias = resCats.success
    ? (resCats.data as CategoriaResponse[])?.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        subcategorias: c.subcategorias ?? [],
      })) ?? []
    : [];

  return (
    <ClienteCursos
      cursosIniciales={cursos}
      categorias={categorias}
      puedeEliminar={usuario.rol === "ADMIN"}
    />
  );
}
