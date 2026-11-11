import { useEffect } from 'react';
import { Link } from 'wouter';
import PolicyLinks from '@/components/policy-links';
import { policies, type PolicyId } from '@/lib/policies';

export default function PolicyPage({ policy: policyId }: { policy: PolicyId }) {
  const policy = policies[policyId];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${policy.title} | Brooklyn Pizza`;
    const updates = [
      ['meta[name="description"]', policy.description],
      ['meta[property="og:title"]', `${policy.title} | Brooklyn Pizza`],
      ['meta[property="og:description"]', policy.description],
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
  }, [policy]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="flex items-center gap-3 font-display text-2xl uppercase">
            <img src={`${import.meta.env.BASE_URL}brooklyn-logo.png`} alt="" width={48} height={48} />
            Brooklyn Pizza
          </Link>
          <Link href="/" className="text-sm font-semibold underline underline-offset-4">
            Back to home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        <h1 className="font-display text-5xl uppercase leading-tight sm:text-6xl">{policy.title}</h1>
        <div className="mt-10 space-y-8">
          {policy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="mt-3 text-base leading-8 text-ink/80">{section.text}</p>
            </section>
          ))}
        </div>
      </main>
      <footer className="bg-ink px-5 py-8 text-paper">
        <div className="mx-auto max-w-5xl">
          <PolicyLinks />
        </div>
      </footer>
    </div>
  );
}
