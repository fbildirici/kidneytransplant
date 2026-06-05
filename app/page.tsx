"use client";
import Link from "next/link";
import {
  Pill,
  Apple,
  Bot,
  MessageSquare,
  ArrowRight,
  Shield,
  Activity,
  ChevronRight,
  Stethoscope,
  HeartPulse,
  Sparkles,
  Check,
  Star,
  Users,
  Zap,
  TrendingUp,
  Droplets,
  Bell,
} from "lucide-react";
import Button from "@/components/ui/Button";

const features = [
  {
    icon: Pill,
    title: "Akıllı İlaç Takibi",
    description:
      "Günlük ilaç programınızı yönetin, hatırlatmalar alın ve uyum istatistiklerinizi takip edin.",
    accentColor: "border-navy-500",
    iconBg: "bg-navy-50",
    iconColor: "text-navy-500",
    cornerGrad: "from-navy-500 to-blue-400",
    tag: "Temel",
    tagColor: "bg-navy-50 text-navy-500",
  },
  {
    icon: Apple,
    title: "Kişisel Beslenme Rehberi",
    description:
      "Böbrek nakli sonrası beslenme programınız. Potasyum, fosfor ve sodyum takibi.",
    accentColor: "border-teal-500",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    cornerGrad: "from-teal-500 to-emerald-400",
    tag: "Beslenme",
    tagColor: "bg-teal-50 text-teal-600",
  },
  {
    icon: Bot,
    title: "AI Sağlık Asistanı",
    description:
      "7/24 yapay zeka destekli asistanınız. Sorularınıza anında, güvenilir yanıtlar.",
    accentColor: "border-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    cornerGrad: "from-emerald-500 to-teal-400",
    tag: "Yapay Zeka",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: MessageSquare,
    title: "Doktor İletişim Hattı",
    description:
      "Endişelerinizi doktorunuza iletin. AI yanıtlarını paylaşın, hızlı geri dönüş alın.",
    accentColor: "border-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    cornerGrad: "from-violet-500 to-purple-400",
    tag: "İletişim",
    tagColor: "bg-violet-50 text-violet-600",
  },
];

const stats = [
  { value: "7/24", label: "AI Destek", icon: Zap, color: "text-teal-500", bg: "bg-teal-50" },
  { value: "%99", label: "İlaç Uyumu", icon: Shield, color: "text-navy-500", bg: "bg-navy-50" },
  { value: "500+", label: "Aktif Hasta", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "50+", label: "Uzman Doktor", icon: Stethoscope, color: "text-violet-600", bg: "bg-violet-50" },
];

const testimonials = [
  {
    name: "Ayşe K.",
    role: "Nakil Hastası · 2 yıl",
    text: "İlaçlarımı artık hiç unutmuyorum. AI asistan sayesinde aklıma takılan soruları anında sorabiliyorum.",
    rating: 5,
    initials: "AK",
    avatarGrad: "from-navy-500 to-teal-500",
  },
  {
    name: "Mehmet D.",
    role: "Nakil Hastası · 6 ay",
    text: "Beslenme rehberi hayatımı değiştirdi. Neyi yiyip neyi yiyemeyeceğimi artık net bir şekilde biliyorum.",
    rating: 5,
    initials: "MD",
    avatarGrad: "from-teal-500 to-emerald-500",
  },
  {
    name: "Dr. Fatma Y.",
    role: "Nefroloji Uzmanı",
    text: "Hastalarımın ilaç uyumunu takip etmem çok kolaylaştı. Mesajlaşma sistemi oldukça kullanışlı.",
    rating: 5,
    initials: "FY",
    avatarGrad: "from-violet-500 to-navy-500",
  },
];

