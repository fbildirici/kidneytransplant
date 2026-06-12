"use client";
import Link from "next/link";
import { HeartPulse, ArrowLeft, FileText } from "lucide-react";
import PageTitle from "@/components/PageTitle";

export default function TermsPage() {
  return (
    <>
      <PageTitle title="Kullanım Şartları — RenaCare" />
      <div className="min-h-screen bg-bg">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[var(--radius-md)] bg-navy-600 flex items-center justify-center">
                  <HeartPulse className="text-white" size={14} />
                </div>
                <span className="font-bold text-base tracking-tight text-text-primary">RenaCare</span>
              </Link>
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                <ArrowLeft size={15} />
                Ana Sayfa
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-navy-50 flex items-center justify-center mb-4">
              <FileText className="text-navy-600" size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary mb-2 tracking-tight">Kullanım Şartları</h1>
            <p className="text-text-secondary text-sm">Son güncelleme: Haziran 2025</p>
          </div>

          <div className="bg-danger-50 border border-danger-200 rounded-[var(--radius-xl)] p-5 mb-8">
            <p className="text-sm text-danger-700 leading-relaxed font-medium">
              Önemli: RenaCare bir sağlık bilgi ve takip platformudur. Tıbbi tavsiye vermez, tanı koymaz ve doktor önerilerinin yerine geçmez.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "1. Hizmetin Niteliği",
                content: `RenaCare, böbrek nakli sonrası hastaların ilaç, laboratuvar, beslenme ve randevu takibini kolaylaştırmak amacıyla tasarlanmış dijital bir sağlık takip platformudur.

Platform şunları yapmaz:
• Tıbbi tanı koymaz
• İlaç dozu önermez veya değiştirmez
• Doktor muayenesinin veya tedavisinin yerini tutmaz
• Yapay zeka yanıtları tıbbi tavsiye niteliği taşımaz`,
              },
              {
                title: "2. Kullanıcı Sorumluluğu",
                content: `Platformu kullanarak aşağıdakileri kabul etmiş sayılırsınız:

• Sağlık kararlarınızı doktorunuzla birlikte verirsiniz
• Acil durumlarda 112'yi arayar veya en yakın acil servise başvurursunuz
• Paylaştığınız bilgilerin doğruluğundan siz sorumlusunuzdur
• Platform bilgilerini profesyonel tıbbi tavsiye olarak yorumlamazsınız`,
              },
              {
                title: "3. Demo / Prototip Durumu",
                content: `Bu platform mevcut durumda prototip/demo aşamasındadır.

• Bazı ekranlardaki veriler örnek niteliğindedir
• Özellikler değişebilir veya geliştirilebilir
• Üretim ortamında ek güvenlik ve gizlilik önlemleri uygulanacaktır`,
              },
              {
                title: "4. Sorumluluk Sınırı",
                content: `RenaCare, platformun kullanımından kaynaklanabilecek tıbbi sonuçlardan sorumlu tutulamaz.

Platform bir yardımcı araçtır. Tüm sağlık kararları nitelikli sağlık profesyonelleri tarafından verilmelidir.`,
              },
            ].map((section, i) => (
              <div key={i} className="bg-surface rounded-[var(--radius-xl)] border border-border p-6">
                <h2 className="text-sm font-semibold text-text-primary mb-3">{section.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
