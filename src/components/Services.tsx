import { services } from "@/lib/services";

export default function Services() {
  return (
    <section id="services" className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            Services
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-warm-dark">
            Base Services
          </h2>
          <p className="mt-3 text-warm-gray max-w-lg mx-auto">
            Choose your base service first, then add a nail art tier depending on
            how simple or detailed you want your set to be.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-sm border border-brand-100/40 p-6 hover:shadow-md hover:border-brand-200/60 transition-all group"
            >
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-warm-dark group-hover:text-brand-400 transition-colors leading-snug">
                  {service.name}
                </h3>
              </div>
              <div className="inline-block px-3 py-1 bg-brand-50 rounded-full mb-4">
                <span className="text-xl font-bold text-brand-400">
                  ${service.price}
                </span>
              </div>
              <ul className="space-y-2">
                {service.description.map((desc, i) => (
                  <li
                    key={i}
                    className="text-sm text-warm-gray flex items-start gap-2"
                  >
                    <span className="text-brand-300 mt-0.5 shrink-0">♡</span>
                    {desc}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-brand-50">
                <p className="text-xs text-warm-light">
                  ~{service.duration} min appointment
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
