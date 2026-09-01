"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ExternalLink,
  MapPin,
} from "lucide-react";

interface Props {
  direccion?:
    | string
    | null;

  googleMapsUrl?:
    | string
    | null;
}

export default function Ubicacion({
  direccion,
  googleMapsUrl,
}: Props) {
  const [
    visible,
    setVisible,
  ] = useState(false);

  const ref =
    useRef<HTMLElement>(
      null
    );

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setVisible(true);

            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
        }
      );

    if (ref.current) {
      observer.observe(
        ref.current
      );
    }

    return () =>
      observer.disconnect();
  }, []);

  const dir =
    direccion ||
    "Iquitos, Loreto, Perú";

  // Conservamos el mapa incrustado existente.
  // Se genera a partir de la dirección y no depende
  // del enlace configurable de Google Maps.
  const src =
    `https://maps.google.com/maps?q=${encodeURIComponent(
      dir
    )}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      ref={ref}
      className="w-full bg-white py-10 md:py-16"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-blue-950 text-center mb-3">
          Visítanos en nuestra{" "}
          <span className="text-yellow-500">
            Sede
          </span>
        </h2>

        <div className="flex items-center justify-center gap-2 text-slate-600 mb-6">
          <MapPin
            size={18}
            className="text-orange-600"
          />

          <span className="text-sm md:text-base">
            {dir}
          </span>
        </div>

        {googleMapsUrl && (
          <div className="flex justify-center mb-7">
            <a
              href={
                googleMapsUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
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

        <div
          className={`max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border bg-slate-100 transition ${
            visible
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <iframe
            src={src}
            className="w-full min-h-[400px]"
            style={{
              border: 0,
            }}
            loading="lazy"
            title="Ubicación Proyecto Piña"
          />
        </div>
      </div>
    </section>
  );
}
