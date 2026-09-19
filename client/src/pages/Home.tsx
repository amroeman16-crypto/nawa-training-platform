import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CirclePlay,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Headphones,
  Layers3,
  Library,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  students: string;
  rating: string;
  lessons: number;
  accent: string;
  gradient: string;
  description: string;
  icon: typeof Layers3;
};

const courses: Course[] = [
  {
    id: 1,
    title: "القيادة الرقمية وصناعة الأثر",
    category: "الإدارة والقيادة",
    level: "متوسط",
    duration: "6 أسابيع",
    students: "1,240",
    rating: "4.9",
    lessons: 24,
    accent: "#6d7bff",
    gradient: "from-[#202b8d] via-[#161d62] to-[#0b1028]",
    description: "منهج تطبيقي لبناء عقلية قيادية تقود التحول وتحوّل الأفكار إلى نتائج قابلة للقياس.",
    icon: BarChart3,
  },
  {
    id: 2,
    title: "أساسيات تجربة المستخدم UX",
    category: "التصميم والمنتج",
    level: "مبتدئ",
    duration: "4 أسابيع",
    students: "2,860",
    rating: "4.8",
    lessons: 18,
    accent: "#22d3ee",
    gradient: "from-[#083e58] via-[#082e46] to-[#091525]",
    description: "اكتشف كيف تفهم المستخدم، وتبني تجارب رقمية واضحة ومحبوبة من أول فكرة إلى أول اختبار.",
    icon: Layers3,
  },
  {
    id: 3,
    title: "الذكاء الاصطناعي للعمل الذكي",
    category: "التقنية والبيانات",
    level: "متقدم",
    duration: "8 أسابيع",
    students: "980",
    rating: "5.0",
    lessons: 32,
    accent: "#c084fc",
    gradient: "from-[#52247e] via-[#2a174c] to-[#101224]",
    description: "استخدم أدوات الذكاء الاصطناعي بوعي لتحسين الإنتاجية، وتحليل المعلومات، واتخاذ القرار.",
    icon: Zap,
  },
];

const liveSessions = [
  { time: "08:00 م", title: "جلسة أسئلة وأجوبة: تجربة المستخدم", host: "مع المدربة ندى العتيبي", color: "cyan", status: "يبدأ بعد 32 دقيقة" },
  { time: "09:30 م", title: "مختبر عملي: أدوات الذكاء الاصطناعي", host: "مع المدرب سامر الحربي", color: "violet", status: "مسجّل مسبقاً" },
  { time: "10:15 م", title: "نادي القراءة: قيادة بلا ضجيج", host: "مع مجتمع نَوَى", color: "blue", status: "غداً" },
];

const resources = [
  { type: "دليل عملي", title: "خارطة طريق بناء المهارة", meta: "PDF · 28 صفحة", icon: FileText, color: "blue" },
  { type: "بودكاست", title: "ما بعد الشهادة", meta: "حلقة 12 · 34 دقيقة", icon: Headphones, color: "violet" },
  { type: "ورشة قصيرة", title: "اكتب أول خطة تعلم", meta: "فيديو · 18 دقيقة", icon: CirclePlay, color: "cyan" },
];

