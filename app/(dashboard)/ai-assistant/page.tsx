"use client";
import { useState, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Bot,
  Send,
  Forward,
  Sparkles,
  AlertCircle,
  Loader2,
  Heart,
  Pill,
  Apple,
  Activity,
  Trash2,
  PhoneCall,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import DemoBadge from "@/components/ui/DemoBadge";

const EMERGENCY_KEYWORDS = [
  "ateş", "fever", "ısısı yüksek", "38", "39", "40",
  "idrar yok", "idrar çıkamıyorum", "hiç idrar", "az idrar",
  "nefes darlığı", "nefes alamıyorum", "nefes güçlüğü",
  "göğüs ağrısı", "göğsüm ağrıyor",
  "bilinç", "bayıldım", "baygınlık",
  "şişlik şiddetli", "çok şiş",
  "kreatinin yüksek", "kreatinin çok yüksek",
  "ilaç almadım", "ilaç almayı unuttum gün", "birkaç gün almadım",
  "nakil bölgesi ağrı", "nakil yerinde ağrı",
];

const PROHIBITED_ACTION_KEYWORDS = [
  "doz değiştir", "dozu değiştir", "dozumu değiştir", "doz ayarla",
  "ilaç kes", "ilaç bırak", "bırakayım", "keseyim", "kesebilir miyim", "bırakabilir miyim",
  "takviye başla", "vitamin başla", "bitki çayı iç", "ot kullan",
];

function detectProhibitedAction(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_ACTION_KEYWORDS.some((kw) => lower.includes(kw));
}

function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  forwarded?: boolean;
  isEmergency?: boolean;
}

