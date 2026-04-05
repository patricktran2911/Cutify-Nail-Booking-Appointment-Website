import { removalOptions } from "@/lib/services";

export default function RemovalRepair() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            Removal &amp; Repair
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-warm-dark">
            Removal Options
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {removalOptions.map((opt) => (
            <div
              key={opt.id}
              className="bg-white rounded-xl border border-brand-100/40 p-5 text-center"
            >
              <p className="font-heading font-bold text-warm-dark">{opt.name}</p>
              <p className="text-2xl font-bold text-brand-400 mt-2">
                ${opt.price}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-brand-100/40 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🩹</span>
            <div>
              <h3 className="font-heading text-lg font-bold text-warm-dark mb-2">
                Repair Policy
              </h3>
              <p className="text-warm-gray leading-relaxed">
                If your nails lift or come off within <strong>7 days</strong> of
                your appointment, I&apos;ll fix them for free. Every nail bed is
                different, and I completely understand that things happen — I want
                you to love your set the entire time you have it!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
