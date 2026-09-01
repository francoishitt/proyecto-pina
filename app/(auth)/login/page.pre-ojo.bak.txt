export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error ? decodeURIComponent(params.error) : "";

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col items-center">
          <a href="/" className="mb-4 cursor-pointer">
            <img src="/logo.png" alt="Logo Proyecto Piña" width="130" height="45" className="object-contain" />
          </a>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">¡Hola de nuevo!</h1>
          <p className="text-slate-600 text-sm text-center mb-8 font-medium">
            Ingresa al panel de administración
          </p>

          {error ? (
            <div className="w-full mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <form method="post" action="/api/auth/login" className="w-full space-y-5">
            <div>
              <label htmlFor="correo" className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                Correo electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                required
                autoComplete="username"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-[11px] font-bold text-slate-700 uppercase">
                  Contraseña
                </label>
                <a href="/recuperar" className="text-[11px] font-bold text-blue-950 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-950 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-900 active:scale-[0.98] transition-all shadow-lg"
            >
              Iniciar sesión
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-sm text-slate-600 font-medium">
            Los accesos del personal son creados por el administrador del sistema.
          </p>
        </div>
      </div>
    </main>
  );
}
