import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { obtenerUsuarioSesion } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Clock,
  FileCheck2,
  FileClock,
  FolderTree,
  ListTree,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const usuario = await obtenerUsuarioSesion();
  if (!usuario) redirect("/login");

  const esAdmin = usuario.rol === "ADMIN";

  const [totalCursos, publicados, borradores, totalCategorias, totalSubcategorias, totalSupervisores, ultimosCursos] =
    await Promise.all([
      prisma.curso.count(),
      prisma.curso.count({ where: { publicado: true } }),
      prisma.curso.count({ where: { publicado: false } }),
      esAdmin ? prisma.categoria.count() : Promise.resolve(0),
      esAdmin ? prisma.subcategoria.count() : Promise.resolve(0),
      esAdmin ? prisma.usuario.count({ where: { rol: "SUPERVISOR" } }) : Promise.resolve(0),
      prisma.curso.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { categoria: { select: { nombre: true } } },
      }),
    ]);

  const tarjetasBase = [
    {
      label: "Materiales",
      valor: totalCursos,
      icon: BookOpen,
      href: "/admin/cursos",
      texto: "Gestionar materiales",
    },
    {
      label: "Publicados",
      valor: publicados,
      icon: FileCheck2,
      href: "/admin/cursos",
      texto: "Ver materiales",
    },
    {
      label: "Borradores",
      valor: borradores,
      icon: FileClock,
      href: "/admin/cursos",
      texto: "Revisar pendientes",
    },
  ];

  const tarjetasAdmin = [
    {
      label: "Categorías",
      valor: totalCategorias,
      icon: FolderTree,
      href: "/admin/categorias",
      texto: "Administrar categorías",
    },
    {
      label: "Subcategorías",
      valor: totalSubcategorias,
      icon: ListTree,
      href: "/admin/subcategorias",
      texto: "Administrar subcategorías",
    },
    {
      label: "Supervisores",
      valor: totalSupervisores,
      icon: Users,
      href: "/admin/usuarios",
      texto: "Administrar usuarios",
    },
  ];

  const tarjetas = esAdmin ? [...tarjetasBase, ...tarjetasAdmin] : tarjetasBase;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Panel de Control</h1>
        <p className="text-sm text-slate-500 mt-1">
          {esAdmin
            ? "Resumen general y administración de la plataforma."
            : "Gestiona los materiales académicos que se muestran en la web."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tarjetas.map((t) => {
          const Icono = t.icon;
          return (
            <div
              key={t.label}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.label}</p>
                  <h3 className="text-4xl font-semibold text-slate-800 mt-2">{t.valor}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Icono size={24} strokeWidth={2} />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={t.href}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  {t.texto} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" />
            Últimos materiales agregados
          </h2>
          <Link href="/admin/cursos" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Ver todos
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ultimosCursos.length > 0 ? (
                ultimosCursos.map((curso) => (
                  <tr key={curso.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800">{curso.titulo}</td>
                    <td className="px-6 py-4">{curso.categoria?.nombre || "Sin categoría"}</td>
                    <td className="px-6 py-4">
                      {curso.publicado ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                          Borrador
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Aún no hay materiales registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