const suggestedQuestions = [
  {
    icon: Pill,
    text: "Tacrolimus ilacımı ne zaman almalıyım?",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    icon: Apple,
    text: "Nakil sonrası hangi meyveleri yiyebilirim?",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    icon: Activity,
    text: "Egzersiz yapmaya ne zaman başlayabilirim?",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    icon: Heart,
    text: "Kreatinin değerim yüksekse ne yapmalıyım?",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
];

const mockResponses: Record<string, string> = {
  default: `Merhaba! Ben RenaCare AI asistanınızım. Böbrek nakli sonrası sürecinizde size yardımcı olmak için buradayım.

Size ilaçlarınız, beslenmeniz, egzersiz rutininiz ve genel sağlık durumunuz hakkında bilgi verebilirim.

Aklınıza takılan her şeyi sorabilirsiniz! 💚

⚠️ *Bu bilgiler genel amaçlıdır. Kişisel durumunuz için mutlaka doktorunuza danışın.*`,

  tacrolimus: `**Tacrolimus (Prograf) Kullanım Rehberi:**

Tacrolimus, böbrek nakli sonrası en önemli ilaçlarınızdan biridir. İşte dikkat etmeniz gerekenler:

**⏰ Alım Zamanı:**
- Günde 2 kez, 12 saat arayla alın (örn: 08:00 ve 20:00)
- Her gün aynı saatlerde almaya özen gösterin
- **Aç karnına** alın (yemekten 1 saat önce veya 2 saat sonra)

**⚠️ Önemli Uyarılar:**
- **Greyfurt** kesinlikle tüketmeyin (ilaç seviyesini tehlikeli şekilde yükseltir)
- İlacı bütün olarak yutun, çiğnemeyin veya ezmeyin
- Bir dozu unutursanız, hatırladığınız anda alın (bir sonraki doza 4 saatten az kaldıysa atlayın)

**🔍 Takip:**
- Düzenli kan tahlili ile ilaç seviyesi kontrol edilmelidir
- Hedef kan seviyesi doktorunuz tarafından belirlenir
- Yan etkiler: tremor, baş ağrısı, mide bulantısı olabilir

*Bu bilgiler genel amaçlıdır. Kişisel durumunuz için doktorunuza danışın.*`,

  meyve: `**Böbrek Nakli Sonrası Meyve Rehberi:**

Meyve seçiminde **potasyum** seviyesine dikkat etmelisiniz.

**✅ Yiyebileceğiniz Meyveler (Düşük Potasyum):**
- Elma (kabuksuz daha iyi)
- Armut
- Yaban mersini
- Böğürtlen
- Çilek
- Karpuz (az miktar)
- Şeftali (küçük porsiyon)

**⚠️ Dikkatli Tüketin (Orta Potasyum):**
- Mandalina (1 adet/gün)
- Üzüm (1 avuç)
- Ananas (1-2 dilim)

**❌ Kaçınmanız Gerekenler (Yüksek Potasyum):**
- 🍌 Muz
- 🥑 Avokado
- Portakal ve portakal suyu
- Kavun
- Kuru meyveler (kayısı, üzüm, incir)
- **Greyfurt** (Tacrolimus etkileşimi!)

**💡 İpucu:** Meyveleri konserve yerine taze tüketin. Konserve meyveler ekstra şeker içerir.

*Bu bilgiler genel amaçlıdır. Kişisel beslenme planınız için diyetisyeninize danışın.*`,

  egzersiz: `**Böbrek Nakli Sonrası Egzersiz Rehberi:**

Egzersiz, iyileşme sürecinizin önemli bir parçasıdır!

**📅 Zamanlama:**
- İlk 6-8 hafta: Sadece hafif yürüyüş
- 2-3 ay sonra: Hafif egzersizlere başlayabilirsiniz
- 6 ay sonra: Doktor onayıyla daha yoğun aktiviteler

**✅ Önerilen Egzersizler:**
- 🚶 Yürüyüş (günde 20-30 dk ile başlayın)
- 🧘 Hafif yoga ve esneme
- 🚴 Sabit bisiklet
- 🏊 Yüzme (yara tamamen iyileştikten sonra)
- Hafif direnç egzersizleri

**❌ Kaçınılması Gerekenler:**
- Ağır kaldırma (ilk 3 ay)
- Temas sporları (futbol, basketbol)
- Karın bölgesine baskı yapan hareketler (ilk 2 ay)
- Aşırı yorucu aktiviteler

**💡 İpuçları:**
- Yavaş başlayın, kademeli artırın
- Bol su için (ama doktorunuzun önerdiği miktarı aşmayın)
- Yorgunluk hissederseniz durun
- Sıcak havalarda dışarıda egzersiz yapmaktan kaçının

*Egzersiz programınızı başlatmadan önce mutlaka doktorunuzdan onay alın.*`,

  kreatinin: `**Kreatinin Değerleri Hakkında Bilgilendirme:**

Kreatinin, böbrek fonksiyonlarınızın en önemli göstergelerinden biridir.

**📊 Normal Değerler (nakil sonrası):**
- Erkekler: 1.0 - 1.5 mg/dL
- Kadınlar: 0.8 - 1.3 mg/dL
- *Not: Değerler kişiye ve zamana göre değişebilir*

**⬆️ Yüksek Kreatinin Ne Anlama Gelir?**
- Nakil böbreğin fonksiyonunda azalma olabilir
- Dehidratasyon (su eksikliği)
- İlaç yan etkisi
- Enfeksiyon
- Rejeksiyon (red) belirtisi olabilir

**🚨 Ne Zaman Acil Doktora Başvurmalısınız?**
- Kreatinin ani yükselme gösteriyorsa
- İdrar miktarınız belirgin azaldıysa
- Ateş, ağrı veya şişlik varsa
- İlaçlarınızda değişiklik yapıldıysa

**💡 Kreatinini Kontrol Altında Tutmak İçin:**
- Yeterli su için
- İlaçlarınızı düzenli alın
- Düzenli kan tahlili yaptırın
- Yüksek proteinli diyetten kaçının

**⚠️ Kreatinin değeriniz yüksekse panik yapmayın ama mutlaka doktorunuzu bilgilendirin. Bu durum bir çok faktöre bağlı olabilir.**

*Bu bilgi genel amaçlıdır. Kişisel durumunuz için nefroloji uzmanınıza danışın.*`,
};

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("tacrolimus") || lower.includes("prograf") || lower.includes("ne zaman almalı"))
    return mockResponses.tacrolimus;
  if (lower.includes("meyve") || lower.includes("yiyebil"))
    return mockResponses.meyve;
  if (lower.includes("egzersiz") || lower.includes("spor") || lower.includes("yürüyüş"))
    return mockResponses.egzersiz;
  if (lower.includes("kreatinin") || lower.includes("yüksek"))
    return mockResponses.kreatinin;
  return mockResponses.default;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Merhaba! 👋 Ben RenaCare AI sağlık asistanınızım. Böbrek nakli sonrası sürecinizle ilgili sorularınızı yanıtlamak için buradayım. İlaçlarınız, beslenmeniz veya genel sağlığınız hakkında merak ettiğiniz her şeyi sorabilirsiniz!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false);
  const [showProhibitedWarning, setShowProhibitedWarning] = useState(false);
  const [sharedMessageId, setSharedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const isEmergency = detectEmergency(text);
    if (isEmergency) setShowEmergencyBanner(true);

    const isProhibited = detectProhibitedAction(text);
    if (isProhibited) setShowProhibitedWarning(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
      isEmergency,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const baseResponse = getMockResponse(text);
    const emergencyPrefix = isEmergency
      ? "🚨 **ACİL UYARI:** Bu belirti acil tıbbi değerlendirme gerektirebilir. Hemen nakil ekibinizi veya doktorunuzu arayın. Ulaşamazsanız **112**'yi arayın veya en yakın acil servise gidin.\n\n---\n\n"
      : "";

    const prohibitedSuffix = isProhibited
      ? "\n\n---\n\n⚠️ **Önemli Hatırlatma:** Kendi ilaç dozunuzu değiştirmeyin, ilaç kesmeyin veya yeni takviye başlatmayın. Bu kararlar yalnızca doktorunuz tarafından verilmelidir."
      : "";

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: emergencyPrefix + baseResponse + prohibitedSuffix,
      timestamp: new Date(),
      isEmergency,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const forwardToDoctor = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, forwarded: true } : m))
    );
    setSharedMessageId(messageId);
    setTimeout(() => setSharedMessageId(null), 3000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Merhaba! 👋 Ben RenaCare AI sağlık asistanınızım. Böbrek nakli sonrası sürecinizle ilgili sorularınızı yanıtlamak için buradayım.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center">
            <Bot className="text-white" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">AI Sağlık Asistanı</h1>
              <DemoBadge text="Genel bilgi" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-gentle-pulse" />
              <span className="text-xs text-slate-500">Çevrimiçi</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat}>
          <Trash2 size={16} />
          Sohbeti Temizle
        </Button>
      </div>

      {/* Emergency Banner */}
      {showEmergencyBanner && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-300 rounded-xl px-4 py-3 mb-4">
          <PhoneCall size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">Acil Durum Tespit Edildi</p>
            <p className="text-xs text-red-700 mt-0.5">
              Bildirdiğiniz belirti acil tıbbi değerlendirme gerektirebilir. Nakil ekibinizi veya doktorunuzu arayın. Ulaşamazsanız <strong>112</strong>&apos;yi arayın veya en yakın acil servise gidin. Bu sohbet acil müdahale yerine geçmez.
            </p>
          </div>
          <button onClick={() => setShowEmergencyBanner(false)} className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
        </div>
      )}

      {/* Prohibited Action Warning */}
      {showProhibitedWarning && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-300 rounded-xl px-4 py-3 mb-4">
          <ShieldAlert size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-rose-800">Doz Değişikliği / İlaç Bırakma Talebi Algılandı</p>
            <p className="text-xs text-rose-700 mt-0.5">
              AI asistan ilaç dozu değiştirme, ilaç kesme veya yeni takviye başlatma önerisi veremez. Bu kararlar yalnızca doktorunuz tarafından verilmelidir. Lütfen doğrudan doktorunuzla iletişime geçin.
            </p>
          </div>
          <button onClick={() => setShowProhibitedWarning(false)} className="text-rose-400 hover:text-rose-600 text-lg leading-none">&times;</button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-4">
        <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Bu AI asistan <strong>genel bilgi amaçlıdır</strong>, tıbbi tavsiye yerine geçmez ve ilaç dozu değiştiremez. Ciddi endişeleriniz için doktorunuza başvurun. Yanıtlar KDIGO/NKF kaynaklı rehberlerden derlenmiştir.
        </p>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 overflow-hidden flex flex-col" padding="sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-navy-500 to-teal-600 text-white rounded-2xl rounded-br-md"
                    : message.isEmergency
                      ? "bg-red-50 border border-red-300 text-slate-800 rounded-2xl rounded-bl-md"
                      : "bg-slate-50 text-slate-800 rounded-2xl rounded-bl-md"
                } p-4`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-navy-500" />
                    <span className="text-xs font-medium text-navy-500">
                      RenaCare AI
                    </span>
                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Genel Bilgi
                    </span>
                    {message.isEmergency && (
                      <span className="text-[10px] font-medium text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        Acil Yönlendirme
                      </span>
                    )}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`flex items-center justify-between mt-2 pt-2 border-t ${
                    message.role === "user"
                      ? "border-white/20"
                      : "border-slate-200"
                  }`}
                >
                  <span
                    className={`text-[10px] ${message.role === "user" ? "text-white/70" : "text-slate-400"}`}
                  >
                    {message.timestamp.toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.role === "assistant" &&
                    message.id !== "welcome" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => forwardToDoctor(message.id)}
                          disabled={message.forwarded}
                          className={`flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer ${
                            message.forwarded
                              ? "text-emerald-600"
                              : "text-navy-500 hover:text-teal-700"
                          }`}
                        >
                          <Stethoscope size={12} />
                          {message.forwarded
                            ? "Doktora iletildi"
                            : "Doktoruma Paylaş"}
                        </button>
                        {sharedMessageId === message.id && (
                          <span className="text-[10px] text-emerald-600 font-medium">
                            Mesaj doktor paneline iletildi
                          </span>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-slide-up">
              <div className="bg-slate-50 rounded-2xl rounded-bl-md p-4">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="text-navy-500 animate-spin" />
                  <span className="text-sm text-slate-500">
                    AI düşünüyor...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="p-4 pt-0">
            <p className="text-xs text-slate-400 mb-2">
              Öneri sorular:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all hover:shadow-sm cursor-pointer ${q.color}`}
                >
                  <q.icon size={16} className="flex-shrink-0" />
                  <span>{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Sağlığınızla ilgili bir soru sorun..."
              className="modern-field flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
