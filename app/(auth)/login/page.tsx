"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { HeartPulse, Mail, Lock, ArrowRight, Shield, Pill, Bot, User, Stethoscope, Apple, Activity, CheckCircle, TrendingUp, CalendarCheck2 } from "lucide-react";

type Role = "patient" | "doctor" | "dietitian" | "coordinator";

const roles: { id: Role; label: string; desc: string; icon: React.ElementType; activeClasses: string }[] = [
  {
    id: "patient",
    label: "Hasta",
    desc: "Böbrek nakil hastası",
    icon: User,
    activeClasses: "border-navy-400 bg-navy-50 text-navy-700 shadow-sm shadow-navy-100",
  },
  {
    id: "doctor",
    label: "Doktor",
    desc: "Nefrolog / Nakil hekimi",
    icon: Stethoscope,
    activeClasses: "border-teal-400 bg-teal-50 text-teal-700 shadow-sm shadow-teal-100",
  },
  {
    id: "dietitian",
    label: "Diyetisyen",
    desc: "Beslenme uzmanı",
    icon: Apple,
    activeClasses: "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100",
  },
  {
    id: "coordinator",
    label: "Koordinatör",
    desc: "Onay ve akış yönetimi",
    icon: CalendarCheck2,
    activeClasses: "border-cyan-400 bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-100",
  },
];

const redirectMap: Record<Role, string> = {
  patient: "/dashboard",
  doctor: "/doctor",
  dietitian: "/dietitian",
  coordinator: "/coordinator",
};

const stats = [
  { value: "94%", label: "İlaç Uyum Oranı" },
  { value: "12", label: "Gün Serisi" },
  { value: "3", label: "Aktif Doktor" },
];

const features = [
  { icon: Pill, label: "Akıllı İlaç Takibi", desc: "Hiçbir dozu kaçırmayın" },
  { icon: Shield, label: "Güvenli & Şifreli", desc: "Verileriniz korunur" },
  { icon: Bot, label: "AI Sağlık Asistanı", desc: "7/24 destek" },
  { icon: Activity, label: "Lab Takibi", desc: "Anlık sonuçlar" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("patient");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = redirectMap[selectedRole];
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-navy-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-50 rounded-full blur-3xl opacity-40" />

        <div className="w-full max-w-md relative">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center shadow-lg shadow-navy-500/25">
              <HeartPulse className="text-white" size={22} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight">
                <span className="text-navy-500">Rena</span>
                <span className="text-teal-600">Care</span>
              </span>
              <p className="text-[10px] text-slate-400 leading-tight -mt-0.5">Böbrek Sağlığı Platformu</p>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-1.5 tracking-tight">
            Tekrar Hoşgeldiniz
          </h1>
          <p className="text-slate-500 mb-8 text-sm">
            Hesabınıza giriş yaparak sağlık takibinize devam edin.
          </p>

          {/* Role Selection */}
          <div className="mb-7">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Rolünüzü seçin</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
                    selectedRole === role.id
                      ? role.activeClasses
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    selectedRole === role.id ? "bg-white/60" : "bg-slate-100 group-hover:bg-slate-200"
                  }`}>
                    <role.icon size={18} />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold leading-tight block">{role.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{role.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-posta"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
            />
            <Input
              label="Şifre"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-navy-500 focus:ring-navy-400"
                />
                Beni hatırla
              </label>
              <a href="#" className="text-sm text-navy-500 hover:text-navy-700 font-semibold transition-colors">
                Şifremi unuttum?
              </a>
            </div>
            <Button type="submit" className="w-full mt-2" size="lg">
              Giriş Yap
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">veya</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-navy-500 hover:text-navy-700 font-semibold transition-colors">
              Ücretsiz Kayıt Ol
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-8 pt-6 border-t border-slate-100">
            {[
              { icon: Shield, label: "Veri Güvenliği Öncelikli" },
              { icon: CheckCircle, label: "Şifreli Bağlantı" },
              { icon: TrendingUp, label: "Araştırma Prototipi" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-400">
                <badge.icon size={12} />
                <span className="text-[11px] font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Hero Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-600 via-navy-500 to-teal-600" />
        <div className="absolute inset-0 dot-pattern-light opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy-800/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 text-center text-white max-w-md">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
            <HeartPulse className="text-white" size={38} />
          </div>

          <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">
            Sağlığınızı Kontrol<br />Altında Tutun
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-10">
            Böbrek nakli sonrası iyileşme sürecinizi profesyonel<br />
            takip sistemiyle yönetin.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-white/60 font-medium mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl p-3.5 text-left">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={16} className="text-white/80" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/90 leading-tight">{feature.label}</p>
                  <p className="text-[11px] text-white/50 leading-tight mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
