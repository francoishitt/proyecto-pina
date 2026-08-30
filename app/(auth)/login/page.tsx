import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { obtenerUsuarioSesion } from "@/lib/auth";
import FormularioLogin from "./components/Formulario";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoginPage() {
  const usuario = await obtenerUsuarioSesion();

  if (usuario) {
    redirect("/admin");
  }

  return (
    <>
      <Toaster
        position="top-center"
        richColors
      />

      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col items-center">
            <a
              href="/"
              className="mb-4 cursor-pointer"
            >
              <img
                src="/logo.png"
                alt="Logo Proyecto Piña"
                width="130"
                height="45"
                className="object-contain"
              />
            </a>

            <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
              ¡Hola de nuevo!
            </h1>

            <p className="text-slate-600 text-sm text-center mb-8 font-medium">
              Ingresa al panel de administración
            </p>

            <div className="w-full">
              <FormularioLogin />
            </div>
          </div>

          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-sm text-slate-600 font-medium">
              Los accesos del personal son creados por el administrador del sistema.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}