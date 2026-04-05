export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-milky">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            Get in Touch
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-warm-dark">
            Contact &amp; Social
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <a
            href="https://www.instagram.com/cutify_nails"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-brand-100/40 p-6 text-center hover:shadow-md hover:border-brand-200/60 transition-all group"
          >
            <div className="text-3xl mb-3">📸</div>
            <h3 className="font-heading font-bold text-warm-dark group-hover:text-brand-400 transition-colors">
              Instagram
            </h3>
            <p className="text-brand-400 text-sm mt-1">@cutify_nails</p>
          </a>

          <a
            href="tel:9169184493"
            className="bg-white rounded-2xl border border-brand-100/40 p-6 text-center hover:shadow-md hover:border-brand-200/60 transition-all group"
          >
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-heading font-bold text-warm-dark group-hover:text-brand-400 transition-colors">
              Text / Call
            </h3>
            <p className="text-brand-400 text-sm mt-1">(916) 918-4493</p>
          </a>

          <div className="bg-white rounded-2xl border border-brand-100/40 p-6 text-center">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-heading font-bold text-warm-dark">Location</h3>
            <p className="text-warm-gray text-sm mt-1">San Marcos, CA</p>
          </div>
        </div>
      </div>
    </section>
  );
}
