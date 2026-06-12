"use client";
import Link from "next/link";
import { HeartPulse, ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import PageTitle from "@/components/PageTitle";

export default function PrivacyPage() {
  return (
    <>
      <PageTitle title="Gizlilik Politikası — RenaCare" />
      <div className="min-h-screen bg-bg">
        {/* Navbar */}
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
              <Shield className="text-navy-600" size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary mb-2 tracking-tight">Gizlilik Politikası</h1>
            <p className="text-text-secondary text-sm">Son güncelleme: Haziran 2025</p>
          </div>

          <div className="bg-info-50 border border-info-200 rounded-[var(--radius-xl)] p-5 mb-8">
            <p className="text-sm text-info-700 leading-relaxed">
              RenaCare, böbrek nakli sonrası hasta takibi için tasarlanmış bir dijital sağlık platformudur. Bu politika, verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: Database,
                title: "Topladığımız Veriler",
                content: `RenaCare aşağıdaki verileri toplayabilir:

• Kimlik bilgileri: Ad, soyad, e-posta adresi
• Sağlık bilgileri: Nakil tarihi, ilaç listesi, laboratuvar sonuçları, beslenme notları
• Kullanım verileri: Platforma erişim zamanları, kullanılan özellikler
• İletişim verileri: Doktor ve sağlık ekibiyle yapılan mesajlaşmalar

Bu platform prototip/demo aşamasındadır. Gerçek hasta verileri üretim ortamında KVKK ve ilgili sağlık mevzuatına uygun şekilde işlenecektir.`,
              },
              {
                icon: Eye,
                title: "Verilerin Kullanımı",
                content: `Toplanan veriler şu amaçlarla kullanılır:

• Kişiselleştirilmiş ilaç ve sağlık takip hizmeti sunmak
• Sağlık ekibinizle güvenli iletişimi kolaylaştırmak
• Platform güvenliğini ve hizmet kalitesini iyileştirmek
• Yasal yükümlülükleri yerine getirmek

Verileriniz üçüncü taraflara satılmaz ve sağlık hizmeti dışında ticari amaçla kullanılmaz.`,
              },
              {
                icon: Lock,
                title: "Veri Güvenliği",
                content: `Verilerinizin korunması için aldığımız önlemler:

• Şifrelenmiş veri iletimi (HTTPS/TLS)
• Güvenli kimlik doğrulama mekanizmaları
• Erişim kontrolü ve yetkilendirme
• Düzenli güvenlik denetimleri

Bu platform mevcut durumda demo/prototip aşamasındadır. Üretim ortamında tüm sağlık verisi işleme süreçleri KVKK ve ilgili sağlık mevzuatına uygun şekilde yapılandırılacaktır.`,
              },
              {
                icon: Shield,
                title: "Haklarınız",
                content: `KVKK kapsamında aşağıdaki haklara sahipsiniz:

• Verilerinize erişim hakkı
• Verilerinizin düzeltilmesini talep hakkı
• Verilerinizin silinmesini talep hakkı
• Veri işlemeye itiraz hakkı
• Veri taşınabilirliği hakkı

Bu hakları kullanmak için iletişim sayfamızdan bize ulaşabilirsiniz.`,
              },
            ].map((section, i) => (
              <div key={i} className="bg-surface rounded-[var(--radius-xl)] border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-navy-50 flex items-center justify-center">
                    <section.icon size={16} className="text-navy-600" />
                  </div>
                  <h2 className="text-base font-semibold text-text-primary">{section.title}</h2>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-text-muted mb-4">
              Bu politika hakkında sorularınız için bizimle iletişime geçebilirsiniz.
            </p>
            <Link href="/contact" className="text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors">
              İletişime Geç →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
