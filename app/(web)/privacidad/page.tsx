import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | Academias Proyecto Piña",
  description: "Política de Privacidad de Academias Proyecto Piña y sus integraciones digitales.",
};

const actualizado = "1 de septiembre de 2026";

export default function PrivacidadPage() {
  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Información legal</p>
          <h1 className="mt-2 text-3xl font-bold text-blue-950 md:text-4xl">Política de Privacidad</h1>
          <p className="mt-3 text-sm text-slate-500">Última actualización: {actualizado}</p>

          <div className="mt-8 space-y-8 text-[15px] leading-7 text-slate-700">
            <section>
              <h2 className="text-xl font-bold text-blue-950">1. Responsable y alcance</h2>
              <p className="mt-2">Esta Política explica cómo Academias Proyecto Piña ("Proyecto Piña") trata datos personales y datos asociados a cuentas externas cuando una persona utiliza nuestro sitio web o cuando un administrador autorizado conecta servicios de terceros.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">2. Datos que podemos tratar</h2>
              <p className="mt-2">Dependiendo de la función utilizada, podemos tratar datos de contacto proporcionados voluntariamente, información de cuentas administrativas, registros técnicos necesarios para seguridad y funcionamiento, y datos recibidos mediante integraciones externas cuando el titular o administrador autoriza expresamente dicha conexión.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">3. Datos procedentes de TikTok</h2>
              <p className="mt-2">Cuando un administrador autorizado conecta TikTok mediante su flujo oficial de autorización, Proyecto Piña puede recibir y tratar únicamente la información permitida por los permisos aprobados y concedidos por esa cuenta. Esto puede incluir identificadores necesarios para reconocer la cuenta conectada, información básica de perfil autorizada, credenciales o tokens técnicos de acceso y metadatos de contenido necesarios para consultar o mostrar videos dentro de las funciones habilitadas.</p>
              <p className="mt-2">Proyecto Piña no solicita la contraseña de TikTok. La autorización ocurre directamente mediante los mecanismos de TikTok y puede ser revocada por el titular de la cuenta.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">4. Finalidades del tratamiento</h2>
              <p className="mt-2">Utilizamos los datos para operar el sitio, autenticar usuarios autorizados, proteger el acceso administrativo, responder consultas, administrar materiales académicos, conectar cuentas sociales, identificar qué cuenta se encuentra vinculada, recuperar contenido autorizado para su visualización, mantener la seguridad, diagnosticar errores y cumplir obligaciones legales.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">5. Base del tratamiento y control del usuario</h2>
              <p className="mt-2">Tratamos información cuando es necesaria para prestar una función solicitada, cuando existe autorización o consentimiento aplicable, por motivos legítimos de seguridad y operación, o cuando una obligación legal lo requiere. Una integración social puede desconectarse cuando deje de ser necesaria y el acceso también puede revocarse desde la plataforma externa.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">6. Compartición de datos</h2>
              <p className="mt-2">Proyecto Piña no vende datos personales. La información puede ser procesada por proveedores tecnológicos indispensables para operar el servicio, como infraestructura de alojamiento, base de datos, almacenamiento, correo o plataformas sociales, siempre en la medida necesaria para la función correspondiente. También podremos comunicar información cuando exista obligación legal válida.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">7. Almacenamiento y seguridad</h2>
              <p className="mt-2">Aplicamos medidas razonables para limitar el acceso a los datos y proteger las credenciales técnicas. Los archivos académicos pueden almacenarse mediante infraestructura externa y las credenciales sensibles de integraciones se mantienen fuera del código público. Ningún sistema conectado a Internet puede garantizar seguridad absoluta, por lo que las medidas se revisan y actualizan conforme evoluciona el servicio.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">8. Conservación</h2>
              <p className="mt-2">Conservamos los datos durante el tiempo necesario para prestar la función correspondiente, mantener la seguridad, resolver incidencias o cumplir obligaciones legales. Cuando una cuenta social se desconecta, Proyecto Piña deja de utilizar esa conexión para nuevas consultas y elimina o invalida las credenciales de acceso bajo su control cuando corresponda.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">9. Derechos de las personas</h2>
              <p className="mt-2">De acuerdo con la legislación aplicable, las personas pueden solicitar información sobre sus datos y, cuando corresponda, acceso, actualización, rectificación, cancelación, oposición o revocación del consentimiento. Las solicitudes pueden enviarse utilizando los datos disponibles en la sección <Link href="/contacto" className="font-semibold text-orange-600 underline underline-offset-4">Contacto</Link>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">10. Servicios de terceros</h2>
              <p className="mt-2">El sitio puede contener enlaces o integraciones con TikTok, Instagram, Google Maps u otros proveedores. Cada tercero administra sus propias prácticas de privacidad. Recomendamos revisar sus políticas antes de autorizar una conexión o utilizar sus servicios.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">11. Menores de edad</h2>
              <p className="mt-2">Los servicios educativos pueden ser consultados por estudiantes menores de edad. Proyecto Piña no busca recopilar deliberadamente más datos personales de menores de los necesarios para una función específica. Cuando la normativa requiera autorización del padre, madre o representante, deberá obtenerse antes del tratamiento correspondiente.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">12. Cambios a esta Política</h2>
              <p className="mt-2">Podemos actualizar esta Política por cambios en el servicio, integraciones, medidas de seguridad o requisitos legales. La versión vigente estará publicada en esta misma dirección con su fecha de actualización.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-950">13. Contacto</h2>
              <p className="mt-2">Para consultas sobre privacidad o solicitudes relacionadas con datos personales, utiliza los canales oficiales publicados en <Link href="/contacto" className="font-semibold text-orange-600 underline underline-offset-4">proyectopina.com/contacto</Link>.</p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
