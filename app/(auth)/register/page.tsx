"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { HeartPulse, Mail, Lock, User, ArrowRight, Calendar } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-navy-500 via-navy-400 to-teal-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative text-center text-white max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <HeartPulse className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tight">Yanınızdayız</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Böbrek nakli sonrası sürecinizde size destek olmak için buradayız.
            Hemen kayıt olun ve sağlık yolculuğunuza başlayın.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {[
              "İlaç Hatırlatma",
              "AI Asistan",
              "Beslenme Rehberi",
              "Doktor İletişimi",
            ].map((feature) => (
              <div
                key={feature}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 text-white/80 font-medium"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center shadow-lg shadow-navy-500/20">
              <HeartPulse className="text-white" size={22} />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              <span className="text-navy-500">Rena</span>
              <span className="text-teal-600">Care</span>
            </span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1
                    ? "bg-navy-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                1
              </div>
              <span className="text-sm text-slate-600">Hesap</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 rounded">
              <div
                className={`h-full bg-gradient-to-r from-navy-500 to-teal-500 rounded transition-all ${step >= 2 ? "w-full" : "w-0"}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2
                    ? "bg-navy-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                2
              </div>
              <span className="text-sm text-slate-600">Sağlık</span>
            </div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Hesap Oluşturun
              </h1>
              <p className="text-slate-500 mb-8">
                Sağlık takibinize başlamak için bilgilerinizi girin.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ad"
                    placeholder="Ahmet"
                    icon={<User size={18} />}
                  />
                  <Input label="Soyad" placeholder="Yılmaz" />
                </div>
                <Input
                  label="E-posta"
                  type="email"
                  placeholder="ornek@email.com"
                  icon={<Mail size={18} />}
                />
                <Input
                  label="Şifre"
                  type="password"
                  placeholder="En az 8 karakter"
                  icon={<Lock size={18} />}
                />
                <Input
                  label="Şifre Tekrar"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  icon={<Lock size={18} />}
                />
                <Button type="submit" className="w-full" size="lg">
                  Devam Et
                  <ArrowRight size={18} />
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Sağlık Bilgileriniz
              </h1>
              <p className="text-slate-500 mb-8">
                Size daha iyi hizmet verebilmemiz için sağlık bilgilerinizi
                paylaşın.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nakil Tarihi"
                  type="date"
                  icon={<Calendar size={18} />}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Kan Grubu
                  </label>
                  <select className="modern-field modern-select w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-400">
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
                />
                <Input
                  label="Doktor E-posta"
                  type="email"
                  placeholder="doktor@hastane.com"
                  icon={<Mail size={18} />}
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
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

          <p className="text-center text-sm text-slate-500 mt-6">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="text-navy-500 hover:text-navy-600 font-semibold"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
