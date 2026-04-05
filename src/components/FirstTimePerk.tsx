export default function FirstTimePerk() {
  return (
    <section className="py-10 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-r from-brand-400 to-brand-300 rounded-2xl p-6 sm:p-8 text-center text-white shadow-lg shadow-brand-400/20">
          <span className="text-3xl mb-3 block">🧋</span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">
            Complimentary Drink With Every Appointment
          </h3>
          <p className="text-white/90 max-w-md mx-auto">
            Choose from coffee, matcha, milk tea, cloud tea, or refreshing fruity
            drinks — pick your favorite when you book!
          </p>
        </div>
      </div>
    </section>
  );
}
