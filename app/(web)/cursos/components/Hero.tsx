export default function Hero() {
  return (
    <section
      aria-labelledby="catalogo-cursos-titulo"
      style={{
        background: "linear-gradient(to right, #020617, #172554, #1e3a8a)",
      }}
      className="border-b border-blue-900/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-4.5 text-center">
        <h1
          id="catalogo-cursos-titulo"
          className="text-2xl sm:text-3xl lg:text-[2.35rem] font-bold text-white tracking-tight font-heading leading-tight"
        >
          Catálogo de <span className="text-yellow-500">Cursos</span>
        </h1>

        <p className="mt-1.5 mx-auto max-w-6xl text-[0.95rem] sm:text-sm lg:text-[0.98rem] text-slate-200 font-medium leading-6">
          Explora nuestro material diseñado para asegurar tu ingreso con teoría, práctica y simulacros en un solo lugar.
        </p>
      </div>
    </section>
  );
}