const categories = ["الكل", "التقنية والبيانات", "التصميم والمنتج", "الإدارة والقيادة"];

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="نَوَى">
      <span className="brand-mark-orbit" />
      <span className="brand-mark-core">ن</span>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: string }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <button className="text-link" onClick={() => toast.info("نعمل على إضافة المزيد من المسارات قريباً")}>{action}<ArrowLeft size={16} /></button>}
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [enrolled, setEnrolled] = useState<number[]>([]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const categoryMatch = activeCategory === "الكل" || course.category === activeCategory;
      const searchMatch = `${course.title} ${course.category}`.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const scrollTo = (id: string) => {
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnroll = (course: Course) => {
    if (!isAuthenticated) {
      toast.info("سجّل دخولك أولاً للانضمام إلى المسار");
      startLogin();
      return;
    }
    setEnrolled((current) => current.includes(course.id) ? current : [...current, course.id]);
    toast.success(`تمت إضافة «${course.title}» إلى مساراتك`);
  };

  return (
    <div className="nawa-page" dir="rtl">
      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu-button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="فتح القائمة"><Menu size={22} /></button>
          <button className="brand" onClick={() => scrollTo("top")} aria-label="العودة إلى الرئيسية">
            <BrandMark />
            <span><strong>نَوَى</strong><small>مساحتك للنمو</small></span>
          </button>
          <nav className={`main-nav ${mobileNavOpen ? "is-open" : ""}`}>
            <button className="active" onClick={() => scrollTo("top")}>الرئيسية</button>
            <button onClick={() => scrollTo("tracks")}>المسارات</button>
            <button onClick={() => scrollTo("live")}>الفصول المباشرة</button>
            <button onClick={() => scrollTo("library")}>المكتبة</button>
          </nav>
          <div className="header-actions">
            <button className="icon-button" onClick={() => toast.info("ستظهر تنبيهاتك هنا عند التسجيل في فصل جديد")} aria-label="التنبيهات"><Bell size={19} /></button>
            {authLoading ? <div className="auth-skeleton" /> : isAuthenticated ? (
              <button className="profile-chip" onClick={() => toast.info(`أهلاً ${user?.name ?? "بك"}`)}><span>{(user?.name ?? "ن").slice(0, 1)}</span><small>{user?.name ?? "حسابي"}</small></button>
            ) : <button className="login-button" onClick={() => startLogin()}>تسجيل الدخول <ArrowUpRight size={16} /></button>}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-inner container">
            <div className="hero-copy">
              <div className="hero-pill"><span className="live-dot" />تعلّم اليوم، واصنع الفرق غداً</div>
              <h1>خطوتك القادمة<br /><span>تبدأ من هنا.</span></h1>
              <p>منصة عربية تمنحك المعرفة، الأدوات، والمجتمع الذي تحتاجه لتتقدم بثقة في عالم لا يتوقف عن التغيّر.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => scrollTo("tracks")}>استكشف المسارات <ArrowLeft size={18} /></button>
                <button className="play-button" onClick={() => toast.success("فيديو التعريف بالمنصة قادم قريباً")}><span><Play size={15} fill="currentColor" /></span> شاهد كيف تعمل نَوَى</button>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack"><span>س</span><span>ر</span><span>م</span><span>+2k</span></div>
                <div><strong>أكثر من 6,000 متعلم</strong><small>اختاروا أن يبدأوا رحلتهم معنا</small></div>
              </div>
            </div>
            <div className="hero-dashboard" aria-label="ملخص تقدم المتعلم">
              <div className="dashboard-topline"><span className="status-chip"><span /> لوحة التعلم</span><span className="muted-label">الأحد، ٢٢ سبتمبر</span></div>
              <div className="dashboard-welcome"><div><span className="mini-eyebrow">رحلتك هذا الأسبوع</span><h3>أهلاً بك في مساحة<br /><em>النمو.</em></h3></div><div className="mini-avatar">ن</div></div>
              <div className="progress-card"><div className="progress-ring"><div><strong>68</strong><small>%</small></div></div><div><span className="mini-eyebrow">إنجازك الحالي</span><strong className="progress-title">تقدم رائع، استمر!</strong><small className="progress-note">أنجزت 14 من أصل 24 درساً</small></div><ArrowUpRight size={16} className="progress-arrow" /></div>
              <div className="dashboard-grid"><div className="dash-stat"><span className="stat-icon cyan"><BookOpen size={15} /></span><strong>14</strong><small>دروس مكتملة</small></div><div className="dash-stat"><span className="stat-icon violet"><Clock3 size={15} /></span><strong>12س</strong><small>وقت التعلم</small></div><div className="dash-stat"><span className="stat-icon amber"><Star size={15} fill="currentColor" /></span><strong>4.9</strong><small>متوسط تقييمك</small></div></div>
              <div className="next-class"><div className="next-class-icon"><Video size={18} /></div><div><span>الفصل التالي</span><strong>مختبر الذكاء الاصطناعي</strong><small>اليوم · 08:30 م</small></div><button onClick={() => scrollTo("live")} aria-label="عرض الفصل التالي"><ArrowLeft size={17} /></button></div>
            </div>
          </div>
          <div className="scroll-cue"><span>مرر لاكتشاف المزيد</span><ArrowDown size={15} /></div>
        </section>

        <section className="logo-strip"><div className="container logo-strip-inner"><span className="logo-strip-label">اختارتنا فرق طموحة للتعلم المستمر</span><div className="partner-logos"><strong>سطر</strong><strong className="outlined-logo">مَدار</strong><strong className="wide-logo">NEXA</strong><strong className="serif-logo">أثر</strong><strong className="mono-logo">CODE/AR</strong></div></div></section>

        <section className="tracks-section section-pad" id="tracks">
          <div className="container">
            <SectionHeading eyebrow="تعلم بوضوح" title="مسارات صُممت لتصل بك" description="محتوى عملي، مدربون خبراء، وتجربة تعلم تراعي وقتك وطموحك." action="عرض كل المسارات" />
            <div className="track-toolbar"><div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? "selected" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن مهارة أو مسار..." aria-label="ابحث عن مسار" /></label></div>
            <div className="course-grid">{filteredCourses.map((course) => { const CourseIcon = course.icon; const isEnrolled = enrolled.includes(course.id); return <article className="course-card" key={course.id} onClick={() => setSelectedCourse(course)}><div className={`course-visual bg-gradient-to-br ${course.gradient}`}><div className="course-orb" style={{ background: course.accent }} /><div className="course-grid-lines" /><span className="course-level">{course.level}</span><span className="course-icon"><CourseIcon size={21} /></span><div className="course-number">0{course.id}</div></div><div className="course-body"><div className="course-meta"><span>{course.category}</span><span><Star size={13} fill="currentColor" /> {course.rating}</span></div><h3>{course.title}</h3><p>{course.description}</p><div className="course-footer"><span><Clock3 size={14} /> {course.duration}</span><span><Users size={14} /> {course.students}</span><button className={isEnrolled ? "enrolled-button" : "course-arrow"} onClick={(event) => { event.stopPropagation(); handleEnroll(course); }} aria-label={isEnrolled ? "تم التسجيل" : "التسجيل في المسار"}>{isEnrolled ? <Check size={16} /> : <ArrowLeft size={17} />}</button></div></div></article>; })}</div>
            {filteredCourses.length === 0 && <div className="empty-state"><Search size={22} /><p>لم نعثر على مسار مطابق. جرّب كلمة أخرى.</p></div>}
          </div>
        </section>

        <section className="live-section section-pad" id="live"><div className="container live-layout"><div className="live-intro"><div className="eyebrow"><span className="eyebrow-dot purple" />تعلّم مع الآخرين</div><h2>فصل حي.<br /><span>حوار حقيقي.</span></h2><p>لا تتعلم وحدك. انضم إلى جلسات مباشرة مع خبراء ومتعلّمين يشاركونك الشغف نفسه.</p><button className="outline-button" onClick={() => toast.success("تم حفظ الفصول القادمة في تقويمك")}>تصفح جدول الفصول <CalendarDays size={17} /></button><div className="live-stats"><div><strong>48</strong><span>فصل هذا الشهر</span></div><div><strong>19</strong><span>مدرباً مميزاً</span></div></div></div><div className="sessions-card"><div className="sessions-header"><div><span className="mini-eyebrow">الجدول القادم</span><h3>لا تفوّت لحظة التعلم</h3></div><button onClick={() => toast.info("جميع الأوقات معروضة بتوقيت الرياض")}>هذا الأسبوع <ChevronDown size={15} /></button></div><div className="session-list">{liveSessions.map((session, index) => <button className="session-row" key={session.title} onClick={() => toast.success(`سجّلنا اهتمامك بفصل «${session.title}»`)}><div className={`session-time ${session.color}`}><strong>{session.time}</strong><small>{index === 0 ? "اليوم" : index === 1 ? "اليوم" : "غداً"}</small></div><div className="session-info"><span className={`session-status ${session.color}`}><span />{session.status}</span><strong>{session.title}</strong><small>{session.host}</small></div><span className="session-action"><ArrowLeft size={17} /></span></button>)}</div><div className="sessions-footer"><span><span className="online-dot" /> 84 متعلماً يتعلمون الآن</span><button onClick={() => scrollTo("community")}>انضم إلى المجتمع <ArrowLeft size={15} /></button></div></div></div></section>

        <section className="method-section section-pad"><div className="container"><SectionHeading eyebrow="لماذا نَوَى؟" title="تعلم يترك أثراً، لا مجرد شهادة" description="صممنا كل تفصيلة لتساعدك على تحويل المعرفة إلى عادة، والفضول إلى تقدم." /><div className="method-grid"><div className="method-card featured"><span className="method-icon"><Sparkles size={20} /></span><div><h3>محتوى ينمو معك</h3><p>مسارات مرنة ومشاريع تطبيقية تحاكي تحديات العمل الحقيقية، لتتعلم ما تحتاجه فعلاً.</p></div><div className="method-chart"><span style={{ height: "36%" }} /><span style={{ height: "52%" }} /><span style={{ height: "44%" }} /><span style={{ height: "70%" }} /><span style={{ height: "61%" }} /><span style={{ height: "88%" }} /><span style={{ height: "76%" }} /></div></div><div className="method-card"><span className="method-icon cyan"><Users size={20} /></span><h3>مجتمع يشبهك</h3><p>تواصل مع متعلمين وخبراء يشاركونك الطموح، وتبادل الخبرات في مساحة آمنة وملهمة.</p><div className="community-avatars"><span>ل</span><span>ع</span><span>ف</span><span>س</span><b>+1.8k</b></div></div><div className="method-card"><span className="method-icon violet"><ShieldCheck size={20} /></span><h3>تقدم موثوق</h3><p>تتبع إنجازك، احصل على ملاحظات واضحة، واحتفل بكل خطوة صغيرة في رحلتك.</p><div className="trust-line"><Check size={14} /><span>شهادة إتمام معتمدة</span></div><div className="trust-line"><Check size={14} /><span>تغذية راجعة من الخبراء</span></div></div></div></div></section>

        <section className="library-section section-pad" id="library"><div className="container"><SectionHeading eyebrow="مكتبة نَوَى" title="شيء جديد لكل فضول" description="جرعات معرفية منتقاة تساعدك على مواصلة التعلم حتى خارج المسار." action="استكشف المكتبة" /><div className="resource-grid">{resources.map((resource) => { const ResourceIcon = resource.icon; return <button className="resource-card" key={resource.title} onClick={() => toast.success(`فتحنا لك مورد «${resource.title}»`)}><div className={`resource-icon ${resource.color}`}><ResourceIcon size={21} /></div><div className="resource-content"><span>{resource.type}</span><h3>{resource.title}</h3><small>{resource.meta}</small></div><ArrowUpRight size={18} /></button>; })}</div></div></section>

        <section className="cta-section" id="community"><div className="cta-noise" /><div className="container cta-inner"><div className="cta-copy"><div className="eyebrow"><span className="eyebrow-dot" />مكانك محفوظ</div><h2>جاهز تبدأ<br /><span>نَوَاتك القادمة؟</span></h2><p>لا تنتظر اللحظة المثالية. اختر مسارك، وخذ الخطوة الأولى اليوم.</p></div><div className="cta-action"><button className="primary-button large" onClick={() => scrollTo("tracks")}>ابدأ التعلم الآن <ArrowLeft size={18} /></button><small><ClipboardCheck size={14} /> إنشاء حساب مجاني · بدون بطاقة ائتمانية</small></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><button className="brand" onClick={() => scrollTo("top")}><BrandMark /><span><strong>نَوَى</strong><small>مساحتك للنمو</small></span></button><p>نصنع مساحات تساعدك على أن تنمو<br />بالمعرفة، وبالفضول، وبإيقاعك.</p></div><div className="footer-links"><div><span>اكتشف</span><button onClick={() => scrollTo("tracks")}>المسارات</button><button onClick={() => scrollTo("live")}>الفصول المباشرة</button></div><div><span>نَوَى</span><button onClick={() => toast.info("صفحة عن نَوَى قيد الإعداد")}>عن المنصة</button><button onClick={() => toast.info("تواصل معنا على hello@nawa.academy")}>تواصل معنا</button></div><div><span>حسابك</span><button onClick={() => isAuthenticated ? logout() : startLogin()}>{isAuthenticated ? "تسجيل الخروج" : "تسجيل الدخول"}</button><button onClick={() => toast.info("مركز المساعدة قيد الإعداد")}>مركز المساعدة</button></div></div></div><div className="container footer-bottom"><span>© 2026 نَوَى. مساحة للتعلم المستمر.</span><span>صنع بعناية للفضوليين.</span></div></footer>

      {selectedCourse && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedCourse(null)}><div className="course-modal" role="dialog" aria-modal="true" aria-labelledby="course-modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedCourse(null)} aria-label="إغلاق"><X size={18} /></button><div className={`modal-visual bg-gradient-to-br ${selectedCourse.gradient}`}><span className="course-level">{selectedCourse.level}</span><div className="modal-visual-icon"><selectedCourse.icon size={30} /></div><div><span>مسار نَوَى</span><strong>#{String(selectedCourse.id).padStart(2, "0")}</strong></div></div><div className="modal-content"><span className="course-category">{selectedCourse.category}</span><h2 id="course-modal-title">{selectedCourse.title}</h2><p>{selectedCourse.description}</p><div className="modal-facts"><span><Clock3 size={15} /> {selectedCourse.duration}</span><span><BookOpen size={15} /> {selectedCourse.lessons} درساً</span><span><Users size={15} /> {selectedCourse.students} متعلم</span></div><button className="primary-button modal-button" onClick={() => { handleEnroll(selectedCourse); setSelectedCourse(null); }}>{enrolled.includes(selectedCourse.id) ? "أنت مسجل في المسار" : "انضم إلى المسار"}<ArrowLeft size={17} /></button></div></div></div>}
    </div>
  );
}

export { courses };

// Keep these imports in the bundle for future dashboard extensions.
void Download;
void Library;
