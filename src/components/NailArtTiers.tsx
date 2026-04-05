import { artTiers } from "@/lib/services";

const tierColors = [
  "bg-brand-50 border-brand-100",
  "bg-white border-brand-200",
  "bg-linear-to-br from-brand-50 to-cream border-brand-300",
];

export default function NailArtTiers() {
  return (
    <section id="nail-art" className="py-20 bg-milky">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            Nail Art
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-warm-dark">
            Art Tier Add-Ons
          </h2>
          <p className="mt-3 text-warm-gray max-w-lg mx-auto">
            Pick a tier to add onto your base service. The more intricate the
            design, the higher the tier.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {artTiers.map((tier, idx) => (
            <div
              key={tier.id}
              className={`rounded-2xl border-2 p-6 transition-all hover:shadow-md ${tierColors[idx]}`}
            >
              <div className="text-center mb-5">
                <span className="inline-block px-3 py-0.5 bg-brand-400/10 rounded-full text-xs font-semibold text-brand-400 mb-2">
                  Tier {tier.tier}
                </span>
                <h3 className="font-heading text-xl font-bold text-warm-dark">
                  {tier.name}
                </h3>
                <p className="text-2xl font-bold text-brand-400 mt-1">
                  {tier.priceLabel}
                </p>
              </div>
              <ul className="space-y-2">
                {tier.examples.map((ex, i) => (
                  <li
                    key={i}
                    className="text-sm text-warm-gray flex items-start gap-2"
                  >
                    <span className="text-brand-300 mt-0.5 shrink-0">✦</span>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-warm-gray bg-white inline-block px-5 py-2.5 rounded-full border border-brand-100/40">
            Not sure which tier fits your inspo?{" "}
            <a
              href="https://www.instagram.com/cutify_nails"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 font-semibold hover:underline"
            >
              DM me for an exact quote ✨
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
