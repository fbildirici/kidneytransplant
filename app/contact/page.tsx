"use client";
import Link from "next/link";
import { HeartPulse, ArrowLeft, Mail, MessageSquare } from "lucide-react";
import PageTitle from "@/components/PageTitle";

export default function ContactPage() {
  return (
    <>
      <PageTitle title="İletişim — RenaCare" />
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

        <div className="max-w-2xl mx-auto px-4 pt-24 pb-16 text-center">
          <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-navy-50 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="text-navy-600" size={20} />
          </div>
          <h1 className="text-3xl font-semibold text-text-primary mb-3 tracking-tight">İletişim</h1>
          <p className="text-text-secondary mb-10 text-sm leading-relaxed max-w-md mx-auto">
            RenaCare hakkında sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
            <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5">
              <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-navy-50 flex items-center justify-center mb-3">
                <Mail size={16} className="text-navy-600" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">E-posta</h3>
              <p className="text-xs text-text-secondary mb-2">Genel sorular ve geri bildirim</p>
              <p className="text-sm font-medium text-navy-600">info@renacare.com</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5">
              <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-success-50 flex items-center justify-center mb-3">
                <MessageSquare size={16} className="text-success-600" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Teknik Destek</h3>
              <p className="text-xs text-text-secondary mb-2">Platform teknik sorunları</p>
              <p className="text-sm font-medium text-success-600">destek@renacare.com</p>
            </div>
          </div>

          <div className="mt-8 bg-warning-50 border border-warning-200 rounded-[var(--radius-xl)] p-5 text-left max-w-lg mx-auto">
            <p className="text-xs font-semibold text-warning-800 mb-1">Tıbbi Destek İçin</p>
            <p className="text-xs text-warning-700 leading-relaxed">
              RenaCare tıbbi destek sunmaz. Sağlık sorularınız için doktorunuza danışın.
              Acil durumlarda <strong>112</strong>'yi arayın.
            </p>
          </div>

          <div className="mt-10">
            <Link href="/" className="text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
