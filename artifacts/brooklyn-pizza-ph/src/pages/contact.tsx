import { useEffect } from 'react';
import { Link } from 'wouter';
import PolicyLinks from '@/components/policy-links';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Brooklyn Pizza K-Town Megaworld Boulevard Mandurriao Iloilo City');

export default function ContactPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Contact Us | Brooklyn Pizza';
    const description = 'Contact Brooklyn Pizza at K-Town, Megaworld Boulevard, Mandurriao, Iloilo City. Call 033 338 4417.';
    const updates = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', 'Contact Us | Brooklyn Pizza'],
      ['meta[property="og:description"]', description],
    ] as const;
    const previous = updates.map(([selector, content]) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const value = element?.content;
      if (element) element.content = content;
      return { element, value };
    });
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
      previous.forEach(({ element, value }) => {
        if (element && value !== undefined) element.content = value;
      });
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="flex items-center gap-3 font-display text-2xl uppercase">
            <img src={`${import.meta.env.BASE_URL}brooklyn-logo.png`} alt="" width={48} height={48} />
            Brooklyn Pizza
          </Link>
          <Link href="/" className="text-sm font-semibold underline underline-offset-4">Back to home</Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 md:py-20">
        <h1 className="font-display text-5xl uppercase leading-tight sm:text-6xl">Contact Us</h1>
        <div className="mt-10 space-y-8">
          <section aria-labelledby="contact-address">
            <h2 id="contact-address" className="text-xl font-bold">Visit Brooklyn Pizza</h2>
            <address className="mt-3 not-italic text-base leading-8 text-ink/80">
              Ground Floor, K-Town, Megaworld Boulevard<br />
              Mandurriao, Iloilo City 5000
            </address>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold underline underline-offset-4">
              Get directions
            </a>
          </section>
          <section aria-labelledby="contact-phone">
            <h2 id="contact-phone" className="text-xl font-bold">Call us</h2>
            <a href="tel:+63333384417" className="mt-3 inline-block text-2xl font-semibold text-sauce underline underline-offset-4">
              033 338 4417
            </a>
          </section>
        </div>
      </main>
      <footer className="bg-ink px-5 py-8 text-paper">
        <div className="mx-auto max-w-5xl"><PolicyLinks /></div>
      </footer>
    </div>
  );
}
