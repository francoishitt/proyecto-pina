import {
  Clock,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";

import Faq from "./components/Faq";
import Formulario from "./components/Formulario";

import { obtenerConfiguracion } from "@/actions/configuracion.action";

export const dynamic =
  "force-dynamic";

export default async function Page() {
  const configuracion =
    (
      await obtenerConfiguracion()
    ).data;

  const direccion =
    configuracion.direccion ||
    "Iquitos, Loreto, Perú";

  return (
    <main className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-3">
          ¿Tienes dudas? Estamos aquí para ayudarte
        </h1>

        <div className="grid lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-7 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border">
                <Clock />

                <h3 className="font-bold mt-3">
                  Horario de Atención
                </h3>

                <p>
                  Lun - Sáb: 8:00 AM - 6:00 PM
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border">
                <Phone />

                <h3 className="font-bold mt-3">
                  Contacto
                </h3>

                <p>
                  {configuracion.telefono ||
                    configuracion.whatsapp}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <MapPin
                    size={24}
                    className="text-orange-600"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-blue-950 mb-2">
                    Nuestra ubicación
                  </h3>

                  <p className="text-slate-600 mb-5">
                    {direccion}
                  </p>

                  {configuracion.googleMapsUrl && (
                    <a
                      href={
                        configuracion.googleMapsUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                    >
                      <MapPin size={17} />

                      Ver en Google Maps

                      <ExternalLink
                        size={15}
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Formulario
              whatsapp={
                configuracion.whatsapp
              }
              email={
                configuracion.emailContacto
              }
            />
          </div>
        </div>

        <div className="mt-20">
          <Faq />
        </div>
      </div>
    </main>
  );
}