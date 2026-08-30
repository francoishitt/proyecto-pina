import {
  ExternalLink,
  MapPin,
} from "lucide-react";

interface Props {
  direccion?: string | null;
  googleMapsUrl?: string | null;
}

export default function Ubicacion({
  direccion,
  googleMapsUrl,
}: Props) {
  const dir =
    direccion ||
    "Iquitos, Loreto, Perú";

  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-blue-950 text-center mb-8">
          Visítanos en nuestra{" "}
          <span className="text-yellow-500">
            Sede
          </span>
        </h2>

        <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-10 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-5">
            <MapPin
              size={28}
              className="text-orange-600"
            />
          </div>

          <h3 className="text-lg font-bold text-blue-950 mb-2">
            Nuestra ubicación
          </h3>

          <p className="text-slate-600 mb-6">
            {dir}
          </p>

          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <MapPin size={18} />

              Ver en Google Maps

              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}