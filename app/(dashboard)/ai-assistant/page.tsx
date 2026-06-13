"use client";
import { useState, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Bot,
  Send,
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
import PageTitle from "@/components/PageTitle";

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
    category: "İlaçlar",
    icon: Pill,
    text: "Tacrolimus ilacımı ne zaman almalıyım?",
    iconBg: "bg-navy-50",
    iconColor: "text-navy-600",
  },
  {
    category: "Beslenme",
    icon: Apple,
    text: "Nakil sonrası hangi meyveleri yiyebilirim?",
    iconBg: "bg-success-50",
    iconColor: "text-success-600",
  },
  {
    category: "Lab Sonuçları",
    icon: Activity,
    text: "Kreatinin değerim yüksekse ne yapmalıyım?",
    iconBg: "bg-info-50",
    iconColor: "text-info-600",
  },
  {
    category: "Günlük Yaşam",
    icon: Heart,
    text: "Egzersiz yapmaya ne zaman başlayabilirim?",
    iconBg: "bg-medical-50",
    iconColor: "text-medical-600",
  },
  {
    category: "Randevuya Hazırlık",
    icon: Stethoscope,
    text: "Randevu öncesi hangi soruları hazırlamalıyım?",
    iconBg: "bg-warning-50",
    iconColor: "text-warning-600",
  },
  {
    category: "İlaçlar",
    icon: Pill,
    text: "Tacrolimus seviyem hakkında doktora nasıl soru sorabilirim?",
    iconBg: "bg-navy-50",
    iconColor: "text-navy-600",
  },
];

