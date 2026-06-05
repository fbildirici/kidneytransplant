"use client";
import { useState } from "react";
import {
  BookOpen, CheckCircle, AlertTriangle, Ban, ChevronDown, ChevronUp,
  Droplets, Flame, Apple, Info,
} from "lucide-react";

const categories = [
  {
    id: "recommended",
    title: "İzin Verilen Gıdalar",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    items: [
      { name: "Haşlanmış tavuk / hindi", note: "Yüksek kaliteli protein, düşük fosfor" },
      { name: "Karnabahar", note: "Düşük potasyum, C vitamini kaynağı" },
      { name: "Beyaz pirinç / makarna", note: "Düşük fosfor, iyi enerji kaynağı" },
      { name: "Yumurta beyazı", note: "Yüksek protein, düşük fosfor" },
      { name: "Zeytinyağı", note: "Sağlıklı yağ, anti-enflamatuar" },
      { name: "Elma / Armut", note: "Düşük potasyum, lif kaynağı" },
      { name: "Beyaz ekmek", note: "Tam tahıla göre daha az fosfor" },
      { name: "Kabak / Salatalık", note: "Düşük potasyum, su içeriği yüksek" },
      { name: "Deniz levreği (pişmiş)", note: "Omega-3, yüksek protein" },
    ],
  },
  {
    id: "limited",
    title: "Dikkatli Tüketilecekler",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    items: [
      { name: "Süt ve yoğurt", note: "Günde 1 porsiyon — fosfor açısından sınırlı" },
      { name: "Tam tahıl ekmek", note: "Beyaz ekmeğe göre daha fazla fosfor" },
      { name: "Domates", note: "Günde en fazla 1 orta boy — potasyum" },
      { name: "Patates", note: "Haşlanmalı ve suyu süzülmeli (potasyumu azaltır)" },
      { name: "Tavuk göğsü", note: "Porsiyon: 100–120g, haftada 3–4 kez" },
      { name: "Muz (küçük)", note: "Yüksek potasyum — küçük porsiyon, seyrek" },
      { name: "Kuru baklagiller", note: "Az miktarda, iyi pişirilmiş" },
    ],
  },
  {
    id: "avoid",
    title: "Kesinlikle Kaçınılacaklar",
    icon: Ban,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    items: [
      { name: "Greyfurt / Pomelo", note: "Tacrolimus ile ciddi ilaç etkileşimi — KESİNLİKLE YASAK" },
      { name: "Çiğ et / Sushi / Çiğ yumurta", note: "İmmünosupresyon nedeniyle enfeksiyon riski" },
      { name: "İşlenmiş et ürünleri", note: "Salam, sosis, sucuk — yüksek sodyum ve nitrat" },
      { name: "Tuzlu atıştırmalıklar", note: "Cips, kraker, turşu — yüksek sodyum" },
      { name: "Kola ve gazlı içecekler", note: "Yüksek fosfor (fosforik asit)" },
      { name: "Alkol", note: "İlaç etkileşimleri, karaciğer ve böbrek yükü" },
      { name: "Takviye ve bitkisel ürünler", note: "Doktor onayı olmadan kesinlikle yasak" },
      { name: "Pastörize edilmemiş ürünler", note: "Çiğ süt, köy peyniri — enfeksiyon riski" },
      { name: "Avokado / Portakal suyu", note: "Çok yüksek potasyum" },
    ],
  },
];

const nutrients = [
  { label: "Sodyum (Tuz)", icon: "🧂", range: "< 2000mg/gün", desc: "Hipertansiyon ve ödem kontrolü için kritik", color: "bg-blue-50 border-blue-200" },
  { label: "Potasyum", icon: "🍌", range: "2000–3000mg/gün", desc: "Kalp ritmi ve kas fonksiyonu için", color: "bg-yellow-50 border-yellow-200" },
  { label: "Fosfor", icon: "🦴", range: "800–1000mg/gün", desc: "Kemik sağlığı, damar kireçlenmesi önleme", color: "bg-purple-50 border-purple-200" },
  { label: "Protein", icon: "🥩", range: "0.8–1g/kg/gün", desc: "Kas onarımı — fazlası böbrek yükü yaratır", color: "bg-red-50 border-red-200" },
  { label: "Sıvı", icon: "💧", range: "1.5–2L/gün", desc: "Bireysel limine göre belirlenir — dikkatli takip", color: "bg-cyan-50 border-cyan-200" },
];

const importantNotes = [
  "Tüm gıdalar iyi pişirilmeli — çiğ veya az pişmiş gıdalardan kaçının.",
  "Haşlama yöntemi potasyum ve fosfor içeriğini azaltır — sebzeleri mutlaka haşlayın ve suyunu süzün.",
  "İlaç-besin etkileşimleri için doktorunuza ve diyetisyeninize danışın.",
  "Besin takviyesi ve bitkisel ürünler, onay almadan kesinlikle kullanılmamalıdır.",
  "Greyfurt ve pomelo tacrolimus seviyesini ciddi ölçüde artırır — TAM YASAK.",
  "Pastörize olmayan ürünler (çiğ süt, köy peyniri) immünosupresif hastalarda enfeksiyon riski taşır.",
];

export default function NutritionGuidePage() {
  const [expanded, setExpanded] = useState<string | null>("recommended");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 p-6 sm:p-7 text-white shadow-xl shadow-emerald-500/20">
        <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={15} className="text-green-300" />
            <span className="text-green-300 text-sm font-semibold">Klinik Rehber</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">Beslenme Rehberi</h1>
          <p className="text-white/60 text-sm">Böbrek nakli sonrası beslenme kuralları ve klinik öneriler.</p>
        </div>
      </div>

      {/* Key Nutrient Limits */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_4px_-2px_rgba(0,0,0,0.06),0_4px_12px_-6px_rgba(5,150,105,0.07)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-emerald-600" size={18} />
          <h2 className="font-bold text-slate-900 text-sm">Temel Besin Limitleri</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nutrients.map((n, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${n.color}`}>
              <span className="text-2xl flex-shrink-0">{n.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-900">{n.label}</p>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">{n.range}</p>
                <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Categories */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Gıda Kategorileri</h2>
        {categories.map((cat) => {
          const isOpen = expanded === cat.id;
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_4px_-2px_rgba(0,0,0,0.06),0_4px_12px_-6px_rgba(5,150,105,0.07)] overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center`}>
                    <cat.icon className={cat.color} size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">{cat.title}</p>
                    <p className="text-xs text-slate-400">{cat.items.length} gıda</p>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {cat.items.map((item, i) => (
                      <div key={i} className={`p-3 rounded-xl border ${cat.border} ${cat.bg}`}>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className={`text-xs mt-0.5 ${cat.color}`}>{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-amber-600" size={18} />
          <h2 className="font-bold text-amber-900 text-sm">Önemli Klinik Notlar</h2>
        </div>
        <ul className="space-y-2">
          {importantNotes.map((note, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">{note}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
