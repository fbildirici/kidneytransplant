"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { HeartPulse, Mail, Lock, User, ArrowRight, Calendar, AlertCircle, Shield, CheckCircle, Activity, Bot, Info } from "lucide-react";
import PageTitle from "@/components/PageTitle";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    transplantDate: "", bloodGroup: "", doctorName: "", doctorEmail: "",
  });
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === 1) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
        setError("Lütfen tüm alanları doldurun.");
        return;
      }
      if (!form.email.includes("@")) {
        setError("Lütfen geçerli bir e-posta adresi girin.");
        return;
      }
      if (form.password.length < 8) {
        setError("Şifre en az 8 karakter olmalıdır.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Şifreler eşleşmiyor.");
        return;
      }
      if (!kvkkAccepted) {
        setError("Devam etmek için KVKK Aydınlatma Metni'ni kabul etmelisiniz.");
        return;
      }
      setStep(2);
    } else {
      if (!form.transplantDate || !form.bloodGroup || !form.doctorName.trim()) {
        setError("Lütfen gerekli sağlık bilgilerini doldurun.");
        return;
      }
      window.location.href = "/dashboard";
    }
  };

  return (
    <>
      <PageTitle title="Kayıt Ol" />
      <div className="min-h-screen flex">
      {/* Left - Decoration */}
      <div className="hidden lg:flex flex-1 bg-navy-700 items-center justify-center p-12 relative">
        <div className="relative text-center text-white max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-xl)] bg-surface/10 flex items-center justify-center">
            <HeartPulse className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-semibold mb-3 tracking-tight">Yanınızdayız</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Böbrek nakli sonrası sürecinizde doktorunuzla koordineli takip için tasarlandı.
          </p>
          <div className="space-y-3 text-left">
            {[
              { icon: Shield, text: "Tıbbi veriler şifrelenmiş iletimle korunur" },
              { icon: CheckCircle, text: "Doktor onayı olmadan ilaç değişikliği yapılmaz" },
              { icon: Activity, text: "Lab sonuçları anlık trend analizi ile izlenir" },
              { icon: Bot, text: "Yapay zeka tanı koymaz, yalnızca genel bilgi sunar" },
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface/8 rounded-[var(--radius-lg)] p-3">
                <div className="w-8 h-8 rounded-[var(--radius-md)] bg-surface/15 flex items-center justify-center flex-shrink-0">
                  <point.icon size={14} className="text-white/80" />
                </div>
                <p className="text-xs text-white/80 leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-navy-600 flex items-center justify-center">
              <HeartPulse className="text-white" size={20} />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-text-primary">RenaCare</span>
              <p className="text-[10px] text-text-tertiary leading-tight -mt-0.5">Nakil Sonrası Takip Platformu</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1
                    ? "bg-navy-600 text-white"
                    : "bg-surface-muted text-text-tertiary"
                }`}
              >
                1
              </div>
              <span className="text-sm text-text-secondary">Hesap</span>
            </div>
            <div className="flex-1 h-0.5 bg-border rounded">
              <div
                className={`h-full bg-navy-600 rounded transition-all ${step >= 2 ? "w-full" : "w-0"}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2
                    ? "bg-navy-600 text-white"
                    : "bg-surface-muted text-text-tertiary"
                }`}
              >
                2
              </div>
              <span className="text-sm text-text-secondary">Sağlık</span>
            </div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-semibold text-text-primary mb-2">
                Hesap Oluşturun
              </h1>
              <p className="text-text-secondary mb-8 text-sm">
                Sağlık takibinize başlamak için bilgilerinizi girin.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ad"
                    placeholder="Ahmet"
                    icon={<User size={18} />}
                    value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                  />
                  <Input
                    label="Soyad"
                    placeholder="Yılmaz"
                    value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                  />
                </div>
                <Input
                  label="E-posta"
                  type="email"
                  placeholder="ornek@email.com"
                  icon={<Mail size={18} />}
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
                <Input
                  label="Şifre"
                  type="password"
                  placeholder="En az 8 karakter"
                  icon={<Lock size={18} />}
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                />
                <Input
                  label="Şifre Tekrar"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  icon={<Lock size={18} />}
                  value={form.confirmPassword}
                  onChange={(e) => updateForm("confirmPassword", e.target.value)}
                />
                <label className="flex items-start gap-2.5 text-sm text-text-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={kvkkAccepted}
                    onChange={(e) => { setKvkkAccepted(e.target.checked); setError(""); }}
                    className="w-4 h-4 mt-0.5 rounded border-border text-navy-600 focus:ring-navy-500"
                  />
                  <span className="text-xs leading-relaxed">
                    <Link href="/privacy" className="text-navy-600 hover:text-navy-700 font-semibold underline">KVKK Aydınlatma Metni</Link>'ni okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
                  </span>
                </label>
                <Button type="submit" className="w-full" size="lg">
                  Devam Et
                  <ArrowRight size={18} />
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-text-primary mb-2">
                Sağlık Bilgileriniz
              </h1>
              <p className="text-text-secondary mb-5 text-sm">
                Size uygun takip deneyimi oluşturmak için kullanılır.
              </p>

              <div className="flex items-start gap-2 bg-info-50 border border-info-200 rounded-[var(--radius-xl)] px-4 py-3 mb-5">
                <Info size={14} className="text-info-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-info-700 leading-relaxed">
                  Bu bilgiler yalnızca sizinle ve sağlık ekibinizle paylaşılır. Üçüncü taraflara satılmaz.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {error}
                  </div>
                )}
                <Input
                  label="Nakil Tarihi"
                  type="date"
                  icon={<Calendar size={18} />}
                  value={form.transplantDate}
                  onChange={(e) => updateForm("transplantDate", e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-secondary">
                    Kan Grubu
                  </label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => updateForm("bloodGroup", e.target.value)}
                    className="w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary transition-all duration-200 focus:outline-none focus:ring-[3px] focus:ring-navy-500/15 focus:border-navy-400 hover:border-border-strong"
                  >
                    <option value="">Seçin</option>
                    <option>A Rh+</option>
                    <option>A Rh-</option>
                    <option>B Rh+</option>
                    <option>B Rh-</option>
                    <option>AB Rh+</option>
                    <option>AB Rh-</option>
                    <option>0 Rh+</option>
                    <option>0 Rh-</option>
                  </select>
                </div>
                <Input
                  label="Doktor Adı"
                  placeholder="Dr. Ayşe Kaya"
                  icon={<User size={18} />}
                  value={form.doctorName}
                  onChange={(e) => updateForm("doctorName", e.target.value)}
                />
                <Input
                  label="Doktor E-posta"
                  type="email"
                  placeholder="doktor@hastane.com"
                  icon={<Mail size={18} />}
                  value={form.doctorEmail}
                  onChange={(e) => updateForm("doctorEmail", e.target.value)}
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setStep(1); setError(""); }}
                  >
                    Geri
                  </Button>
                  <Button type="submit" className="flex-1" size="lg">
                    Kayıt Ol
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </form>
            </>
          )}

          <p className="text-center text-sm text-text-secondary mt-6">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="text-navy-600 hover:text-navy-700 font-semibold"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
