export default function Hero() {
  return (
    <section
      aria-labelledby="catalogo-cursos-titulo"
      style={{
        background: "linear-gradient(to right, #020617, #172554, #1e3a8a)",
      }}
      className="border-b border-blue-900/30"
    >
      {/*
        Cabecera compacta para una página interna.
        La portada principal conserva su hero grande; aquí priorizamos
        que el catálogo, los filtros y los cursos aparezcan antes en pantalla.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7 text-center">
        <h1
          id="catalogo-cursos-titulo"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-heading leading-tight"
        >
          Catálogo de <span className="text-yellow-500">Cursos</span>
        </h1>

        <p className="mt-2 sm:mt-2.5 mx-auto max-w-5xl text-xs sm:text-sm lg:text-base text-slate-200 font-medium leading-5 sm:leading-6">
          Explora nuestro material diseñado estratégicamente para asegurar tu ingreso. Teoría, práctica y simulacros tipo examen de admisión en un solo lugar.
        </p>
      </div>
    </section>
  );
}
