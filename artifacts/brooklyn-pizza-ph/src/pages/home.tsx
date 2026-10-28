import { useEffect, useState } from 'react';
import { MotionConfig, motion, useScroll, useTransform } from 'framer-motion';
import { Phone, MapPin, Clock, Menu as MenuIcon, X, ArrowUpRight, ArrowDown } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;
const img = (p: string) => `${BASE}images/${p}`;
const LOGO = `${BASE}brooklyn-logo.png`;
const TEL = 'tel:+639303115882';
const PHONE = '0930-311-5882';
const ORDER_URL = 'https://utak.io/store/brooklyn_pizza';
const MAPS =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Brooklyn Pizza K-Town Megaworld Boulevard Mandurriao Iloilo City');

const NAV = [
  { id: 'menu', label: 'The Pies' },
  { id: 'fold', label: 'The Fold' },
  { id: 'more', label: 'Pasta + Wings' },
  { id: 'hours', label: 'Late Hours' },
  { id: 'visit', label: 'Find Us' },
];

const PIES = [
  { id: 'cheese', name: 'Cheese', tag: 'The benchmark', note: 'Where every New York slice shop is judged. Sauce, cheese, crust. Nothing to hide behind.' },
  { id: 'classic', name: 'Classic', tag: 'The regular', note: 'The one the counter crew probably knows you by after your third visit.' },
  { id: 'meat-lovers', name: 'Meat Lovers', tag: 'Go big', note: 'For the nights when a salad was never really on the table.' },
  { id: 'brooklyn-supreme', name: 'Brooklyn Supreme', tag: 'House name on it', note: 'The pie that carries the borough. Ask the crew what goes on it today.' },
  { id: 'white-garlic', name: 'White Garlic', tag: 'No red sauce', note: 'A white pie for garlic people. You know who you are.' },
  { id: 'all-meats', name: 'All Meats', tag: 'Maximum', note: 'Named honestly. Bring someone to split it with, or don\u2019t.' },
];

function useManilaOpen() {
  const calc = () => {
    const h = Number(
      new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Manila' }).format(new Date()),
    ) % 24;
    const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Manila' }).format(new Date());
    return { open: !(h >= 4 && h < 10), time };
  };
  const [s, setS] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setS(calc()), 30000);
    return () => clearInterval(t);
  }, []);
  return s;
}

