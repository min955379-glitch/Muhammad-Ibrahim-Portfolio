export type Locale = "en" | "ur";

export const localeMeta: Record<
  Locale,
  { label: string; nativeLabel: string; dir: "ltr" | "rtl" }
> = {
  en: { label: "English", nativeLabel: "English", dir: "ltr" },
  ur: { label: "Urdu", nativeLabel: "اردو", dir: "rtl" },
};

type Dict = {
  nav: Record<string, string>;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaDownload: string;
    ctaArcade: string;
    scrollHint: string;
  };
  services: {
    title: string;
    subtitle: string;
    quote: string;
    processTitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    projectType: string;
    budget: string;
    message: string;
    submit: string;
    success: string;
    error: string;
    whatsapp: string;
  };
  common: {
    hireMe: string;
    menu: string;
    close: string;
    reduceMotion: string;
    theme: string;
    live: string;
    down: string;
    copy: string;
    copied: string;
  };
};

const en: Dict = {
  nav: {
    "live-sites": "Live Sites",
    projects: "Projects",
    "mobile-apks": "Mobile APKs",
    services: "Services",
    "studio-3d": "3D & Studio",
    skills: "Skills",
    arcade: "Arcade",
    about: "About & FAQ",
    contact: "Contact",
  },
  hero: {
    badge: "Abbottabad, PK · Open to work",
    title: "Full-Stack Web, Mobile & 3D Product Builder.",
    subtitle:
      "Software Engineering student building and shipping real Next.js 16 platforms, Supabase cloud backends, signed Android APKs, and Blender 3D Python scenes.",
    ctaPrimary: "Explore Live Websites",
    ctaDownload: "Download DailyMB APK",
    ctaArcade: "Play Cyber-Nova",
    scrollHint: "Scroll to explore",
  },
  services: {
    title: "Services & Delivery Process",
    subtitle:
      "End-to-end engineering with clear milestones and verified production delivery.",
    quote: "Get a quote",
    processTitle: "How we work",
  },
  contact: {
    title: "Start a Project",
    subtitle:
      "Currently available for freelance projects · Typical response time: under 4 hours (PKT / UTC+5).",
    name: "Your Name",
    email: "Your Email or WhatsApp",
    projectType: "Project Type",
    budget: "Budget Range",
    message: "Project Details",
    submit: "Send Project Brief",
    success: "Brief received. I reply to every message.",
    error: "Something went wrong. Please try again.",
    whatsapp: "Send WhatsApp",
  },
  common: {
    hireMe: "Hire Me",
    menu: "Menu",
    close: "Close",
    reduceMotion: "Reduce motion",
    theme: "Toggle theme",
    live: "Live",
    down: "Down",
    copy: "Copy email",
    copied: "Email copied",
  },
};

const ur: Dict = {
  nav: {
    "live-sites": "لائیو سائٹس",
    projects: "پروجیکٹس",
    "mobile-apks": "اینڈرائیڈ اے پی کے",
    services: "خدمات",
    "studio-3d": "3ڈی اور اسٹوڈیو",
    skills: "مہارتیں",
    arcade: "آرکیڈ",
    about: "تعارف اور سوالات",
    contact: "رابطہ",
  },
  hero: {
    badge: "ایبت آباد، پاکستان · کام دستیاب",
    title: "فل سٹیک ویب، موبائل اور 3ڈی پروڈکٹ بلڈر۔",
    subtitle:
      "سافٹ ویئر انجینئرنگ اسٹوڈنٹ — اصل Next.js 16 پلیٹ فارمز، Supabase کلاؤڈ بیک اینڈز، سائنڈ اینڈرائیڈ APKs اور Blender 3ڈی پائتھن سینز بنا کر شپ کرتا ہوں۔",
    ctaPrimary: "لائیو ویب سائٹس دیکھیں",
    ctaDownload: "DailyMB APK ڈاؤن لوڈ کریں",
    ctaArcade: "سائبر نووا کھیلیں",
    scrollHint: "دیکھنے کے لیے اسکرول کریں",
  },
  services: {
    title: "خدمات اور کام کا طریقہ",
    subtitle:
      "صاف مائل سٹونز کے ساتھ مکمل انجنئرنگ اور پروڈکشن ڈیلیوری۔",
    quote: "قیمت معلوم کریں",
    processTitle: "ہمارا طریقۂ کار",
  },
  contact: {
    title: "پراجیکٹ شروع کریں",
    subtitle:
      "فریلانس پروجیکٹس کے لیے دستیاب · عموماً جواب 4 گھنٹے سے کم میں (PKT / UTC+5)۔",
    name: "آپ کا نام",
    email: "آپ کا ای میل یا واٹس ایپ نمبر",
    projectType: "پروجیکٹ کی قسم",
    budget: "بجٹ رینج",
    message: "پروجیکٹ کی تفصیل",
    submit: "بریف بھیجیں",
    success: "بریف موصول ہو گیا۔ میں ہر پیغام کا جواب دیتا ہوں۔",
    error: "کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔",
    whatsapp: "واٹس ایپ پر بھیجیں",
  },
  common: {
    hireMe: "مجھے hire کریں",
    menu: "مینو",
    close: "بند کریں",
    reduceMotion: "حرکت کم کریں",
    theme: "تھیم بدلیں",
    live: "لائیو",
    down: "ڈاؤن",
    copy: "ای میل کاپی کریں",
    copied: "ای میل کاپی ہو گئی",
  },
};

export const dictionaries: Record<Locale, Dict> = { en, ur };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}