const mockResponses: Record<string, string> = {
  default: `Merhaba! Ben RenaCare sağlık asistanınızım. Böbrek nakli sonrası sürecinizde size yardımcı olmak için buradayım.

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

function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed === "---") {
          return <hr key={i} className="my-3 border-border" />;
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-sm font-semibold text-text-primary mt-3 mb-1">
              {parseInline(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length > 4) {
          return (
            <h3 key={i} className="text-sm font-semibold text-text-primary mt-3 mb-1">
              {parseInline(trimmed)}
            </h3>
          );
        }
        if (trimmed.startsWith("- ")) {
          return (
            <li key={i} className="ml-4 text-sm text-text-secondary leading-relaxed">
              {parseInline(trimmed.slice(2))}
            </li>
          );
        }
        if (trimmed === "") {
          return <div key={i} className="h-2" />;
        }
        return (
          <p key={i} className="text-sm text-text-secondary leading-relaxed">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </>
  );
}

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|🚨|⚠️|✅|❌|💡|⏰|🔍|📅|📊|⬆️|🚶|🧘|🚴|🏊)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-text-primary font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Merhaba! 👋 Ben RenaCare sağlık asistanınızım. Böbrek nakli sonrası sürecinizle ilgili sorularınızı yanıtlamak için buradayım. İlaçlarınız, beslenmeniz veya genel sağlığınız hakkında merak ettiğiniz her şeyi sorabilirsiniz!",
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
          "Merhaba! 👋 Ben RenaCare sağlık asistanınızım. Böbrek nakli sonrası sürecinizle ilgili sorularınızı yanıtlamak için buradayım.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      <PageTitle title="Genel Bilgi Asistanı" />
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">

      {/* Header */}
      <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-4 mb-4 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-navy-600 flex items-center justify-center flex-shrink-0">
              <Bot className="text-white" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-text-primary">Genel Bilgi Asistanı</h1>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-success-500 rounded-full" />
                <span className="text-xs text-text-tertiary">Çevrimiçi</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat}>
            <Trash2 size={15} />
            Temizle
          </Button>
        </div>

        {/* Prominent safety disclosure */}
        <div className="mt-3 grid sm:grid-cols-3 gap-2">
          {[
            { icon: AlertCircle, text: "Tanı koymaz, ilaç dozu önermez", color: "text-danger-600 bg-danger-50 border-danger-200" },
            { icon: ShieldAlert, text: "Doktor kararının yerini tutmaz", color: "text-warning-600 bg-warning-50 border-warning-200" },
            { icon: PhoneCall, text: "Acilde 112'yi arayın", color: "text-info-600 bg-info-50 border-info-200" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border ${item.color}`}>
              <item.icon size={13} className={item.color.split(" ")[0]} />
              <p className={`text-xs font-medium ${item.color.split(" ")[0]}`}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Banner */}
      {showEmergencyBanner && (
        <div className="flex items-start gap-3 bg-danger-50 border border-danger-200 rounded-[var(--radius-xl)] px-4 py-3 mb-4">
          <PhoneCall size={16} className="text-danger-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-danger-800">Acil Durum Tespit Edildi</p>
            <p className="text-xs text-danger-700 mt-0.5 leading-relaxed">
              Bildirdiğiniz belirti acil tıbbi değerlendirme gerektirebilir. Nakil ekibinizi veya doktorunuzu arayın.
              Ulaşamazsanız <strong>112</strong>'yi arayın. Bu sohbet acil müdahale yerine geçmez.
            </p>
          </div>
          <button onClick={() => setShowEmergencyBanner(false)} className="text-danger-400 hover:text-danger-600 text-lg leading-none cursor-pointer">&times;</button>
        </div>
      )}

      {/* Prohibited Action Warning */}
      {showProhibitedWarning && (
        <div className="flex items-start gap-3 bg-warning-50 border border-warning-200 rounded-[var(--radius-xl)] px-4 py-3 mb-4">
          <ShieldAlert size={16} className="text-warning-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning-800">Doz Değişikliği / İlaç Bırakma Talebi</p>
            <p className="text-xs text-warning-700 mt-0.5 leading-relaxed">
              Genel Bilgi Asistanı ilaç dozu değiştirme, ilaç kesme veya yeni takviye başlatma önerisi veremez.
              Bu kararlar yalnızca doktorunuz tarafından verilmelidir. Lütfen doktorunuzla iletişime geçin.
            </p>
          </div>
          <button onClick={() => setShowProhibitedWarning(false)} className="text-warning-400 hover:text-warning-600 text-lg leading-none cursor-pointer">&times;</button>
        </div>
      )}

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
                    ? "bg-navy-600 text-white rounded-[var(--radius-xl)] rounded-br-md"
                    : message.isEmergency
                      ? "bg-red-50 border border-red-300 text-text-primary rounded-[var(--radius-xl)] rounded-bl-md"
                      : "bg-surface-muted text-text-primary rounded-[var(--radius-xl)] rounded-bl-md"
                } p-4`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-navy-600">
                      RenaCare Asistan
                    </span>
                    <span className="text-[10px] font-medium text-warning-700 bg-warning-50 border border-warning-200 px-1.5 py-0.5 rounded">
                      Genel Bilgi
                    </span>
                    {message.isEmergency && (
                      <span className="text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        Acil Yönlendirme
                      </span>
                    )}
                  </div>
                )}
                <div className="leading-relaxed">
                  {message.role === "assistant" ? (
                    <MarkdownText text={message.content} />
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
                <div
                  className={`flex items-center justify-between mt-2 pt-2 border-t ${
                    message.role === "user"
                      ? "border-white/20"
                      : "border-border"
                  }`}
                >
                  <span
                    className={`text-[10px] ${message.role === "user" ? "text-white/70" : "text-text-tertiary"}`}
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
                              ? "text-success-600"
                              : "text-navy-600 hover:text-navy-700"
                          }`}
                        >
                          <Stethoscope size={12} />
                          {message.forwarded
                            ? "Doktora iletildi"
                            : "Doktoruma Paylaş"}
                        </button>
                        {sharedMessageId === message.id && (
                          <span className="text-[10px] text-success-600 font-medium">
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
              <div className="bg-surface-muted rounded-[var(--radius-xl)] rounded-bl-md p-4">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="text-navy-600 animate-spin" />
                  <span className="text-sm text-text-secondary">
                    Yanıt hazırlanıyor...
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
            <p className="text-xs font-medium text-text-muted mb-2.5">Örnek sorular:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  className="flex items-start gap-2.5 p-3 rounded-[var(--radius-lg)] border border-border bg-surface hover:bg-surface-muted text-left transition-colors cursor-pointer group"
                >
                  <span className={`w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0 mt-0.5 ${q.iconBg}`}>
                    <q.icon size={13} className={q.iconColor} />
                  </span>
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">{q.category}</span>
                    <p className="text-xs text-text-secondary leading-snug mt-0.5 group-hover:text-text-primary transition-colors">{q.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Sağlığınızla ilgili bir soru sorun..."
              className="flex-1 rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-[3px] focus:ring-navy-500/15 focus:border-navy-400 hover:border-border-strong"
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
    </>
  );
}
