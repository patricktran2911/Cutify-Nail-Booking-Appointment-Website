export default function Footer() {
  return (
    <footer className="py-8 bg-warm-dark text-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="font-heading text-lg font-bold text-brand-300 mb-2">
          Cutify Nails
        </p>
        <p className="text-sm text-warm-light">
          San Marcos, CA &middot;{" "}
          <a
            href="https://www.instagram.com/cutify_nails"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-300 hover:underline"
          >
            @cutify_nails
          </a>
        </p>
        <p className="text-xs text-warm-light/50 mt-4">
          &copy; {new Date().getFullYear()} Cutify Nails. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
