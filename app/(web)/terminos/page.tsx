import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Servicio | Academias Proyecto Piña",
  description: "Términos de Servicio aplicables al sitio web y servicios digitales de Academias Proyecto Piña.",
};

const actualizado = "1 de septiembre de 2026";

export default function TerminosPage() {
  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Información legal</p>
          <h1 className="mt-2 text-3xl font-bold text-blue-950 md:text-4xl">Términos de Servicio</h1>
          <p className="mt-3 text-sm text-slate-500">Última actualización: {actualizado}</p>

          <div className="mt-8 space-y-8 text-[15px] leading-7 text-slate-700">
            <section>
              <h2 className="text-xl font-bold text-blue-950">1. Alcance y aceptación</h2>
              <p className="mt-2">Estos Términos regulan el acceso y uso del sitio web, materiales, funciones administrativas, integraciones sociales y demás servicios digitales ofrecidos por Academias Proyecto Piña ("Proyecto Piña"). Al utilizar el sitio, aceptas estos Términos. Si no estás de acuerdo, debes dejar de utilizar el servicio.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">2. Finalidad del servicio</h2>
              <p className="mt-2">Proyecto Piña ofrece información institucional, materiales académicos, recursos educativos, contenidos audiovisuales y herramientas de gestión relacionadas con la preparación preuniversitaria, pre policial y otras actividades formativas.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">3. Uso permitido</h2>
              <p className="mt-2">El usuario se compromete a utilizar el sitio de forma lícita y responsable. No está permitido interferir con el funcionamiento del servicio, intentar acceder sin autorización a cuentas o sistemas, introducir código malicioso, suplantar identidades, realizar extracción abusiva de datos ni utilizar el contenido para actividades que vulneren derechos de terceros o la legislación aplicable.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">4. Cuentas administrativas</h2>
              <p className="mt-2">Las credenciales administrativas son personales y deben mantenerse confidenciales. Los usuarios autorizados son responsables de las acciones realizadas desde sus cuentas y deben comunicar cualquier acceso no autorizado que detecten.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">5. Materiales y propiedad intelectual</h2>
              <p className="mt-2">Salvo indicación distinta, la estructura del sitio, identidad gráfica, textos propios, material educativo elaborado por Proyecto Piña y demás contenidos originales se encuentran protegidos por las normas aplicables de propiedad intelectual. La disponibilidad de un material para lectura o descarga no implica cesión de titularidad ni autorización para su reventa, redistribución masiva o explotación comercial no autorizada.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">6. Servicios e integraciones de terceros</h2>
              <p className="mt-2">El sitio puede enlazar o integrarse con servicios de terceros, incluidos TikTok, Instagram, Google Maps y proveedores de infraestructura. El uso de dichos servicios también puede estar sujeto a sus propios términos y políticas. Proyecto Piña no controla la disponibilidad, cambios o decisiones operativas de esas plataformas.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">7. Conexión con TikTok y otras redes</h2>
              <p className="mt-2">Cuando un administrador autorizado conecta una cuenta social, Proyecto Piña utiliza únicamente los permisos y datos autorizados durante el proceso de autenticación para habilitar las funciones solicitadas, como identificar la cuenta conectada y consultar o mostrar contenido social permitido por la plataforma. La conexión puede ser retirada desde las herramientas disponibles en Proyecto Piña o desde la plataforma externa correspondiente.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">8. Disponibilidad y cambios</h2>
              <p className="mt-2">Proyecto Piña procura mantener el servicio disponible y actualizado, pero no garantiza funcionamiento ininterrumpido. Pueden realizarse tareas de mantenimiento, correcciones, mejoras, modificaciones o retiros de funcionalidades cuando resulte necesario.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">9. Limitación de responsabilidad</h2>
              <p className="mt-2">Los materiales educativos son recursos de apoyo y no constituyen garantía de ingreso, aprobación o resultado académico específico. En la medida permitida por la ley, Proyecto Piña no será responsable por interrupciones atribuibles a terceros, fallas de conectividad, decisiones de plataformas externas o usos del servicio contrarios a estos Términos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">10. Privacidad</h2>
              <p className="mt-2">El tratamiento de datos personales se describe en nuestra <Link href="/privacidad" className="font-semibold text-orange-600 underline underline-offset-4">Política de Privacidad</Link>, que forma parte complementaria de estos Términos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">11. Modificaciones de estos Términos</h2>
              <p className="mt-2">Podemos actualizar estos Términos para reflejar cambios legales, técnicos u operativos. La fecha de última actualización se mostrará al inicio de esta página. El uso continuado del servicio después de una actualización implica la aceptación de los términos vigentes.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">12. Legislación aplicable y contacto</h2>
              <p className="mt-2">Estos Términos se interpretan conforme a la legislación de la República del Perú. Para consultas relacionadas con estas condiciones, puedes utilizar los datos publicados en la sección <Link href="/contacto" className="font-semibold text-orange-600 underline underline-offset-4">Contacto</Link> del sitio.</p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
