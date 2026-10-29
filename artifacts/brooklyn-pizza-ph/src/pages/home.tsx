import { useEffect, useState } from 'react';
import { MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubmitFranchiseInquiry } from '@workspace/api-client-react';
import { Phone, MapPin, Clock, ArrowUpRight, Mail, CheckCircle2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { franchiseInquirySchema, type FranchiseInquiryValues } from '@/lib/franchise-inquiry';

const BASE = import.meta.env.BASE_URL;
const img = (p: string) => `${BASE}images/${p}`;
const LOGO = `${BASE}brooklyn-logo.png`;
const OVEN_VIDEO = `${BASE}videos/oven-pizza.mp4`;
const OVEN_SHOWCASE_VIDEO = `${BASE}videos/oven-showcase.mp4`;
const OVEN_SHOWCASE_POSTER = `${BASE}videos/oven-showcase-poster.webp`;
const TEL = 'tel:+63333384417';
const PHONE = '033 338 4417';
const ORDER_URL = 'https://utak.io/store/brooklyn_pizza';
const MAPS =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Brooklyn Pizza K-Town Megaworld Boulevard Mandurriao Iloilo City');

const NAV = [
  { id: 'menu', label: 'The Pies' },
  { id: 'hours', label: 'Late Hours' },
  { id: 'visit', label: 'Find Us' },
  { id: 'franchise', label: 'Franchise' },
];

const WEEKDAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
type Weekday = (typeof WEEKDAY_ORDER)[number];

const WEEKLY_HOURS: Record<Weekday, { closeMinute: number; display: string }> = {
  Sunday: { closeMinute: 26 * 60, display: '10 AM – 2 AM' },
  Monday: { closeMinute: 22 * 60, display: '10 AM – 10 PM' },
  Tuesday: { closeMinute: 24 * 60, display: '10 AM – 12 AM' },
  Wednesday: { closeMinute: 24 * 60, display: '10 AM – 12 AM' },
  Thursday: { closeMinute: 26 * 60, display: '10 AM – 2 AM' },
  Friday: { closeMinute: 28 * 60, display: '10 AM – 4 AM' },
  Saturday: { closeMinute: 28 * 60, display: '10 AM – 4 AM' },
};

const HOURS_ROWS: { label: string; day: Weekday }[] = [
  { label: 'Monday', day: 'Monday' },
  { label: 'Tuesday – Wednesday', day: 'Tuesday' },
  { label: 'Thursday', day: 'Thursday' },
  { label: 'Friday – Saturday', day: 'Friday' },
  { label: 'Sunday', day: 'Sunday' },
];

function formatClosingTime(closeMinute: number) {
  const minuteOfDay = closeMinute % (24 * 60);
  const hour24 = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const hour12 = hour24 % 12 || 12;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}${minute ? `:${String(minute).padStart(2, '0')}` : ''}${period}`;
}

const OWNER_PIES: { name: string; image: string; number: string; description?: string }[] = [
  { name: 'Brooklyn Supreme', image: 'brooklyn-supreme.webp', number: '01' },
  { name: 'Chicken Bacon Ranch', image: 'chicken-bacon-ranch.webp', number: '02' },
  { name: 'NY Style Cheese', image: 'ny-style-cheese.webp', number: '03', description: '100% Mozzarella Cheese' },
  { name: 'BBQ Bacon Chicken', image: 'bbq-bacon-chicken.webp', number: '04' },
  { name: 'Pepperoni', image: 'pepperoni.webp', number: '05' },
];

function useManilaOpen() {
  const calc = () => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: 'Asia/Manila',
    }).formatToParts(now);
    const weekday = (parts.find((part) => part.type === 'weekday')?.value ?? 'Sunday') as Weekday;
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
    const dayIndex = WEEKDAY_ORDER.indexOf(weekday);
    const previousDay = WEEKDAY_ORDER[(dayIndex + WEEKDAY_ORDER.length - 1) % WEEKDAY_ORDER.length];
    const minutesToday = hour * 60 + minute;
    const openToday = minutesToday >= 10 * 60 && minutesToday < Math.min(WEEKLY_HOURS[weekday].closeMinute, 24 * 60);
    const openFromYesterday = minutesToday < Math.max(0, WEEKLY_HOURS[previousDay].closeMinute - 24 * 60);
    const time = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Manila',
    }).format(now);
    const closeMinute = openFromYesterday
      ? WEEKLY_HOURS[previousDay].closeMinute - 24 * 60
      : WEEKLY_HOURS[weekday].closeMinute;
    return { open: openToday || openFromYesterday, time, closeTime: formatClosingTime(closeMinute) };
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
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8">
        <div className="flex items-center justify-between gap-2 py-2">
          <a href="#top" data-testid="link-logo" className="flex shrink-0 items-center gap-2" aria-label="Brooklyn Pizza home">
            <img
              src={LOGO}
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              data-testid="img-logo-header"
              className="h-10 w-10 shrink-0 object-contain mix-blend-multiply sm:h-12 sm:w-12"
            />
            <span className="whitespace-nowrap font-display text-base uppercase leading-none text-ink sm:text-xl">
              Brooklyn<span className="text-sauce"> Pizza</span>
            </span>
          </a>
          <nav aria-label="Primary" className="hidden min-w-0 flex-1 lg:block">
            <ul className="flex items-center justify-center gap-4 font-mono text-xs font-bold uppercase tracking-wider xl:gap-7">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} data-testid={`link-nav-${n.id}`} className="whitespace-nowrap underline-offset-4 hover:text-sauce hover:underline">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <a href={TEL} data-testid="link-header-phone" aria-label={`Call Brooklyn Pizza at ${PHONE}`} className="hidden items-center gap-2 rounded-full px-3 py-2 font-mono text-xs font-bold text-ink transition-colors hover:text-sauce xl:inline-flex">
              <Phone className="h-4 w-4" aria-hidden /> {PHONE}
            </a>
            <OrderButton testId="button-header-order" label="Order" className="!px-3 !py-2 !text-sm sm:!px-4 sm:!text-base" />
          </div>
        </div>
        <nav aria-label="Primary" className="border-t border-ink/10 py-2 lg:hidden">
          <ul className="flex items-center justify-between gap-2 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-wide sm:justify-center sm:gap-8 sm:text-xs">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-testid={`link-mobile-nav-${n.id}`}
                  className="block py-1 text-ink underline-offset-4 hover:text-sauce hover:underline"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 800], [0, 50]);
  const status = useManilaOpen();
  const prefersReducedMotion = useReducedMotion();
  return (
      <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-paper pt-32 md:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-24">
        <div className="relative z-10">
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
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-md flex-1 text-lg leading-relaxed text-ink/80">
              Big, thin, foldable slices in K-Town on Megaworld Boulevard. Brooklyn-style pizza, right here in Iloilo. A few taps put your pie in motion.
            </motion.p>
            <div
              aria-label="Fresh dough made daily, 100% fresh mozzarella cheese, freshest ingredients"
              className="grid h-36 w-36 shrink-0 rotate-6 place-items-center self-end rounded-full border-[3px] border-ink bg-mustard p-4 text-center text-[10px] font-bold uppercase leading-tight text-ink sm:h-40 sm:w-40 sm:self-auto sm:text-[11px]"
            >
              <div className="flex flex-col items-center gap-1.5">
                <span>Fresh Dough<br />Made Daily</span>
                <span className="w-full border-t border-ink/40 pt-1.5">100% Fresh<br />Mozzarella Cheese</span>
                <span className="w-full border-t border-ink/40 pt-1.5">Freshest Ingredients</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <OrderButton testId="button-hero-order" label="Order your pie" />
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
            <video
              autoPlay={prefersReducedMotion === false}
              loop={prefersReducedMotion === false}
              muted
              playsInline
              controls
              preload="metadata"
              poster={img('hero-pizza.jpg')}
              aria-label="Brooklyn Pizza kitchen oven clip"
              data-testid="video-hero-oven"
              className="h-full w-full object-cover"
            >
              <source src={OVEN_VIDEO} type="video/mp4" />
              <img
                src={img('hero-pizza.jpg')}
                alt="A whole New York-style cheese pizza with a blistered thin crust, fresh from the oven"
                width={1024}
                height={1024}
              />
            </video>
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ type: 'spring', delay: 0.8 }}
            className="absolute -left-2 bottom-6 grid h-32 w-32 place-items-center rounded-full border-[3px] border-ink bg-mustard text-center sm:h-36 sm:w-36"
          >
            <span className="font-display text-lg uppercase leading-tight text-ink">
              Closes at
              <br />
              <span className="text-3xl">{status.closeTime}</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ['Cheese', 'Classic', 'Meat Lovers', 'Brooklyn Supreme', 'White Garlic', 'All Meats'];
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
  return (
    <section id="menu" aria-labelledby="menu-title" className="scroll-mt-20 bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div {...reveal} className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="menu-title" className="font-display text-6xl uppercase leading-none md:text-8xl">
              The house<br /><span className="text-mustard">favorites.</span>
            </h2>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OWNER_PIES.map((pie, index) => (
            <motion.article
              key={pie.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.06 }}
              data-testid={`card-pie-photo-${index + 1}`}
              className={`group overflow-hidden rounded-3xl border-[3px] border-paper bg-paper text-ink hard-shadow-sm ${index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className={`relative overflow-hidden border-b-[3px] border-ink ${index === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}>
                <img
                  src={img(pie.image)}
                  alt={`${pie.name} pizza from Brooklyn Pizza PH`}
                  width={960}
                  height={720}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full border-2 border-ink bg-mustard px-3 py-1 font-mono text-xs font-bold uppercase">
                  Pie {pie.number}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
                <div>
                  <h3 className="font-display text-3xl uppercase leading-none md:text-4xl">{pie.name}</h3>
                  {pie.description && (
                    <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/70">{pie.description}</p>
                  )}
                </div>
                <a href={ORDER_URL} target="_blank" rel="noopener noreferrer" aria-label={`Order ${pie.name} with Utak, opens in a new tab`} data-testid={`button-order-photo-${index + 1}`} className="press inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-sauce px-4 py-2 font-display uppercase text-paper">
                  <ArrowUpRight className="h-4 w-4" aria-hidden /> Order
                </a>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}

function OvenShowcase() {
  return (
    <section aria-labelledby="oven-showcase-title" className="overflow-hidden border-y-[3px] border-ink bg-paper py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div {...reveal}>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-sauce">From our oven</p>
          <h2 id="oven-showcase-title" className="mt-3 font-display text-6xl uppercase leading-[0.9] md:text-8xl">
            One more<br /><span className="text-sauce">look.</span>
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-ink/75">
            A little kitchen-side view of the pies going into the oven. Press play when you're ready.
          </p>
        </motion.div>
        <motion.div {...reveal} className="overflow-hidden rounded-[2rem] border-[4px] border-ink bg-ink hard-shadow">
          <video
            controls
            playsInline
            preload="metadata"
            poster={OVEN_SHOWCASE_POSTER}
            aria-label="Brooklyn Pizza pie entering the oven"
            data-testid="video-oven-showcase"
            className="aspect-video w-full object-cover"
          >
            <source src={OVEN_SHOWCASE_VIDEO} type="video/mp4" />
            Your browser does not support this video.
          </video>
        </motion.div>
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
        <motion.h2 {...reveal} id="hours-title" className="font-display text-[18vw] uppercase leading-[0.85] md:text-[10rem]">
          Hours<br /><span className="text-mustard">by day.</span>
        </motion.h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border-[3px] border-ink bg-paper p-6 text-ink hard-shadow md:col-span-2">
            <p className="font-display text-3xl uppercase">Weekly schedule</p>
            <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {HOURS_ROWS.map((row) => (
                <div key={row.label} className="border-t-2 border-ink/15 py-3">
                  <dt className="font-mono text-xs font-bold uppercase tracking-wider text-ink/65">{row.label}</dt>
                  <dd className="mt-1 font-display text-2xl uppercase">{WEEKLY_HOURS[row.day].display}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-ink/70">Holiday hours may vary; call ahead.</p>
          </div>
          <div className="flex flex-col justify-between rounded-3xl border-[3px] border-ink bg-ink p-6 hard-shadow">
            <p className="font-mono text-xs uppercase text-paper/60">Right now in Iloilo</p>
            <p className="font-display text-5xl" data-testid="text-local-time">{status.time}</p>
            <p className="mt-2 font-display text-2xl uppercase text-mustard" data-testid="text-hours-status">
              {status.open ? 'Open now' : 'Closed now'}
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
            <motion.a {...reveal} href="#hours" data-testid="link-visit-hours" aria-label="View weekly opening hours" className="press block rounded-3xl border-[3px] border-ink bg-card p-6 hard-shadow md:p-8">
              <Clock className="h-8 w-8 text-sauce" aria-hidden />
              <p className="mt-4 font-mono text-xs uppercase text-ink/60">Hours vary by day</p>
              <p className="font-display text-3xl uppercase" data-testid="text-hours">View weekly schedule</p>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FranchiseInquiry() {
  const form = useForm<FranchiseInquiryValues>({
    resolver: zodResolver(franchiseInquirySchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      capital: undefined,
      location: '',
      website: '',
    },
  });
  const submitInquiry = useSubmitFranchiseInquiry();
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: FranchiseInquiryValues) => {
    setSubmitError(null);
    try {
      const result = await submitInquiry.mutateAsync({ data: values });
      setSubmittedMessage(result.message);
      form.reset();
    } catch {
      setSubmitError('We could not send your inquiry right now. Please try again shortly.');
    }
  };

  return (
    <section id="franchise" aria-labelledby="franchise-title" className="relative scroll-mt-20 overflow-hidden border-y-[3px] border-ink bg-mustard py-20 md:py-28">
      <div className="pointer-events-none absolute -right-16 top-8 hidden rotate-12 select-none font-display text-[20rem] leading-none text-ink/[0.06] lg:block" aria-hidden>
        B
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <motion.div {...reveal}>
          <h2 id="franchise-title" className="mt-4 font-display text-6xl uppercase leading-[0.88] text-ink md:text-8xl">
            A little<br />Brooklyn.<br /><span className="text-sauce">Your corner.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
            Thinking about bringing Brooklyn Pizza to your neighborhood? Share a little about yourself and the place you have in mind. We will use your email to follow up after reviewing your inquiry.
          </p>
          <div className="mt-8 flex items-center gap-3 border-t-2 border-ink/20 pt-5 font-mono text-xs font-bold uppercase tracking-wider text-ink/70">
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-paper text-sauce">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            A direct note to the owner
          </div>
        </motion.div>

        <motion.div {...reveal} className="rounded-[2rem] border-[3px] border-ink bg-paper p-5 hard-shadow sm:p-8 md:p-10">
          <div className="mb-7 border-b-2 border-ink/15 pb-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sauce">Tell us where to start</p>
            <p className="mt-2 font-display text-3xl uppercase leading-tight text-ink md:text-4xl">Let's talk pizza.</p>
          </div>
          {submittedMessage ? (
            <div
              className="rounded-2xl border-2 border-ink bg-card p-6 sm:p-8"
              role="status"
              aria-live="polite"
              data-testid="text-franchise-success"
            >
              <CheckCircle2 className="h-10 w-10 text-sauce" aria-hidden />
              <p className="mt-5 font-display text-2xl leading-tight text-ink md:text-3xl">
                {submittedMessage}
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div
                  className="pointer-events-none absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="franchise-website">Leave this field blank</label>
                  <input
                    id="franchise-website"
                    {...form.register('website')}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs font-bold uppercase tracking-wider text-ink">First name</FormLabel>
                        <FormControl>
                          <Input {...field} required autoComplete="given-name" data-testid="input-franchise-first-name" placeholder="Your first name" className="h-12 rounded-xl border-2 border-ink bg-card px-4 text-base shadow-none placeholder:text-ink/40 focus-visible:ring-sauce" />
                        </FormControl>
                        <FormMessage role="alert" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs font-bold uppercase tracking-wider text-ink">Last name</FormLabel>
                        <FormControl>
                          <Input {...field} required autoComplete="family-name" data-testid="input-franchise-last-name" placeholder="Your last name" className="h-12 rounded-xl border-2 border-ink bg-card px-4 text-base shadow-none placeholder:text-ink/40 focus-visible:ring-sauce" />
                        </FormControl>
                        <FormMessage role="alert" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs font-bold uppercase tracking-wider text-ink">Email address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" required autoComplete="email" data-testid="input-franchise-email" placeholder="you@example.com" className="h-12 rounded-xl border-2 border-ink bg-card px-4 text-base shadow-none placeholder:text-ink/40 focus-visible:ring-sauce" />
                      </FormControl>
                      <FormMessage role="alert" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs font-bold uppercase tracking-wider text-ink">How much capital do you have?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger aria-required="true" data-testid="select-franchise-capital" className="h-12 rounded-xl border-2 border-ink bg-card px-4 text-base shadow-none focus:ring-sauce">
                            <SelectValue placeholder="Choose a range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-2 border-ink bg-paper text-ink">
                          <SelectItem value="0–500k">0–500k</SelectItem>
                          <SelectItem value="501k–1 million">501k–1 million</SelectItem>
                          <SelectItem value="1 million–2+ million">1 million–2+ million</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage role="alert" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs font-bold uppercase tracking-wider text-ink">Location where you want to open a shop</FormLabel>
                      <FormControl>
                        <Input {...field} required autoComplete="address-level2" data-testid="input-franchise-location" placeholder="City, neighborhood, or area" className="h-12 rounded-xl border-2 border-ink bg-card px-4 text-base shadow-none placeholder:text-ink/40 focus-visible:ring-sauce" />
                      </FormControl>
                      <FormMessage role="alert" />
                    </FormItem>
                  )}
                />
                {submitError && (
                  <p role="alert" className="rounded-xl border-2 border-sauce/30 bg-sauce/5 px-4 py-3 text-sm text-ink">
                    {submitError}
                  </p>
                )}
                <div className="border-t-2 border-ink/15 pt-5">
                  <button
                    type="submit"
                    data-testid="button-franchise-submit"
                    disabled={submitInquiry.isPending}
                    className="press hard-shadow inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border-[3px] border-ink bg-sauce px-6 py-3 font-display text-xl uppercase text-paper disabled:cursor-wait disabled:opacity-70"
                  >
                    {submitInquiry.isPending ? 'Sending…' : 'Submit franchise inquiry'}
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                  </button>
                  <p className="mt-4 text-center text-sm leading-relaxed text-ink/70">
                    We will reply to the email address you provide after reviewing your inquiry.
                  </p>
                </div>
              </form>
            </Form>
          )}
        </motion.div>
      </div>
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
          <OvenShowcase />
          <Hours />
          <Visit />
          <FranchiseInquiry />
        </main>
        <Footer />
        <MobileBar />
      </MotionConfig>
    </>
  );
}
