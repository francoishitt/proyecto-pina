import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { obtenerCategorias } from "@/actions/categoria.action";
import { obtenerConfiguracion } from "@/actions/configuracion.action";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function WebLayout({ children }: { children: React.ReactNode }) {
  const [cats, cfg] = await Promise.all([obtenerCategorias(), obtenerConfiguracion()]);
  const categorias = (cats.success && cats.data ? cats.data : [])
    .filter((c: any) => c.visible)
    .map((c: any) => ({
      id: c.id,
      nombre: c.nombre,
      subcategorias: (c.subcategorias || []).filter((s: any) => s.visible),
    }));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar categorias={categorias} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer config={cfg.data} />
    </div>
  );
}
