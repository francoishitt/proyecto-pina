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

  const map =
    `https://maps.google.com/maps?q=${encodeURIComponent(
      direccion
    )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

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

            <div className="space-y-3">
              <div className="h-[320px] rounded-2xl overflow-hidden border relative">
                <span className="absolute z-10 bg-white m-3 p-2 rounded shadow-sm">
                  <MapPin
                    size={16}
                    className="inline mr-1"
                  />

                  {direccion}
                </span>

                <iframe
                  src={map}
                  className="w-full h-full"
                  title="Ubicación Proyecto Piña"
                  loading="lazy"
                />
              </div>

              {configuracion.googleMapsUrl && (
                <div className="flex justify-end">
                  <a
                    href={
                      configuracion.googleMapsUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    <MapPin
                      size={17}
                    />

                    Ver en Google Maps

                    <ExternalLink
                      size={15}
                    />
                  </a>
                </div>
              )}
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