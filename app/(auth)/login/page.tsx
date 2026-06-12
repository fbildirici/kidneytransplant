"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { HeartPulse, Mail, Lock, ArrowRight, Shield, Pill, Bot, User, Stethoscope, Apple, Activity, CheckCircle, TrendingUp, CalendarCheck2, AlertCircle, Info } from "lucide-react";
import PageTitle from "@/components/PageTitle";

type Role = "patient" | "doctor" | "dietitian" | "coordinator";

const roles: { id: Role; label: string; desc: string; icon: React.ElementType; activeClasses: string }[] = [
  {
    id: "patient",
    label: "Hasta",
    desc: "Böbrek nakil hastası",
    icon: User,
    activeClasses: "border-navy-400 bg-navy-50 text-navy-700",
  },
  {
    id: "doctor",
    label: "Doktor",
    desc: "Nefrolog / Nakil hekimi",
    icon: Stethoscope,
    activeClasses: "border-navy-400 bg-navy-50 text-navy-700",
  },
  {
    id: "dietitian",
    label: "Diyetisyen",
    desc: "Beslenme uzmanı",
    icon: Apple,
    activeClasses: "border-navy-400 bg-navy-50 text-navy-700",
  },
  {
    id: "coordinator",
    label: "Koordinatör",
    desc: "Onay ve akış yönetimi",
    icon: CalendarCheck2,
    activeClasses: "border-navy-400 bg-navy-50 text-navy-700",
  },
];

const redirectMap: Record<Role, string> = {
  patient: "/dashboard",
  doctor: "/doctor",
  dietitian: "/dietitian",
  coordinator: "/coordinator",
};

const trustPoints = [
  { icon: Shield, text: "Tıbbi veriler şifrelenmiş iletimle korunur" },
  { icon: CheckCircle, text: "Doktor onayı olmadan ilaç değişikliği yapılmaz" },
  { icon: Activity, text: "Lab sonuçları anlık trend analizi ile takip edilir" },
  { icon: Bot, text: "Yapay zeka tanı koymaz, yalnızca genel bilgi sunar" },
];

const features = [
  { icon: Pill, label: "İlaç Takibi", desc: "Düzenli doz kontrolü" },
  { icon: Shield, label: "Güvenli Veri", desc: "Verileriniz korunur" },
  { icon: Bot, label: "Sağlık Asistanı", desc: "Genel bilgi desteği" },
  { icon: Activity, label: "Lab Takibi", desc: "Trend analizi" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("patient");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Lütfen e-posta ve şifrenizi girin.");
      return;
    }
    if (!email.includes("@")) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    window.location.href = redirectMap[selectedRole];
  };

  const handleDemo = () => {
    setEmail("demo@renacare.com");
    setPassword("Demo1234");
    setError("");
    window.location.href = redirectMap[selectedRole];
  };

  const demoRoleLabel: Record<Role, string> = {
    patient: "Hasta Panelini İncele",
    doctor: "Doktor Panelini İncele",
    dietitian: "Diyetisyen Panelini İncele",
    coordinator: "Koordinatör Panelini İncele",
  };

  return (
    <>
      <PageTitle title="Giriş Yap" />
      <div className="min-h-screen flex bg-bg">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md relative">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-navy-600 flex items-center justify-center">
              <HeartPulse className="text-white" size={20} />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-text-primary">
                RenaCare
              </span>
              <p className="text-[10px] text-text-tertiary leading-tight -mt-0.5">Nakil Sonrası Takip Platformu</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-text-primary mb-1.5 tracking-tight">
            Tekrar Hoşgeldiniz
          </h1>
          <p className="text-text-secondary mb-8 text-sm">
            Hesabınıza giriş yaparak sağlık takibinize devam edin.
          </p>

          {/* Role Selection */}
          <div className="mb-7">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Rolünüzü seçin</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-[var(--radius-xl)] border-2 transition-all duration-200 cursor-pointer group ${
                    selectedRole === role.id
                      ? role.activeClasses
                      : "border-border bg-surface text-text-secondary hover:border-border-hover hover:bg-surface-muted"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-[var(--radius-lg)] flex items-center justify-center transition-colors ${
                    selectedRole === role.id ? "bg-surface/60" : "bg-surface-muted group-hover:bg-surface-muted"
                  }`}>
                    <role.icon size={18} />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold leading-tight block">{role.label}</span>
                    <span className="text-[10px] text-text-tertiary leading-tight">{role.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Access Card */}
          <div className="mb-6 bg-info-50 border border-info-200 rounded-[var(--radius-xl)] p-4">
            <div className="flex items-start gap-3">
              <Info size={15} className="text-info-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-info-800 mb-1">Demo Hesabı</p>
                <p className="text-xs text-info-700 leading-relaxed mb-3">
                  Bu platform prototip/demo aşamasındadır; gerçek hasta verisi içermez.
                  Üstten rol seçip aşağıdaki butonla doğrudan inceleyebilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={handleDemo}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-info-700 bg-info-100 hover:bg-info-200 border border-info-300 px-3 py-1.5 rounded-[var(--radius-md)] transition-colors cursor-pointer"
                >
                  <ArrowRight size={12} />
                  {demoRoleLabel[selectedRole]}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}
            <Input
              label="E-posta"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              icon={<Mail size={18} />}
              error={error && !email.trim() ? "E-posta gerekli" : undefined}
            />
            <Input
              label="Şifre"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              icon={<Lock size={18} />}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-navy-500 focus:ring-navy-500"
                />
                Beni hatırla
              </label>
              <a href="#" className="text-sm text-navy-600 hover:text-navy-700 font-semibold transition-colors">
                Şifremi unuttum?
              </a>
            </div>
            <Button type="submit" className="w-full mt-2" size="lg">
              Giriş Yap
              <ArrowRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-navy-600 hover:text-navy-700 font-semibold transition-colors">
              Ücretsiz Kayıt Ol
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-8 pt-6 border-t border-border">
            {[
              { icon: Shield, label: "Veri Güvenliği Öncelikli" },
              { icon: CheckCircle, label: "Şifreli Bağlantı" },
              { icon: TrendingUp, label: "Klinik Takip Prototipi" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-text-tertiary">
                <badge.icon size={12} />
                <span className="text-[11px] font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Hero Panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 bg-navy-700">
        <div className="relative z-10 text-center text-white max-w-md">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-xl)] bg-surface/10 flex items-center justify-center">
            <HeartPulse className="text-white" size={28} />
          </div>

          <h2 className="text-2xl font-semibold mb-3 tracking-tight leading-tight">
            Sağlığınızı Güvenle Takip Edin
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Böbrek nakli sonrası iyileşme sürecinizi doktorunuzla koordineli şekilde yönetin.
          </p>

          {/* Trust points */}
          <div className="space-y-3 mb-8 text-left">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface/8 rounded-[var(--radius-lg)] p-3">
                <div className="w-8 h-8 rounded-[var(--radius-md)] bg-surface/15 flex items-center justify-center flex-shrink-0">
                  <point.icon size={14} className="text-white/80" />
                </div>
                <p className="text-xs text-white/80 leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface/8 rounded-[var(--radius-lg)] p-3 text-left">
                <div className="w-8 h-8 rounded-[var(--radius-md)] bg-surface/15 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={14} className="text-white/80" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/90 leading-tight">{feature.label}</p>
                  <p className="text-[10px] text-white/50 leading-tight mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
