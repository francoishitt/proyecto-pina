export default function Hero() {
  return (
    <section
      aria-labelledby="catalogo-cursos-titulo"
      style={{
        background: "linear-gradient(to right, #020617, #172554, #1e3a8a)",
      }}
      className="border-b border-blue-900/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 text-center">
        <h1
          id="catalogo-cursos-titulo"
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-heading leading-tight"
        >
          Catálogo de <span className="text-yellow-500">Cursos</span>
        </h1>

        <p className="mt-1 mx-auto max-w-5xl text-[0.78rem] sm:text-xs lg:text-sm text-slate-200 font-medium leading-5">
          Explora teoría, práctica y simulacros en un solo lugar.
        </p>
      </div>
    </section>
  );
}
