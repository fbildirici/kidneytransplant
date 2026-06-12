"use client";
import Link from "next/link";
import {
  Pill,
  Apple,
  MessageSquare,
  ArrowRight,
  Shield,
  Activity,
  Stethoscope,
  HeartPulse,
  Check,
  Users,
  Droplets,
  AlertCircle,
  CalendarDays,
  ClipboardList,
  PhoneMissed,
  Lock,
  Bell,
  FileText,
  Calendar,
  Info,
  XCircle,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import PageTitle from "@/components/PageTitle";

const features = [
  {
    icon: Pill,
    title: "İlaç Takibi",
    description: "Saat, doz, aç/tok bilgisi ve alındı durumunu tek ekranda takip edin.",
    benefit: "Hiçbir dozu kaçırmayın. Tacrolimus ve diğer kritik ilaçlarınız için hatırlatma alın.",
    safetyNote: "Doz değişikliği yalnızca doktorunuzun önerisiyle yapılabilir.",
    iconBg: "bg-navy-50",
    iconColor: "text-navy-600",
    tag: "Temel",
    tagColor: "bg-navy-50 text-navy-600 border-navy-200",
  },
  {
    icon: Activity,
    title: "Laboratuvar Trendleri",
    description: "Kreatinin, eGFR, tacrolimus, potasyum ve diğer değerlerinizi zamana göre görün.",
    benefit: "e-Nabız'dan yapıştırın veya PDF yükleyin, sistem otomatik tanısın.",
    safetyNote: "Sonuçlarınızı doktorunuzla değerlendirin. Kesin tanı konamaz.",
    iconBg: "bg-info-50",
    iconColor: "text-info-600",
    tag: "Takip",
    tagColor: "bg-info-50 text-info-600 border-info-200",
  },
  {
    icon: Apple,
    title: "Beslenme Planı",
    description: "Diyetisyeninizin önerilerini günlük öğün planı olarak takip edin.",
    benefit: "Potasyum, fosfor, sodyum sınırlamalarını öğün bazında görün, su hedefini izleyin.",
    safetyNote: "Beslenme hedefleri doktorunuz veya diyetisyeniniz tarafından belirlenir.",
    iconBg: "bg-success-50",
    iconColor: "text-success-600",
    tag: "Beslenme",
    tagColor: "bg-success-50 text-success-600 border-success-200",
  },
  {
    icon: Calendar,
    title: "Randevu Yönetimi",
    description: "Doktor veya diyetisyen için randevu talebi oluşturun, onay durumunu izleyin.",
    benefit: "Tarih tercihlerinizi belirtin, onaylandığında bildirim alın.",
    safetyNote: "Randevu sistemi bilgi amaçlıdır; acil durumda doğrudan hastaneye başvurun.",
    iconBg: "bg-warning-50",
    iconColor: "text-warning-600",
    tag: "Randevu",
    tagColor: "bg-warning-50 text-warning-600 border-warning-200",
  },
  {
    icon: MessageSquare,
    title: "Güvenli Mesajlaşma",
    description: "Sorularınızı sağlık ekibinize düzenli ve bağlamlı şekilde iletin.",
    benefit: "Lab sonucunu veya ilaç bilgisini mesajınıza ekleyin; doktorunuz bağlamla yanıt versin.",
    safetyNote: "Acil belirtilerde mesaj beklemek yerine 112'yi arayın.",
    iconBg: "bg-medical-50",
    iconColor: "text-medical-600",
    tag: "İletişim",
    tagColor: "bg-medical-50 text-medical-600 border-medical-200",
  },
  {
    icon: Info,
    title: "Genel Bilgi Asistanı",
    description: "Nakil sonrası yaşamla ilgili genel sorularınızı daha anlaşılır hale getirin.",
    benefit: "Doktorunuza soracağınız soruları hazırlayın, konuşma özetini mesaja ekleyin.",
    safetyNote: "Genel bilgilendirme sağlar; tanı koymaz ve ilaç dozu önermez.",
    iconBg: "bg-navy-50",
    iconColor: "text-navy-500",
    tag: "Bilgi",
    tagColor: "bg-navy-50 text-navy-500 border-navy-200",
  },
];

const problems = [
  {
    problem: "İlaç saatlerini kaçırmaktan endişe ediyorum.",
    solution: "İlaç programı, saat ve alındı takibi tek ekranda.",
    icon: Pill,
  },
  {
    problem: "Lab sonuçlarındaki değişimi anlamakta zorlanıyorum.",
    solution: "Kreatinin, eGFR ve diğer değerlerin trend grafikleri.",
    icon: TrendingUp,
  },
  {
    problem: "Hangi durumda doktora yazacağımı bilemiyorum.",
    solution: "Asistan soruyu düzenler, mesajı doğrudan iletebilirsiniz.",
    icon: MessageSquare,
  },
  {
    problem: "Beslenme önerilerini düzenli takip edemiyorum.",
    solution: "Diyetisyen planı öğün bazında, besin değerleriyle görünür.",
    icon: Apple,
  },
];

const roles = [
  {
    icon: HeartPulse,
    title: "Nakil Hastası",
    items: [
      "Günlük ilaç ve randevu takibi",
      "Lab değerlerini düzenli görme",
      "Doktora daha hazırlıklı soru gönderme",
    ],
    cta: "Demo Paneli Gör",
    href: "/dashboard",
    color: "text-navy-600",
    bg: "bg-navy-50",
    borderColor: "border-navy-200",
  },
  {
    icon: Stethoscope,
    title: "Doktor",
    items: [
      "Hastanın ilaç uyumu ve lab trendlerini izleme",
      "Mesajları önceliklendirme",
      "Randevu taleplerini değerlendirme",
    ],
    cta: "Doktor Paneli",
    href: "/doctor",
    color: "text-info-600",
    bg: "bg-info-50",
    borderColor: "border-info-200",
  },
  {
    icon: Apple,
    title: "Diyetisyen",
    items: [
      "Beslenme planı oluşturma",
      "Hasta notlarını izleme",
      "Potasyum, fosfor, sodyum takibini destekleme",
    ],
    cta: "Diyetisyen Paneli",
    href: "/dietitian",
    color: "text-success-600",
    bg: "bg-success-50",
    borderColor: "border-success-200",
  },
  {
    icon: Users,
    title: "Koordinatör",
    items: [
      "Randevu akışını düzenleme",
      "Hasta mesajlarını yönlendirme",
      "Takip sürecini organize etme",
    ],
    cta: "Koordinatör Paneli",
    href: "/coordinator",
    color: "text-warning-600",
    bg: "bg-warning-50",
    borderColor: "border-warning-200",
  },
];

export default function LandingPage() {
  return (
    <>
      <PageTitle title="RenaCare" />
      <div className="min-h-screen bg-bg overflow-x-hidden">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[var(--radius-md)] bg-navy-600 flex items-center justify-center">
                <HeartPulse className="text-white" size={16} />
              </div>
              <span className="font-bold text-lg tracking-tight text-text-primary">RenaCare</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">Özellikler</a>
              <a href="#roles" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">Kimler İçin</a>
              <a href="#clinical-trust" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">Güvenlik</a>
              <div className="flex items-center gap-2 pl-4 border-l border-border">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Giriş Yap</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Başlayın</Button>
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <Link href="/login">
                <Button size="sm">Giriş</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center bg-bg overflow-hidden">
        <div className="absolute inset-0 dot-pattern-light opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-24 pb-16 lg:py-28">

            {/* Left */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 bg-navy-500 rounded-full" />
                <span className="text-xs font-medium text-text-secondary">Nakil Sonrası Hasta Takibi</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-text-primary leading-[1.1] tracking-tight mb-5">
                Böbrek nakli sonrası takibinizi güvenle yönetin
              </h1>

              <p className="text-lg text-text-secondary max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                RenaCare; ilaç saatlerinizi, laboratuvar trendlerinizi, beslenme planınızı ve doktor iletişiminizi hasta dostu bir deneyimde birleştirir.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full">
                    Hesap Oluştur
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    Demo Paneli İncele
                  </Button>
                </Link>
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto lg:mx-0">
                {[
                  { icon: Shield, text: "Veri güvenliği öncelikli" },
                  { icon: UserCheck, text: "Doktor ekibine uyumlu" },
                  { icon: Lock, text: "KVKK farkındalıklı" },
                  { icon: AlertCircle, text: "Tıbbi tavsiye değildir" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-tertiary">
                    <item.icon size={13} className="text-navy-500 flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="hidden lg:block relative">
              <div className="relative bg-surface rounded-[var(--radius-2xl)] border border-border shadow-elevated p-5">
                {/* Preview header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[var(--radius-md)] bg-navy-600 flex items-center justify-center">
                      <HeartPulse className="text-white" size={15} />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Günaydın, Ahmet</p>
                      <p className="text-[11px] text-text-tertiary">Bugünkü takip özeti</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-warning-600 bg-warning-50 border border-warning-200 px-2 py-0.5 rounded-full">Demo</span>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div className="rounded-[var(--radius-lg)] p-3 border border-navy-200 bg-navy-50">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Pill className="text-navy-500" size={13} />
                      <span className="text-[10px] font-semibold text-navy-500/70 uppercase tracking-wide">İlaç</span>
                    </div>
                    <p className="text-xl font-bold text-navy-700">3<span className="text-base text-navy-400">/5</span></p>
                    <p className="text-[11px] text-navy-500 mt-0.5">alındı</p>
                  </div>
                  <div className="rounded-[var(--radius-lg)] p-3 border border-info-200 bg-info-50">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Activity className="text-info-500" size={13} />
                      <span className="text-[10px] font-semibold text-info-600/70 uppercase tracking-wide">Kreatinin</span>
                    </div>
                    <p className="text-xl font-bold text-info-700">1.2</p>
                    <p className="text-[11px] text-info-500 mt-0.5">mg/dL</p>
                  </div>
                </div>

                {/* Next medication */}
                <div className="rounded-[var(--radius-lg)] p-3 border border-border bg-surface-muted mb-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-text-primary">Sıradaki İlaç</p>
                    <span className="text-[10px] font-semibold text-navy-600 bg-navy-100 px-2 py-0.5 rounded-full">20:00</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[var(--radius-md)] bg-navy-100 flex items-center justify-center">
                      <Pill className="text-navy-600" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Tacrolimus 1mg</p>
                      <p className="text-[11px] text-text-tertiary">Aç karnına · Günde 2 kez</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming appointment */}
                <div className="rounded-[var(--radius-lg)] p-3 border border-border bg-surface-muted mb-2.5">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-text-tertiary" size={13} />
                    <p className="text-xs font-medium text-text-secondary">Yaklaşan Randevu</p>
                  </div>
                  <p className="text-sm font-semibold text-text-primary mt-1">Nefroloji Kontrolü</p>
                  <p className="text-[11px] text-text-tertiary">14 Haziran · Dr. Ayşe Kaya</p>
                </div>

                {/* Water */}
                <div className="flex items-center justify-between rounded-[var(--radius-lg)] px-3 py-2.5 border border-border bg-surface-muted">
                  <div className="flex items-center gap-2">
                    <Droplets className="text-medical-500" size={13} />
                    <span className="text-xs text-text-secondary">Su Tüketimi</span>
                  </div>
                  <span className="text-xs font-semibold text-text-primary">5/8 bardak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM / SOLUTION ===== */}
      <section className="py-20 px-4 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">Neden RenaCare?</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-3 tracking-tight">
              Nakil sonrası takip, karmaşık olabilir
            </h2>
            <p className="text-base text-text-secondary max-w-lg mx-auto">
              Her gün hastalar ve sağlık ekibi şu zorluklarla karşılaşıyor.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {problems.map((item, i) => (
              <div key={i} className="bg-bg rounded-[var(--radius-xl)] border border-border p-5 flex gap-4">
                <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-surface border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="text-text-tertiary" size={18} />
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-2 leading-relaxed italic">"{item.problem}"</p>
                  <div className="flex items-start gap-1.5">
                    <Check size={13} className="text-navy-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-text-primary leading-relaxed">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 px-4 bg-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">Özellikler</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-3 tracking-tight">
              Sağlığınız için her şey bir arada
            </h2>
            <p className="text-base text-text-secondary max-w-lg mx-auto">
              Böbrek nakli sonrası ihtiyacınız olan tüm takip araçları tek platformda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-surface rounded-[var(--radius-xl)] p-6 border border-border hover:shadow-card transition-shadow duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-[var(--radius-lg)] ${feature.iconBg} flex items-center justify-center`}>
                    <feature.icon className={feature.iconColor} size={18} />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${feature.tagColor}`}>
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-text-primary mb-1.5">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3 flex-1">{feature.description}</p>

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-start gap-1.5">
                    <Check size={12} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">{feature.benefit}</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Shield size={12} className="text-text-muted flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-muted leading-relaxed">{feature.safetyNote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROLES ===== */}
      <section id="roles" className="py-20 px-4 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">Kimler İçin</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-3 tracking-tight">
              Sağlık ekibinin her üyesi için
            </h2>
            <p className="text-base text-text-secondary max-w-lg mx-auto">
              RenaCare, hasta, doktor, diyetisyen ve koordinatörü aynı platformda buluşturur.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((item, i) => (
              <div
                key={i}
                className={`bg-bg rounded-[var(--radius-xl)] border ${item.borderColor} p-5 flex flex-col`}
              >
                <div className={`w-10 h-10 rounded-[var(--radius-lg)] ${item.bg} flex items-center justify-center mb-3`}>
                  <item.icon className={item.color} size={18} />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">{item.title}</h3>
                <ul className="space-y-1.5 flex-1 mb-4">
                  {item.items.map((li, j) => (
                    <li key={j} className="flex items-start gap-1.5">
                      <Check size={11} className={`${item.color} flex-shrink-0 mt-0.5`} />
                      <span className="text-xs text-text-secondary leading-relaxed">{li}</span>
                    </li>
                  ))}
                </ul>
                <Link href={item.href} className={`text-xs font-semibold ${item.color} hover:opacity-80 inline-flex items-center gap-1 transition-opacity`}>
                  {item.cta}
                  <ArrowRight size={11} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 px-4 bg-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">Başlangıç</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-3 tracking-tight">
              3 adımda takibinizi başlatın
            </h2>
            <p className="text-base text-text-secondary max-w-sm mx-auto">
              Dakikalar içinde ilaç ve sağlık takibinize başlayabilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-5 left-[calc(33.33%+1.5rem)] right-[calc(33.33%+1.5rem)] h-px bg-border" />
            {[
              { num: "01", title: "Hesap oluşturun", desc: "Rolünüzü seçin ve temel sağlık bilgilerinizi girin." },
              { num: "02", title: "İlaçlarınızı ekleyin", desc: "Günlük ilaç programınızı tanımlayın, saatler belirleyin." },
              { num: "03", title: "Takibe başlayın", desc: "Ilaç, lab, beslenme ve iletişimi tek ekranda yönetin." },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-navy-600 flex items-center justify-center text-white text-sm font-bold relative z-10">
                  {step.num}
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1.5">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLINICAL TRUST ===== */}
      <section id="clinical-trust" className="py-20 px-4 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">Klinik Güven</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-3 tracking-tight">
              RenaCare ne yapar, ne yapmaz?
            </h2>
            <p className="text-base text-text-secondary max-w-lg mx-auto">
              Sağlık teknolojisi ürünü olarak sınırlarımız ve sorumluluklarımız hakkında şeffaf olmak önceliğimizdir.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Yapılanlar */}
            <div className="bg-success-50 border border-success-200 rounded-[var(--radius-xl)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="text-success-600" size={18} />
                <h3 className="text-sm font-semibold text-success-800">RenaCare şunları yapar</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  "İlaç saatleri ve alındı durumunu takip etmeye yardımcı olur.",
                  "Laboratuvar sonuçlarınızı kaydeder ve trendleri gösterir.",
                  "Diyetisyen beslenme planınızı görüntüler.",
                  "Sağlık ekibinizle mesajlaşma ve randevu sürecini kolaylaştırır.",
                  "Nakil sonrası yaşam hakkında genel bilgilendirme sağlar.",
                  "Doktorunuza soracağınız soruları düzenlemenize yardımcı olur.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={13} className="text-success-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-success-800 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yapılmayanlar */}
            <div className="bg-danger-50 border border-danger-200 rounded-[var(--radius-xl)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="text-danger-600" size={18} />
                <h3 className="text-sm font-semibold text-danger-800">RenaCare şunları yapmaz</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Doktor yerine geçmez, muayene hizmeti sunmaz.",
                  "İlaç dozu değiştirmez veya öneremez.",
                  "Tıbbi tanı koyamaz veya kesin hüküm veremez.",
                  "Yapay zeka yanıtları tıbbi tavsiye niteliği taşımaz.",
                  "Acil tıbbi karar veremez.",
                  "Doktor veya diyetisyen planlarının yerine geçemez.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <XCircle size={13} className="text-danger-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-danger-800 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency note */}
          <div className="bg-warning-50 border border-warning-200 rounded-[var(--radius-xl)] p-5 flex items-start gap-3">
            <Bell className="text-warning-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-semibold text-warning-800 mb-1">Acil durumlarda 112'yi arayın</p>
              <p className="text-sm text-warning-700 leading-relaxed">
                Göğüs ağrısı, nefes darlığı, bilinç bulanıklığı, ciddi ateş veya ani kötüleşme gibi belirtilerde zaman kaybetmeden acil sağlık hizmetine başvurun. RenaCare bu durumlarda mesaj ve bekleme platformu değildir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 px-4 bg-bg">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-11 h-11 mx-auto mb-5 rounded-[var(--radius-lg)] bg-navy-600 flex items-center justify-center">
            <HeartPulse className="text-white" size={20} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-3 tracking-tight">
            Nakil sonrası takibinizi daha düzenli hale getirin
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto text-sm leading-relaxed">
            İlaç, lab, beslenme ve iletişim süreçlerinizi tek güvenli alanda yönetin. Ücretsiz hesabınızı oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg">
                Hesap Oluştur
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                Demo Paneli İncele
              </Button>
            </Link>
          </div>
          <p className="text-xs text-text-muted mt-6">
            Demo hesabı ile ürünü inceleyebilirsiniz. Gerçek hesapta verileriniz güvenle saklanır.
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border py-8 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[var(--radius-md)] bg-navy-600 flex items-center justify-center">
                <HeartPulse className="text-white" size={13} />
              </div>
              <span className="font-bold text-sm text-text-primary">RenaCare</span>
            </div>
            <div className="flex items-center gap-5 text-xs text-text-tertiary">
              <Link href="/privacy" className="hover:text-text-secondary transition-colors">Gizlilik Politikası</Link>
              <Link href="/terms" className="hover:text-text-secondary transition-colors">Kullanım Şartları</Link>
              <Link href="/contact" className="hover:text-text-secondary transition-colors">İletişim</Link>
            </div>
            <p className="text-xs text-text-tertiary">
              © 2025 RenaCare. Tıbbi tavsiye yerine geçmez.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
