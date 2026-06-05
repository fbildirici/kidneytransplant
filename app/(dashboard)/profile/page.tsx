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
import DemoBadge from "@/components/ui/DemoBadge";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"personal" | "health" | "settings">("personal");
  const [savedMsg, setSavedMsg] = useState(false);

  // Personal form state
  const [personal, setPersonal] = useState({ firstName: "Ahmet", lastName: "Yılmaz", email: "ahmet@email.com", phone: "+90 532 xxx xx xx", birthDate: "1985-06-15" });

  // Health form state
  const [health, setHealth] = useState({ transplantDate: "2025-08-15", bloodGroup: "A Rh+", transplantType: "living", doctorName: "Dr. Ayşe Kaya", doctorEmail: "ayse.kaya@hastane.com", hospital: "Merkez Üniversite Hastanesi" });

  // Notification settings
  const [notifs, setNotifs] = useState({ medications: true, appointments: true, doctorReplies: true, healthTips: false });

  const showSaved = () => { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2500); };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-end mb-2">
        <DemoBadge text="Örnek hasta profili" />
      </div>
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/70 shadow-[0_1px_4px_-2px_rgba(0,0,0,0.06),0_4px_12px_-6px_rgba(0,48,128,0.07)]">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-navy-600 via-navy-500 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </div>
        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="ring-4 ring-white rounded-2xl shadow-lg">
                <Avatar name="Ahmet Yılmaz" size="lg" className="w-20 h-20 text-2xl rounded-2xl" />
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-slate-900">Ahmet Yılmaz</h1>
                <p className="text-sm text-slate-500">ahmet@email.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Badge variant="info">Hasta</Badge>
              <Badge variant="success">Aktif</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">5</p>
              <p className="text-xs text-slate-400">İlaç</p>
            </div>
            <div className="w-px h-6 bg-slate-100" />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">12 gün</p>
              <p className="text-xs text-slate-400">Takip Serisi</p>
            </div>
            <div className="w-px h-6 bg-slate-100" />
            <div className="text-center">
              <p className="text-sm font-bold text-emerald-600">Stabil</p>
              <p className="text-xs text-slate-400">Sağlık Durumu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { id: "personal", label: "Kişisel Bilgiler", icon: User },
          { id: "health", label: "Sağlık Bilgileri", icon: Heart },
          { id: "settings", label: "Ayarlar", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-navy-700 shadow-sm font-semibold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Saved confirmation */}
      {savedMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <Shield size={18} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-800">Değişiklikler kaydedildi.</p>
        </div>
      )}

      {/* Personal Info */}
      {activeTab === "personal" && (
        <Card>
          <h2 className="font-semibold text-slate-900 mb-6">
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
          <Card>
            <h2 className="font-semibold text-slate-900 mb-6">Sağlık Bilgileri</h2>
            <div className="space-y-4">
              <Input label="Nakil Tarihi" type="date" value={health.transplantDate} onChange={(e) => setHealth((p) => ({ ...p, transplantDate: e.target.value }))} icon={<Calendar size={18} />} />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Kan Grubu</label>
                  <select value={health.bloodGroup} onChange={(e) => setHealth((p) => ({ ...p, bloodGroup: e.target.value }))}
                    className="modern-field modern-select w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-400">
                    {["A Rh+","A Rh-","B Rh+","B Rh-","AB Rh+","AB Rh-","0 Rh+","0 Rh-"].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Nakil Türü</label>
                  <select value={health.transplantType} onChange={(e) => setHealth((p) => ({ ...p, transplantType: e.target.value }))}
                    className="modern-field modern-select w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-400">
                    <option value="living">Canlı Donör</option>
                    <option value="deceased">Kadavra</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900 mb-6">Doktor Bilgileri</h2>
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
            <h2 className="font-semibold text-slate-900 mb-6">
              Bildirim Ayarları
            </h2>
            <div className="space-y-4">
              {([
                { key: "medications" as const, icon: Bell, label: "İlaç Hatırlatmaları", desc: "İlaç saatlerinde bildirim al" },
                { key: "appointments" as const, icon: Calendar, label: "Randevu Hatırlatmaları", desc: "Randevulardan 1 gün önce bildirim al" },
                { key: "doctorReplies" as const, icon: Mail, label: "Doktor Yanıtları", desc: "Doktor mesaj yanıtladığında bildirim al" },
                { key: "healthTips" as const, icon: Heart, label: "Sağlık İpuçları", desc: "Günlük sağlık ve beslenme ipuçları al" },
              ]).map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                      <setting.icon className="text-teal-600" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{setting.label}</p>
                      <p className="text-xs text-slate-500">{setting.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifs[setting.key]}
                      onChange={(e) => setNotifs((p) => ({ ...p, [setting.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
                  </label>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900 mb-6">Genel</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Globe className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Dil</p>
                    <p className="text-xs text-slate-500">
                      Uygulama dilini seçin
                    </p>
                  </div>
                </div>
                <Badge variant="default">Türkçe</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Moon className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Tema</p>
                    <p className="text-xs text-slate-500">
                      Görünüm tercihini seçin
                    </p>
                  </div>
                </div>
                <Badge variant="default">Açık</Badge>
              </div>
            </div>
          </Card>

          <Card className="border-red-100">
            <h2 className="font-semibold text-red-600 mb-4">Tehlikeli Alan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-900 font-medium">
                  Hesabı Sil
                </p>
                <p className="text-xs text-slate-500">
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
  );
}
