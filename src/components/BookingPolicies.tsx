export default function BookingPolicies() {
  return (
    <section id="policies" className="py-20 bg-milky">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            Before You Book
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-warm-dark">
            Booking Policies
          </h2>
        </div>

        <div className="space-y-6">
          {/* Deposit Policy */}
          <div className="bg-white rounded-2xl border border-brand-100/40 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">💳</span>
              <div>
                <h3 className="font-heading text-lg font-bold text-warm-dark mb-3">
                  Deposit Policy
                </h3>
                <ul className="space-y-2 text-warm-gray">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    A <strong className="text-warm-dark">$15 deposit</strong> is
                    required to secure your appointment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    Deposit must be sent within{" "}
                    <strong className="text-warm-dark">20 minutes</strong> of
                    booking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    Pay online via PayPal / Apple Pay, or manually through Zelle or
                    Venmo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    Deposit is applied toward your final total
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-brand-50 rounded-xl text-sm text-warm-gray">
                  <p className="font-semibold text-warm-dark mb-1">
                    Manual deposit options:
                  </p>
                  <p>
                    Zelle: <strong>(916) 918-4493</strong> — Ngan Nguyen
                  </p>
                  <p>
                    Venmo: <strong>@joziecozie</strong>
                  </p>
                  <p className="mt-1 text-xs">
                    Send a screenshot to{" "}
                    <a
                      href="https://www.instagram.com/cutify_nails"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-400 hover:underline"
                    >
                      @cutify_nails
                    </a>{" "}
                    or text (916) 918-4493
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nail Prep */}
          <div className="bg-white rounded-2xl border border-brand-100/40 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">💅</span>
              <div>
                <h3 className="font-heading text-lg font-bold text-warm-dark mb-3">
                  Nail Prep
                </h3>
                <ul className="space-y-2 text-warm-gray">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    New clients should arrive with{" "}
                    <strong className="text-warm-dark">bare nails</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    Acrylic is not removed — appointments are not done over acrylic
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    If product is already on your nails, an additional removal fee
                    may apply
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cancellation */}
          <div className="bg-white rounded-2xl border border-brand-100/40 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">📋</span>
              <div>
                <h3 className="font-heading text-lg font-bold text-warm-dark mb-3">
                  Cancellation &amp; Lateness
                </h3>
                <ul className="space-y-2 text-warm-gray">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    <strong className="text-warm-dark">24-hour notice</strong>{" "}
                    required to cancel or reschedule for a deposit refund
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    15+ minutes late may be treated as a no-show
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-300 mt-0.5">♡</span>
                    Feeling sick? Please reschedule — your health comes first!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
