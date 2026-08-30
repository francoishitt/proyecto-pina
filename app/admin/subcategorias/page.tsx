import { redirect } from "next/navigation";

import { obtenerUsuarioSesion } from "@/lib/auth";

import { obtenerSubcategorias } from "@/actions/subcategoria.action";
import { obtenerCategorias } from "@/actions/categoria.action";

import {
  SubcategoriaConRelaciones,
  CategoriaOption,
} from "./types";

import ClienteSubcategorias from "./components/ClienteSubcategorias";

export const dynamic =
  "force-dynamic";

export const fetchCache =
  "force-no-store";

export const revalidate =
  0;

export default async function SubcategoriasPage() {
  const usuario =
    await obtenerUsuarioSesion();

  if (!usuario) {
    redirect("/login");
  }

  // =========================================================
  // SOLO ADMIN
  //
  // SUPERVISOR:
  // - no crea subcategorías
  // - no edita subcategorías
  // - no elimina subcategorías
  //
  // EDITOR:
  // - tampoco administra estructura
  // =========================================================

  if (
    usuario.rol !==
    "ADMIN"
  ) {
    redirect("/admin");
  }

  const [
    resSub,
    resCat,
  ] = await Promise.all([
    obtenerSubcategorias(),
    obtenerCategorias(),
  ]);

  const subcategorias: SubcategoriaConRelaciones[] =
    resSub.success
      ? resSub.data ??
        []
      : [];

  const categorias: CategoriaOption[] =
    resCat.success
      ? resCat.data?.map(
          (
            categoria
          ) => ({
            id:
              categoria.id,

            nombre:
              categoria.nombre,
          })
        ) ?? []
      : [];

  return (
    <ClienteSubcategorias
      subcategoriasIniciales={
        subcategorias
      }
      categorias={
        categorias
      }
    />
  );
}