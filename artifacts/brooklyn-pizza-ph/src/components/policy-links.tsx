import { Link } from 'wouter';
import { policies } from '@/lib/policies';

export default function PolicyLinks({ stacked = false }: { stacked?: boolean }) {
  const links = [
    ...Object.values(policies),
    { path: '/contact-us', title: 'Contact Us' },
  ];
  return (
    <nav aria-label="Website information">
      <ul className={stacked ? 'grid grid-cols-2 gap-x-6 gap-y-3 text-sm normal-case' : 'flex flex-wrap gap-x-6 gap-y-3 text-sm'}>
        {links.map((policy) => (
          <li key={policy.path} className="flex items-baseline gap-2">
            <span aria-hidden="true">•</span>
            <Link href={policy.path} className="underline-offset-4 hover:underline focus-visible:underline">
              {policy.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
