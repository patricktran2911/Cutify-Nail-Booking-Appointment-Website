export default function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-28 pb-20 md:pt-40 md:pb-32 bg-linear-to-b from-blush via-brand-50 to-milky overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-brand-200/40">
          <span className="text-sm font-medium text-brand-400">
            ✨ San Marcos, CA
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-warm-dark leading-tight">
          Cutesy Nail Art,{" "}
          <span className="text-brand-400">Made With Love</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
          Licensed nail artist specializing in advanced nail art and cutesy
          Asian nail art. Glossy sets, detailed art, and a welcoming one-on-one
          appointment vibe.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#booking"
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-400 text-white font-semibold rounded-full hover:bg-brand-300 transition-all shadow-lg shadow-brand-400/25 text-center"
          >
            Book an Appointment
          </a>
          <a
            href="#services"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand-400 font-semibold rounded-full border-2 border-brand-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-center"
          >
            View Services &amp; Pricing
          </a>
        </div>

        <p className="mt-8 text-sm text-warm-light">
          🎀 Complimentary drink for first-time clients
        </p>
      </div>
    </section>
  );
}