const steps = [
  {
    num: "01",
    title: "Kayıt Olun",
    desc: "Sağlık bilgilerinizi girin ve kişisel hesabınızı dakikalar içinde oluşturun.",
    icon: Shield,
    bg: "bg-navy-500",
    shadow: "shadow-navy-500/30",
  },
  {
    num: "02",
    title: "İlaçlarınızı Ekleyin",
    desc: "Günlük ilaç programınızı sisteme kolayca tanımlayın, hatırlatmalar ayarlayın.",
    icon: Pill,
    bg: "bg-teal-500",
    shadow: "shadow-teal-500/30",
  },
  {
    num: "03",
    title: "Takibe Başlayın",
    desc: "AI asistan ve beslenme rehberiyle sağlığınızı güvenle yönetin.",
    icon: Activity,
    bg: "bg-emerald-500",
    shadow: "shadow-emerald-500/30",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center shadow-lg shadow-navy-500/25">
                <HeartPulse className="text-white" size={18} />
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                <span className="text-navy-500">Rena</span>
                <span className="text-teal-600">Care</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-500 hover:text-navy-600 transition-colors duration-200">
                Özellikler
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-navy-600 transition-colors duration-200">
                Nasıl Çalışır
              </a>
              <a href="#testimonials" className="text-sm font-medium text-slate-500 hover:text-navy-600 transition-colors duration-200">
                Referanslar
              </a>
              <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Giriş Yap</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Başlayın
                    <ArrowRight size={15} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <Link href="/login">
                <Button size="sm">Giriş</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO - DARK GRADIENT ===== */}
      <section className="relative min-h-screen hero-dark flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 mesh-gradient-dark" />
        <div className="absolute inset-0 dot-pattern-light opacity-25" />

        {/* Glowing orbs */}
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-navy-700/25 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-600/12 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-24 pb-16 lg:py-28">

            {/* Left - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 glass-teal rounded-full px-4 py-2 mb-8 animate-slide-up">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-gentle-pulse" />
                <Sparkles size={13} className="text-teal-400" />
                <span className="text-sm font-semibold text-teal-300">AI Destekli Sağlık Platformu</span>
              </div>

              {/* Headline */}
              <h1
                className="text-5xl sm:text-6xl lg:text-[4.25rem] font-black text-white leading-[1.06] tracking-tight mb-6 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                Böbrek Nakli
                <br />
                Sonrası Yeni
                <br />
                <span className="gradient-text-light">Yaşamınız</span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-lg text-white/55 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                İlaç takibi, kişiselleştirilmiş beslenme rehberi ve yapay zeka
                destekli asistanınız ile sağlık yolculuğunuzda her zaman yanınızdayız.
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full shadow-2xl shadow-teal-500/20">
                    Ücretsiz Başlayın
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 text-white font-semibold text-base hover:bg-white/10 hover:border-white/35 transition-all duration-300">
                    Demo İncele
                    <ChevronRight size={18} />
                  </button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div
                className="flex items-center justify-center lg:justify-start gap-6 text-sm text-white/40 animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                {["Ücretsiz", "Veri Güvenliği Öncelikli", "7/24 Destek"].map((label, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check size={14} className="text-teal-400" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Dashboard Preview Card */}
            <div
              className="hidden lg:block relative animate-scale-in"
              style={{ animationDelay: "0.5s" }}
            >
              {/* Main preview card */}
              <div className="relative glass-card rounded-3xl p-6 shadow-2xl glow-white">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center shadow-lg shadow-navy-900/30">
                      <HeartPulse className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Günaydın, Ahmet!</p>
                      <p className="text-[11px] text-white/45">Bugünkü sağlık özetiniz</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-2 rounded-xl bg-white/10 text-white/50 hover:bg-white/20 transition-colors">
                      <Bell size={17} />
                    </button>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border border-[#001640]" />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(0,48,128,0.3)" }}>
                    <Pill className="text-blue-300 mb-2" size={17} />
                    <p className="text-2xl font-black text-white">3/5</p>
                    <p className="text-[11px] text-white/45 mt-0.5">İlaç Alındı</p>
                    <div className="mt-2.5 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full" />
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(13,148,136,0.22)" }}>
                    <Activity className="text-teal-300 mb-2" size={17} />
                    <p className="text-2xl font-black text-white">92</p>
                    <p className="text-[11px] text-white/45 mt-0.5">Sağlık Skoru</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp size={11} className="text-teal-400" />
                      <span className="text-[11px] text-teal-300 font-medium">+3 bu hafta</span>
                    </div>
                  </div>
                </div>

                {/* Medication reminder */}
                <div className="rounded-2xl p-4 border border-white/10 mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">Sıradaki İlaç</p>
                    <span className="text-[11px] font-semibold text-teal-300 bg-teal-500/20 px-2.5 py-1 rounded-full">15 dk sonra</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/25">
                      <Pill className="text-emerald-400" size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Tacrolimus 2mg</p>
                      <p className="text-[11px] text-white/40">Aç karnına alınmalı</p>
                    </div>
                  </div>
                </div>

                {/* Water bar */}
                <div className="flex items-center justify-between rounded-xl px-4 py-3 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="flex items-center gap-2">
                    <Droplets className="text-cyan-400" size={15} />
                    <span className="text-xs text-white/55">Su Tüketimi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-4 rounded-sm transition-all ${i <= 5 ? "bg-cyan-400" : "bg-white/12"}`}
                      />
                    ))}
                    <span className="text-[11px] text-white/35 ml-1.5">5/8</span>
                  </div>
                </div>
              </div>

              {/* Floating AI badge */}
              <div
                className="absolute -bottom-6 -left-8 glass-card rounded-2xl border border-white/15 p-3.5 animate-float shadow-2xl"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                    <Bot className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">AI Asistan</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-gentle-pulse" />
                      <p className="text-[10px] text-emerald-400 font-medium">Çevrimiçi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating check badge */}
              <div
                className="absolute -top-5 -right-5 glass-card rounded-2xl border border-white/15 px-4 py-3 animate-float-alt shadow-2xl"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="text-white" size={12} />
                  </div>
                  <span className="text-xs font-semibold text-white">İlaç alındı!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/[0.03] to-transparent" />
      </section>

      {/* ===== STATS - WHITE SECTION ===== */}
      <section className="bg-white py-20 relative">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-4 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-tag mb-4">
              <Sparkles size={13} />
              Kapsamlı Özellikler
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Sağlığınız İçin{" "}
              <span className="gradient-text">Her Şey Bir Arada</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Böbrek nakli sonrası ihtiyacınız olan tüm araçlar tek bir platformda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`group bg-white rounded-2xl p-8 border-t-[3px] ${feature.accentColor} shadow-sm card-hover relative overflow-hidden border border-slate-100/80`}
              >
                {/* Corner accent */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${feature.cornerGrad} opacity-[0.04] rounded-bl-[100px] transition-all duration-500 group-hover:opacity-[0.08] group-hover:w-44 group-hover:h-44`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-slate-100`}
                    >
                      <feature.icon className={feature.iconColor} size={26} />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${feature.tagColor}`}>
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-5">{feature.description}</p>

                  <div
                    className={`flex items-center gap-1.5 font-semibold text-sm transition-all duration-200 group-hover:gap-2.5 ${feature.iconColor}`}
                  >
                    <span>Keşfet</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-4 bg-white relative">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-tag-navy mb-4">
              <Zap size={13} />
              Kolay Başlangıç
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              <span className="gradient-text">3 Adımda</span> Başlayın
            </h2>
            <p className="text-lg text-slate-500">
              Dakikalar içinde sağlık takibinize başlayabilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-14 left-[calc(33.33%+2.5rem)] right-[calc(33.33%+2.5rem)] h-0.5 bg-gradient-to-r from-navy-200 via-teal-200 to-emerald-200" />

            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div
                  className={`w-28 h-28 mx-auto mb-6 rounded-3xl ${step.bg} shadow-xl ${step.shadow} flex items-center justify-center relative overflow-hidden`}
                >
                  <span className="absolute text-6xl font-black text-white/10 top-1 right-2 leading-none select-none">
                    {step.num}
                  </span>
                  <step.icon className="text-white relative z-10" size={34} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-24 px-4 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Kullanıcılarımız{" "}
              <span className="gradient-text">Ne Diyor?</span>
            </h2>
            <p className="text-lg text-slate-500">Gerçek kullanıcıların gerçek deneyimleri.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm card-hover relative overflow-hidden"
              >
                {/* Large quote mark */}
                <div className="text-8xl font-black text-slate-100 leading-none -mt-3 mb-2 select-none font-serif">
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4 -mt-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 text-[0.9375rem]">{t.text}</p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarGrad} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="hero-dark rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient-dark" />
            <div className="absolute inset-0 dot-pattern-light opacity-10" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-navy-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl glass-card border border-white/20 flex items-center justify-center">
                <HeartPulse className="text-white" size={32} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Sağlık Yolculuğunuza
                <br />
                Bugün Başlayın
              </h2>
              <p className="text-white/55 text-lg mb-8 max-w-md mx-auto">
                Ücretsiz hesabınızı oluşturun ve böbrek sağlığınızı profesyonel
                destek ile kontrol altına alın.
              </p>
              <Link href="/register">
                <button className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-navy-700 font-bold text-base hover:bg-white/93 transition-all duration-300 shadow-2xl shadow-navy-900/25">
                  Ücretsiz Kayıt Ol
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-100 py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center">
                <HeartPulse className="text-white" size={15} />
              </div>
              <span className="font-extrabold text-lg">
                <span className="text-navy-500">Rena</span>
                <span className="text-teal-600">Care</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="hover:text-navy-500 transition-colors cursor-pointer">Gizlilik Politikası (yakında)</span>
              <span className="hover:text-navy-500 transition-colors cursor-pointer">Kullanım Şartları (yakında)</span>
              <span className="hover:text-navy-500 transition-colors cursor-pointer">İletişim</span>
            </div>
            <p className="text-sm text-slate-400">
              © 2025 RenaCare. Tıbbi tavsiye yerine geçmez. KVKK ve GDPR bilinciyle geliştirilmektedir.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
