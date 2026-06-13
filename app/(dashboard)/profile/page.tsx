"use client";
import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplets,
  Heart,
  Shield,
  Bell,
  Moon,
  Globe,
  Save,
  LogOut,
} from "lucide-react";
import { useToast } from "@/lib/toast-context";
import PageTitle from "@/components/PageTitle";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"personal" | "health" | "settings">("personal");


  // Personal form state
  const [personal, setPersonal] = useState({ firstName: "Ahmet", lastName: "Yılmaz", email: "ahmet@email.com", phone: "+90 532 xxx xx xx", birthDate: "1985-06-15" });

  // Health form state
  const [health, setHealth] = useState({ transplantDate: "2025-08-15", bloodGroup: "A Rh+", transplantType: "living", doctorName: "Dr. Ayşe Kaya", doctorEmail: "ayse.kaya@hastane.com", hospital: "Merkez Üniversite Hastanesi" });

  // Notification settings
  const [notifs, setNotifs] = useState({ medications: true, appointments: true, doctorReplies: true, healthTips: false });
  const toast = useToast();
  const showSaved = () => { toast.addToast("Değişiklikler kaydedildi.", "success"); };

  return (
    <>
      <PageTitle title="Profil" />
      <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 sm:p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-1">Profil</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1">Hesap Bilgileri</h1>
            <p className="text-sm text-text-secondary">Kişisel bilgilerinizi, nakil verilerinizi ve bildirim tercihlerinizi yönetin.</p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative rounded-[var(--radius-xl)] bg-surface border border-border">
        {/* Banner */}
        <div className="h-28 bg-navy-600 relative" />
        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="ring-4 ring-surface rounded-[var(--radius-lg)]">
                <Avatar name="Ahmet Yılmaz" size="lg" className="w-20 h-20 text-2xl rounded-[var(--radius-lg)]" />
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-semibold text-text-primary">Ahmet Yılmaz</h1>
                <p className="text-sm text-text-secondary">ahmet@email.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Badge variant="info">Hasta</Badge>
              <Badge variant="success">Aktif</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">5</p>
              <p className="text-xs text-text-tertiary">İlaç</p>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">12 gün</p>
              <p className="text-xs text-text-tertiary">Takip Serisi</p>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="text-center">
              <p className="text-sm font-bold text-success-600">Stabil</p>
              <p className="text-xs text-text-tertiary">Sağlık Durumu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-muted rounded-[var(--radius-lg)] p-1 w-fit">
        {[
          { id: "personal", label: "Kişisel Bilgiler", icon: User },
          { id: "health", label: "Sağlık Bilgileri", icon: Heart },
          { id: "settings", label: "Ayarlar", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-surface text-navy-700 shadow-subtle font-semibold"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Personal Info */}
      {activeTab === "personal" && (
        <Card>
          <h2 className="font-semibold text-text-primary mb-6">
            Kişisel Bilgiler
          </h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Ad" value={personal.firstName} onChange={(e) => setPersonal((p) => ({ ...p, firstName: e.target.value }))} icon={<User size={18} />} />
              <Input label="Soyad" value={personal.lastName} onChange={(e) => setPersonal((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
            <Input label="E-posta" type="email" value={personal.email} onChange={(e) => setPersonal((p) => ({ ...p, email: e.target.value }))} icon={<Mail size={18} />} />
            <Input label="Telefon" type="tel" value={personal.phone} onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))} icon={<Phone size={18} />} />
            <Input label="Doğum Tarihi" type="date" value={personal.birthDate} onChange={(e) => setPersonal((p) => ({ ...p, birthDate: e.target.value }))} icon={<Calendar size={18} />} />
            <div className="pt-2">
              <Button onClick={showSaved}>
                <Save size={16} />
                Değişiklikleri Kaydet
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Health Info */}
      {activeTab === "health" && (
        <div className="space-y-6">
          <div className="flex items-start gap-2 bg-info-50 border border-info-200 rounded-[var(--radius-xl)] px-4 py-3">
            <Shield size={14} className="text-info-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-info-700 leading-relaxed">
              Bu bilgiler size uygun takip deneyimi oluşturmak için kullanılır. Nakil tarihiniz ve sağlık ekibi bilgileriniz yalnızca sizinle ve sağlık ekibinizle paylaşılır.
            </p>
          </div>
          <Card>
            <h2 className="font-semibold text-text-primary mb-6">Nakil Bilgileri</h2>
            <div className="space-y-4">
              <Input label="Nakil Tarihi" type="date" value={health.transplantDate} onChange={(e) => setHealth((p) => ({ ...p, transplantDate: e.target.value }))} icon={<Calendar size={18} />} />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-secondary">Kan Grubu</label>
                  <select value={health.bloodGroup} onChange={(e) => setHealth((p) => ({ ...p, bloodGroup: e.target.value }))}
                    className="w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-navy-500">
                    {["A Rh+","A Rh-","B Rh+","B Rh-","AB Rh+","AB Rh-","0 Rh+","0 Rh-"].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-secondary">Nakil Türü</label>
                  <select value={health.transplantType} onChange={(e) => setHealth((p) => ({ ...p, transplantType: e.target.value }))}
                    className="w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-navy-500">
                    <option value="living">Canlı Donör</option>
                    <option value="deceased">Kadavra</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-text-primary mb-6">Doktor Bilgileri</h2>
            <div className="space-y-4">
              <Input label="Doktor Adı" value={health.doctorName} onChange={(e) => setHealth((p) => ({ ...p, doctorName: e.target.value }))} icon={<User size={18} />} />
              <Input label="Doktor E-posta" type="email" value={health.doctorEmail} onChange={(e) => setHealth((p) => ({ ...p, doctorEmail: e.target.value }))} icon={<Mail size={18} />} />
              <Input label="Hastane" value={health.hospital} onChange={(e) => setHealth((p) => ({ ...p, hospital: e.target.value }))} icon={<Heart size={18} />} />
              <div className="pt-2">
                <Button onClick={showSaved}>
                  <Save size={16} />
                  Değişiklikleri Kaydet
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-text-primary mb-6">
              Bildirim Ayarları
            </h2>
            <div className="space-y-4">
              {([
                { key: "medications" as const, icon: Bell, label: "İlaç Hatırlatmaları", desc: "İlaç saatlerinde bildirim al" },
                { key: "appointments" as const, icon: Calendar, label: "Randevu Hatırlatmaları", desc: "Randevulardan 1 gün önce bildirim al" },
                { key: "doctorReplies" as const, icon: Mail, label: "Doktor Yanıtları", desc: "Doktor mesaj yanıtladığında bildirim al" },
                { key: "healthTips" as const, icon: Heart, label: "Sağlık İpuçları", desc: "Günlük sağlık ve beslenme ipuçları al" },
              ]).map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] hover:bg-surface-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-medical-50 flex items-center justify-center">
                      <setting.icon className="text-medical-600" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{setting.label}</p>
                      <p className="text-xs text-text-tertiary">{setting.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifs[setting.key]}
                      onChange={(e) => setNotifs((p) => ({ ...p, [setting.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-medical-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-600" />
                  </label>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-text-primary mb-6">Genel</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] hover:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-surface-muted flex items-center justify-center">
                    <Globe className="text-text-secondary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Dil</p>
                    <p className="text-xs text-text-tertiary">
                      Uygulama dilini seçin
                    </p>
                  </div>
                </div>
                <Badge variant="default">Türkçe</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] hover:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-surface-muted flex items-center justify-center">
                    <Moon className="text-text-secondary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Tema</p>
                    <p className="text-xs text-text-tertiary">
                      Görünüm tercihini seçin
                    </p>
                  </div>
                </div>
                <Badge variant="default">Açık</Badge>
              </div>
            </div>
          </Card>

          <Card className="border-danger-200">
            <h2 className="font-semibold text-danger-600 mb-4">Tehlikeli Alan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-primary font-medium">
                  Hesabı Sil
                </p>
                <p className="text-xs text-text-tertiary">
                  Tüm verileriniz kalıcı olarak silinecektir.
                </p>
              </div>
              <Button variant="danger" size="sm">
                Hesabı Sil
              </Button>
            </div>
          </Card>

          <div className="text-center">
            <Button variant="outline" size="lg">
              <LogOut size={18} />
              Çıkış Yap
            </Button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
