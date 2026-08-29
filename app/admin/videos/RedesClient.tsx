"use client";

import { useEffect, useState } from "react";
import { cambiarRed, desconectarRed } from "@/actions/social.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MENSAJES: Record<string, string> = {
  state: "La plataforma rechazó la validación de seguridad (state). Intenta conectar nuevamente.",
  tiktok: "TikTok no devolvió un código de autorización.",
  tiktok_token: "TikTok no pudo entregar el token. Revisa Client Key, Client Secret, Redirect URI y scopes.",
  tiktok_config: "Faltan TIKTOK_CLIENT_KEY o TIKTOK_CLIENT_SECRET en Hostinger.",
  instagram: "Instagram no devolvió un código de autorización.",
  instagram_token: "Instagram no pudo entregar el token. Revisa App ID, App Secret y Redirect URI.",
  instagram_config: "Faltan INSTAGRAM_APP_ID o INSTAGRAM_APP_SECRET en Hostinger.",
};

export default function RedesClient({
  estado,
  config,
  siteUrl,
}: {
  estado: any[];
  config: { tiktok: boolean; instagram: boolean };
  siteUrl: string;
}) {
  const router = useRouter();
  const [procesando, setProcesando] = useState<string | null>(null);
  const callbackTikTok = `${siteUrl}/api/social/tiktok/callback`;
  const callbackInstagram = `${siteUrl}/api/social/instagram/callback`;

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const conectado = q.get("conectado");
    const error = q.get("error");
    if (conectado) {
      toast.success(`${conectado === "tiktok" ? "TikTok" : "Instagram"} conectado correctamente.`);
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error) {
      toast.error(MENSAJES[error] || `No se pudo completar la conexión (${error}).`);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const get = (p: string) => estado.find((x) => x.plataforma === p);

  async function desconectar(p: "TIKTOK" | "INSTAGRAM") {
    setProcesando(`disconnect-${p}`);
    const r = await desconectarRed(p);
    if (r.success) {
      toast.success("Cuenta desconectada.");
      router.refresh();
    } else toast.error(r.error);
    setProcesando(null);
  }

  async function cambiar(p: "TIKTOK" | "INSTAGRAM") {
    const nombre = p === "TIKTOK" ? "TikTok" : "Instagram";
    if (!window.confirm(`Se desconectará la cuenta actual de ${nombre} y podrás autorizar otra. ¿Continuar?`)) return;
    setProcesando(`switch-${p}`);
    const r = await cambiarRed(p);
    if (!r.success || !r.url) {
      toast.error(r.error || "No se pudo iniciar el cambio de cuenta.");
      setProcesando(null);
      return;
    }
    window.location.href = r.url;
  }

  const row = (p: "TIKTOK" | "INSTAGRAM", ok: boolean) => {
    const c = get(p);
    const name = p === "TIKTOK" ? "TikTok" : "Instagram";
    const busy = procesando?.endsWith(p);

    return (
      <div className="bg-white border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {c?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover border" />
          ) : null}
          <div>
            <h2 className="font-bold text-lg">{name}</h2>
            <p className="text-sm text-slate-500">
              {c
                ? `Conectado: ${c.displayName || c.username || "cuenta autorizada"}`
                : ok
                  ? "Credenciales detectadas. Ya puedes autorizar una cuenta."
                  : "Faltan credenciales de desarrollador en Hostinger."}
            </p>
            {c && <p className="text-xs text-emerald-700 mt-1">Puedes desconectarla o cambiarla por otra cuenta cuando quieras.</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {c ? (
            <>
              {c.profileUrl && (
                <a href={c.profileUrl} target="_blank" rel="noreferrer" className="border px-4 py-2 rounded-lg">
                  Ver perfil
                </a>
              )}
              <button
                disabled={busy}
                onClick={() => cambiar(p)}
                className="bg-blue-950 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {procesando === `switch-${p}` ? "Cambiando..." : "Cambiar cuenta"}
              </button>
              <button
                disabled={busy}
                onClick={() => desconectar(p)}
                className="border border-red-300 text-red-600 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {procesando === `disconnect-${p}` ? "Desconectando..." : "Desconectar"}
              </button>
            </>
          ) : (
            <a
              aria-disabled={!ok}
              href={ok ? `/api/social/${p.toLowerCase()}/connect` : "#"}
              className={`px-4 py-2 rounded-lg text-white ${ok ? "bg-orange-600 hover:bg-orange-700" : "bg-slate-300 pointer-events-none"}`}
            >
              {ok ? `Conectar ${name}` : `Configurar ${name}`}
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Videos y redes conectadas</h1>
        <p className="text-slate-500">Autoriza una cuenta y la web leerá automáticamente sus videos públicos recientes.</p>
      </div>

      {row("TIKTOK", config.tiktok)}
      {row("INSTAGRAM", config.instagram)}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-950">
        <b>Cambio de cuenta:</b> al usar <b>Cambiar cuenta</b>, Proyecto Piña elimina la autorización guardada y abre nuevamente el inicio de sesión de la red social. En TikTok también se intenta revocar el token anterior. Si TikTok mantiene iniciada la cuenta anterior en el navegador, usa la opción de cambiar de cuenta de TikTok o cierra esa sesión antes de autorizar la nueva.
      </div>

      <div className="bg-slate-50 border rounded-xl p-5 space-y-3 text-sm">
        <h3 className="font-bold text-blue-950">Datos para configurar TikTok Developer</h3>
        <div>
          <span className="font-semibold">Redirect URI (Web):</span>
          <code className="block mt-1 p-2 bg-white border rounded break-all">{callbackTikTok}</code>
        </div>
        <div>
          <span className="font-semibold">Scopes requeridos:</span> <code>user.info.basic</code> y <code>video.list</code>
        </div>
        <div>
          <span className="font-semibold">Productos:</span> Login Kit + Display API / Content Display.
        </div>
        <p className="text-slate-500">La Redirect URI debe copiarse exactamente, con HTTPS y sin parámetros adicionales.</p>
      </div>

      <details className="bg-slate-50 border rounded-xl p-5 text-sm">
        <summary className="font-bold cursor-pointer">Datos para Instagram</summary>
        <div className="mt-3">
          <span className="font-semibold">Redirect URI:</span>
          <code className="block mt-1 p-2 bg-white border rounded break-all">{callbackInstagram}</code>
        </div>
      </details>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <b>Importante:</b> los videos no se copian a Hostinger. Proyecto Piña guarda únicamente la autorización y consulta el contenido público desde cada plataforma.
      </div>
    </div>
  );
}