function OrderButton({ testId, className = '', label = 'Order online' }: { testId: string; className?: string; label?: string }) {
  return (
    <a
      href={ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      aria-label={`${label} with Utak, opens in a new tab`}
      className={`press hard-shadow inline-flex items-center gap-3 rounded-full border-[3px] border-ink bg-sauce px-6 py-3.5 font-display text-xl uppercase text-paper ${className}`}
    >
      <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
      <span>{label}</span>
    </a>
  );
}

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
} as const;

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${scrolled ? 'border-b-[3px] border-ink bg-paper/95 backdrop-blur' : 'border-b-[3px] border-transparent'}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <a href="#top" data-testid="link-logo" className="flex items-center gap-2" aria-label="Brooklyn Pizza PH home">
          <img
            src={LOGO}
            alt=""
            aria-hidden="true"
            width={64}
            height={64}
            data-testid="img-logo-header"
            className="h-12 w-12 shrink-0 object-contain mix-blend-multiply"
          />
          <span className="whitespace-nowrap font-display text-xl uppercase leading-none text-ink sm:text-2xl">
            Brooklyn<span className="text-sauce"> Pizza</span> <span className="font-mono text-[9px] align-top sm:text-xs">PH</span>
          </span>
        </a>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 font-mono text-xs font-bold uppercase tracking-wider">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} data-testid={`link-nav-${n.id}`} className="underline-offset-4 hover:text-sauce hover:underline">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={TEL} data-testid="link-header-phone" aria-label={`Call Brooklyn Pizza at ${PHONE}`} className="hidden items-center gap-2 rounded-full px-3 py-2 font-mono text-xs font-bold text-ink transition-colors hover:text-sauce sm:inline-flex">
            <Phone className="h-4 w-4" aria-hidden /> {PHONE}
          </a>
          <OrderButton testId="button-header-order" label="Order" className="!px-4 !py-2 !text-base" />
          <button
            type="button"
            data-testid="button-mobile-menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-ink bg-paper lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t-[3px] border-ink bg-mustard lg:hidden">
          <ul className="px-4 py-4">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-testid={`link-mobile-nav-${n.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b-2 border-ink/20 py-3 font-display text-3xl uppercase text-ink"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 800], [0, 50]);
  const status = useManilaOpen();
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-paper pt-24 md:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-24">
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            data-testid="status-open"
            className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-card px-3 py-1.5 font-mono text-xs font-bold uppercase"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${status.open ? 'bg-basil animate-pulse' : 'bg-sauce'}`} aria-hidden />
            {status.open ? 'Ovens on' : 'Back at 10 AM'} &middot; Iloilo {status.time}
          </motion.p>
          <h1 id="hero-title" className="font-display uppercase leading-[0.86] text-ink">
            <motion.span initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="block text-[17vw] sm:text-[13vw] lg:text-[8.5rem]">
              New York
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="block text-[17vw] text-sauce sm:text-[13vw] lg:text-[8.5rem]">
              Pizza.
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="stroke-text block text-[14vw] sm:text-[11vw] lg:text-[7rem]">
              In Iloilo.
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
            Big, thin, foldable slices in K-Town on Megaworld Boulevard. Brooklyn-style pizza, right here in Iloilo. A few taps put your pie in motion.
          </motion.p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <OrderButton testId="button-hero-order" label="Order your pie" />
            <a href="#menu" data-testid="link-hero-menu" className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase underline decoration-2 underline-offset-4 hover:text-sauce">
              See the pies <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <div className="checker absolute inset-[6%] rotate-6 rounded-[2rem] border-[3px] border-ink" aria-hidden />
          <motion.div
            style={{ rotate }}
            initial={{ scale: 0.6, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.2 }}
            className="absolute inset-0 overflow-hidden rounded-full border-[4px] border-ink hard-shadow"
          >
            <img
              src={img('hero-pizza.jpg')}
              alt="A whole New York-style cheese pizza with a blistered thin crust, fresh from the oven"
              width={1024}
              height={1024}
              data-testid="img-hero-pizza"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ type: 'spring', delay: 0.8 }}
            className="absolute -left-2 bottom-6 grid h-32 w-32 place-items-center rounded-full border-[3px] border-ink bg-mustard text-center sm:h-36 sm:w-36"
          >
            <span className="font-display text-lg uppercase leading-tight text-ink">
              Open
              <br />
              <span className="text-3xl">till 4AM</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ['Cheese', 'Classic', 'Meat Lovers', 'Brooklyn Supreme', 'White Garlic', 'All Meats', 'Pasta', 'Wings'];
  const row = [...words, ...words];
  return (
    <div className="overflow-hidden border-y-[3px] border-ink bg-sauce py-4 text-paper" aria-hidden>
      <div className="marquee flex w-max gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-4xl uppercase md:text-5xl">
            {w}
            <span className="inline-block h-4 w-4 rotate-45 bg-mustard" />
          </span>
        ))}
      </div>
    </div>
  );
}

