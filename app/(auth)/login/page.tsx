"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  HeartPulse, Mail, Lock, ArrowRight, Shield, Pill,
  Bot, Activity, CheckCircle, TrendingUp, AlertCircle,
} from "lucide-react";
import PageTitle from "@/components/PageTitle";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserRole } from "@/lib/auth-context";

const redirectMap: Record<UserRole, string> = {
  patient: "/dashboard",
  doctor: "/doctor",
  dietitian: "/dietitian",
  coordinator: "/coordinator",
};

const trustPoints = [
  { icon: Shield,       text: "Tıbbi veriler şifrelenmiş iletimle korunur" },
  { icon: CheckCircle,  text: "Doktor onayı olmadan ilaç değişikliği yapılmaz" },
  { icon: Activity,     text: "Lab sonuçları anlık trend analizi ile takip edilir" },
  { icon: Bot,          text: "Yapay zeka tanı koymaz, yalnızca genel bilgi sunar" },
];

const features = [
  { icon: Pill,         label: "İlaç Takibi",       desc: "Düzenli doz kontrolü" },
  { icon: Shield,       label: "Güvenli Veri",       desc: "Verileriniz korunur" },
  { icon: Bot,          label: "Sağlık Asistanı",    desc: "Genel bilgi desteği" },
  { icon: Activity,     label: "Lab Takibi",         desc: "Trend analizi" },
];

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Lütfen e-posta ve şifrenizi girin.");
      return;
    }

    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = credential.user.uid;

      // Fetch role from Firestore
      const snap = await getDoc(doc(db, "users", uid));
      const role: UserRole = snap.exists()
        ? ((snap.data() as { role: UserRole }).role ?? "patient")
        : "patient";

      // Session cookie is set by AuthProvider via onAuthStateChanged,
      // but we set it here too to ensure it exists before redirect
      document.cookie = `renacare-auth=${uid}; path=/; SameSite=Lax; max-age=86400`;

      window.location.href = redirectMap[role];
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("E-posta veya şifre hatalı.");
      } else if (code === "auth/too-many-requests") {
        setError("Çok fazla başarısız deneme. Lütfen bir süre bekleyin.");
      } else if (code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi.");
      } else {
        setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Giriş Yap" />
      <div className="min-h-screen flex bg-bg">
        {/* Left — Form */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md relative">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-navy-600 flex items-center justify-center">
                <HeartPulse className="text-white" size={20} />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-text-primary">RenaCare</span>
                <p className="text-[10px] text-text-tertiary leading-tight -mt-0.5">Nakil Sonrası Takip Platformu</p>
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-text-primary mb-1.5 tracking-tight">
              Tekrar Hoşgeldiniz
            </h1>
            <p className="text-text-secondary mb-8 text-sm">
              Hesabınıza giriş yaparak sağlık takibinize devam edin.
            </p>

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
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-navy-500 focus:ring-navy-500" />
                  Beni hatırla
                </label>
                <a href="#" className="text-sm text-navy-600 hover:text-navy-700 font-semibold transition-colors">
                  Şifremi unuttum?
                </a>
              </div>
              <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
                {!loading && <ArrowRight size={18} />}
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
                { icon: Shield,       label: "Veri Güvenliği Öncelikli" },
                { icon: CheckCircle,  label: "Şifreli Bağlantı" },
                { icon: TrendingUp,   label: "Klinik Takip Prototipi" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-text-tertiary">
                  <badge.icon size={12} />
                  <span className="text-[11px] font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Hero Panel */}
        <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 bg-navy-700">
          <div className="relative z-10 text-center text-white max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-xl)] bg-surface/10 flex items-center justify-center">
              <HeartPulse className="text-white" size={28} />
            </div>
            <h2 className="text-2xl font-semibold mb-3 tracking-tight leading-tight">
              Sağlığınızı Güvenle Takip Edin
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Böbrek nakli sonrası iyileşme sürecinizi doktorunuzla koordineli şekilde yönetin.
            </p>
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
