export default function About() {
  return (
    <section id="about" className="py-20 bg-milky">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            About the Artist
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-warm-dark">
            Welcome to My Studio
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-100/40 p-8 sm:p-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <p className="text-lg text-warm-dark leading-relaxed">
              Hi! I&apos;m a licensed nail artist based in San Marcos, CA,
              specializing in advanced nail art and cutesy Asian nail art. I&apos;m
              so grateful for the chance to connect with each client through my
              work, and I can&apos;t wait to welcome you into my studio.
            </p>
            <p className="text-warm-gray leading-relaxed">
              Every appointment is a one-on-one experience designed to bring your
              nail vision to life. From clean, glossy gel sets to intricate 3D art
              and cute designs, I focus on the details that make your set uniquely
              yours.
            </p>
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400 font-heading">
                  💅
                </div>
                <p className="text-sm text-warm-gray mt-1">Licensed Artist</p>
              </div>
              <div className="w-px h-10 bg-brand-100" />
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400 font-heading">
                  🎨
                </div>
                <p className="text-sm text-warm-gray mt-1">Nail Art Specialist</p>
              </div>
              <div className="w-px h-10 bg-brand-100" />
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400 font-heading">
                  ✨
                </div>
                <p className="text-sm text-warm-gray mt-1">Personalized Care</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