function PieMenu() {
  const [active, setActive] = useState(PIES[0].id);
  const pie = PIES.find((p) => p.id === active) ?? PIES[0];
  return (
    <section id="menu" aria-labelledby="menu-title" className="scroll-mt-20 bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div {...reveal} className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-mustard">01 / The Pies</p>
            <h2 id="menu-title" className="mt-3 font-display text-6xl uppercase leading-none md:text-8xl">
              Six ways<br />to <span className="text-mustard">fold</span>.
            </h2>
          </div>
          <p className="max-w-sm text-paper/70">
            The pies people talk about at Brooklyn. Toppings, sizes and prices change, so check the live ordering menu for today's selection and current pricing.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <ol className="border-t-2 border-paper/20" role="list">
            {PIES.map((p, i) => {
              const on = p.id === active;
              return (
                <li key={p.id} className="border-b-2 border-paper/20">
                  <button
                    type="button"
                    data-testid={`button-pie-${p.id}`}
                    aria-pressed={on}
                    onMouseEnter={() => setActive(p.id)}
                    onFocus={() => setActive(p.id)}
                    onClick={() => setActive(p.id)}
                    className="group flex w-full items-baseline gap-5 py-4 text-left"
                  >
                    <span className={`font-mono text-sm ${on ? 'text-mustard' : 'text-paper/40'}`}>0{i + 1}</span>
                    <span className={`font-display text-4xl uppercase transition-transform duration-300 md:text-6xl ${on ? 'translate-x-2 text-sauce' : 'text-paper group-hover:translate-x-2'}`}>
                      {p.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.article
              key={pie.id}
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.35 }}
              data-testid={`card-pie-${pie.id}`}
              className="overflow-hidden rounded-3xl border-[3px] border-paper bg-paper text-ink"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-ink">
                <img
                  src={img(pie.id === 'white-garlic' ? 'white-pizza.jpg' : pie.id === 'cheese' || pie.id === 'classic' ? 'hero-pizza.jpg' : 'slice-pull.jpg')}
                  alt={`Illustrative photo for the ${pie.name} pizza`}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full border-2 border-ink bg-mustard px-3 py-1 font-mono text-xs font-bold uppercase">
                  {pie.tag}
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-display text-5xl uppercase" data-testid="text-pie-name">{pie.name}</h3>
                <p className="mt-3 text-lg text-ink/75">{pie.note}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-ink/30 pt-5">
                  <span className="font-mono text-xs uppercase text-ink/60">Price &amp; sizes: see online menu</span>
                  <a href={ORDER_URL} target="_blank" rel="noopener noreferrer" aria-label={`Order ${pie.name} with Utak, opens in a new tab`} data-testid={`button-order-${pie.id}`} className="press hard-shadow-sm inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sauce px-5 py-2.5 font-display uppercase text-paper">
                    <ArrowUpRight className="h-4 w-4" aria-hidden /> Order this pie
                  </a>
                </div>
              </div>
            </motion.article>
            <p className="mt-3 font-mono text-[11px] uppercase text-paper/40">Photos are illustrative. Actual pies may look different.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fold() {
  const steps = [
    { n: '1', t: 'Grab it wide', d: 'A proper New York slice is too big to eat flat. That is the point.' },
    { n: '2', t: 'Fold it down the middle', d: 'Crease the crust lengthwise. The tip stops drooping and the cheese stays put.' },
    { n: '3', t: 'Eat it walking', d: 'Or standing at the counter. Or at 2 AM after a long night out on the Boulevard.' },
  ];
  return (
    <section id="fold" aria-labelledby="fold-title" className="relative scroll-mt-20 overflow-hidden bg-mustard py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-2">
        <motion.div {...reveal} className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[2rem] border-[4px] border-ink hard-shadow -rotate-2">
            <img src={img('slice-pull.jpg')} alt="A hand lifting a folded slice of pizza with a long cheese pull" width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <div className="absolute -right-3 -top-6 rotate-6 rounded-xl border-[3px] border-ink bg-paper px-4 py-2 font-display text-2xl uppercase">The Brooklyn fold</div>
        </motion.div>
        <div className="order-1 lg:order-2">
          <motion.div {...reveal}>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-sauce">02 / The Fold</p>
            <h2 id="fold-title" className="mt-3 font-display text-6xl uppercase leading-[0.9] text-ink md:text-8xl">
              Don't use<br />a fork.
            </h2>
          </motion.div>
          <ol className="mt-10 space-y-5">
            {steps.map((s, i) => (
              <motion.li key={s.n} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }} className="flex gap-5 rounded-2xl border-[3px] border-ink bg-paper p-5 hard-shadow-sm" data-testid={`step-fold-${s.n}`}>
                <span className="font-display text-5xl leading-none text-sauce">{s.n}</span>
                <div>
                  <h3 className="font-display text-2xl uppercase">{s.t}</h3>
                  <p className="mt-1 text-ink/75">{s.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function More() {
  return (
    <section id="more" aria-labelledby="more-title" className="scroll-mt-20 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-12">
          <motion.div {...reveal} className="md:col-span-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-sauce">03 / Beyond the pie</p>
            <h2 id="more-title" className="mt-3 font-display text-6xl uppercase leading-[0.9] md:text-7xl">
              Pasta.<br />Wings.<br /><span className="text-sauce">Also pizza.</span>
            </h2>
            <p className="mt-6 max-w-sm text-lg text-ink/75">
              Rounding out the table for the friend who swears they're not in a pizza mood. Find the current selection and details on the ordering menu.
            </p>
          </motion.div>
          <motion.figure {...reveal} className="relative overflow-hidden rounded-[2rem] border-[4px] border-ink md:col-span-7 hard-shadow">
            <img src={img('pasta-wings.jpg')} alt="A bowl of red sauce pasta next to a basket of chicken wings" width={1024} height={768} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
            <figcaption className="absolute bottom-4 left-4 rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-xs font-bold uppercase">Illustrative photo</figcaption>
          </motion.figure>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            { id: 'pasta', t: 'Pasta', d: 'Comfort in a bowl, from the same kitchen as the pies.' },
            { id: 'wings', t: 'Wings', d: 'Built for sharing, or for not sharing. Your call.' },
          ].map((c) => (
            <motion.a key={c.id} {...reveal} href={ORDER_URL} target="_blank" rel="noopener noreferrer" data-testid={`card-side-${c.id}`} className="press group flex items-center justify-between rounded-3xl border-[3px] border-ink bg-card p-6 hard-shadow-sm md:p-8">
              <div>
                <h3 className="font-display text-5xl uppercase">{c.t}</h3>
                <p className="mt-2 text-ink/70">{c.d}</p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-mustard transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-6 w-6" aria-hidden />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hours() {
  const status = useManilaOpen();
  return (
    <section id="hours" aria-labelledby="hours-title" className="relative scroll-mt-20 overflow-hidden bg-sauce py-20 text-paper md:py-28">
      <svg className="spin-slow pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] opacity-20" viewBox="0 0 200 200" aria-hidden>
        <defs><path id="circ" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
        <text fill="currentColor" fontSize="15" fontFamily="Anton" letterSpacing="4">
          <textPath href="#circ">LATE NIGHT SLICES · LATE NIGHT SLICES · LATE NIGHT SLICES ·</textPath>
        </text>
      </svg>
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.p {...reveal} className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-mustard">04 / Hours</motion.p>
        <motion.h2 {...reveal} id="hours-title" className="mt-3 font-display text-[18vw] uppercase leading-[0.85] md:text-[10rem]">
          10AM <span className="text-mustard">&rarr;</span> 4AM
        </motion.h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border-[3px] border-ink bg-paper p-6 text-ink hard-shadow md:col-span-2">
            <p className="font-display text-3xl uppercase">Every day. Reportedly.</p>
            <p className="mt-2 text-ink/75">
              Daily hours reported as 10:00 AM to 4:00 AM, which covers lunch, merienda, dinner and whatever you call the meal after midnight. Hours can shift on holidays, so a quick call before heading over never hurts.
            </p>
          </div>
          <div className="flex flex-col justify-between rounded-3xl border-[3px] border-ink bg-ink p-6 hard-shadow">
            <p className="font-mono text-xs uppercase text-paper/60">Right now in Iloilo</p>
            <p className="font-display text-5xl" data-testid="text-local-time">{status.time}</p>
            <p className="mt-2 font-display text-2xl uppercase text-mustard" data-testid="text-hours-status">
              {status.open ? 'Should be open' : 'Ovens resting'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-20 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.p {...reveal} className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-sauce">05 / Find us</motion.p>
        <motion.h2 {...reveal} id="visit-title" className="mt-3 font-display text-6xl uppercase leading-[0.9] md:text-8xl">
          K-Town.<br />Ground floor.
        </motion.h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <motion.div {...reveal} className="checker relative min-h-[320px] overflow-hidden rounded-[2rem] border-[4px] border-ink hard-shadow">
            <div className="absolute inset-6 flex flex-col justify-between rounded-2xl border-[3px] border-ink bg-paper p-6 md:inset-10 md:p-8">
              <MapPin className="h-12 w-12 text-sauce" strokeWidth={2.5} aria-hidden />
              <address className="not-italic" data-testid="text-address">
                <span className="block font-display text-3xl uppercase leading-tight md:text-4xl">Brooklyn Pizza PH</span>
                <span className="mt-2 block text-lg text-ink/80">
                  Ground Floor, K-Town, Megaworld Boulevard<br />Mandurriao, Iloilo City 5000
                </span>
              </address>
              <a href={MAPS} target="_blank" rel="noopener noreferrer" data-testid="link-directions" className="press hard-shadow-sm inline-flex w-fit items-center gap-2 rounded-full border-[3px] border-ink bg-mustard px-5 py-2.5 font-display uppercase">
                Get directions <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </motion.div>
          <div className="grid gap-6">
            <motion.a {...reveal} href={TEL} data-testid="link-visit-phone" className="press rounded-3xl border-[3px] border-ink bg-sauce p-6 text-paper hard-shadow md:p-8">
              <Phone className="h-8 w-8" aria-hidden />
              <p className="mt-4 font-mono text-xs uppercase text-paper/70">Orders + current menu</p>
              <p className="font-display text-4xl md:text-5xl" data-testid="text-phone">{PHONE}</p>
            </motion.a>
            <motion.div {...reveal} className="rounded-3xl border-[3px] border-ink bg-card p-6 hard-shadow md:p-8">
              <Clock className="h-8 w-8 text-sauce" aria-hidden />
              <p className="mt-4 font-mono text-xs uppercase text-ink/60">Open daily</p>
              <p className="font-display text-4xl" data-testid="text-hours">10:00 AM – 4:00 AM</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t-[3px] border-ink bg-ink py-24 text-center text-paper md:py-32">
      <motion.div {...reveal} className="relative mx-auto max-w-4xl px-4">
        <h2 id="cta-title" className="font-display text-6xl uppercase leading-[0.9] md:text-9xl">
          Hungry<br /><span className="text-sauce">yet?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg text-paper/70">
          Your next Brooklyn-style slice is a few taps away. Ordering is handled by Utak.
        </p>
        <div className="mt-10 flex justify-center">
          <OrderButton testId="button-final-order" label="Order from Brooklyn" className="!border-paper text-2xl" />
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink pb-28 text-paper/60 md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-paper/15 px-4 pt-8 font-mono text-xs uppercase md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-paper/30 bg-white p-1">
            <img
              src={LOGO}
              alt="The Brooklyn NY Style Pizza logo"
              width={64}
              height={64}
              loading="lazy"
              data-testid="img-logo-footer"
              className="h-full w-full object-contain"
            />
          </span>
          <p>Brooklyn Pizza PH &middot; The Brooklyn NY Style Pizza</p>
        </div>
        <p>K-Town, Megaworld Blvd, Mandurriao, Iloilo City</p>
        <p>Menu and prices subject to change &middot; Call to confirm</p>
      </div>
    </footer>
  );
}

function MobileBar() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 md:hidden">
      <a
        href={ORDER_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-mobile-order"
        className="flex items-center justify-between rounded-full border-[3px] border-ink bg-sauce px-5 py-3 text-paper hard-shadow-sm active:translate-y-0.5"
      >
        <span className="flex items-center gap-2 font-display text-xl uppercase">
          <ArrowUpRight className="h-5 w-5" aria-hidden /> Order online
        </span>
        <span className="font-mono text-xs uppercase">Via Utak</span>
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded focus:bg-mustard focus:px-3 focus:py-2">
        Skip to content
      </a>
      <MotionConfig reducedMotion="user">
        <Header />
        <main id="main">
          <Hero />
          <Marquee />
          <PieMenu />
          <Fold />
          <More />
          <Hours />
          <Visit />
          <FinalCta />
        </main>
        <Footer />
        <MobileBar />
      </MotionConfig>
    </>
  );
}
