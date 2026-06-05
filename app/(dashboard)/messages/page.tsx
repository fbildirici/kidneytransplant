"use client";
import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { getUrgencyColor, getStatusColor, getStatusText } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Mail,
  Bot,
  Pill,
  Activity,
  Calendar,
  FileText,
  ShieldAlert,
} from "lucide-react";
import DemoBadge from "@/components/ui/DemoBadge";

interface DoctorMessage {
  id: string;
  subject: string;
  content: string;
  urgency: "low" | "medium" | "high";
  status: "sent" | "read" | "replied";
  fromAI: boolean;
  reply?: string;
  createdAt: string;
  doctor: string;
}

const initialMessages: DoctorMessage[] = [
  {
    id: "1",
    subject: "Tacrolimus seviyesi hakkında",
    content:
      "Son kan tahlilimde tacrolimus seviyem 12.5 ng/mL çıktı. Bu değer normal aralıkta mı? Endişelenmelimiyim?",
    urgency: "medium",
    status: "replied",
    fromAI: false,
    reply:
      "[DEMO VERİSİ — Gerçek sistemde doz değişiklikleri yalnızca muayene sonrası yapılır]\n\nAhmet Bey, tacrolimus seviyeniz biraz yüksek görünüyor. Kan tahlil sonuçlarınıza göre durumu değerlendirmem gerekiyor. Lütfen kliniğimizle randevu alın. İyi dileklerimle, Dr. Ayşe Kaya",
    createdAt: "2026-02-14",
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: "2",
    subject: "AI Asistan Yanıtı - Beslenme sorusu",
    content:
      'AI asistana "Nakil sonrası hangi meyveleri yiyebilirim?" diye sordum. Verdiği yanıtı sizinle paylaşmak istiyorum. Özellikle karpuz konusunda doğrulama istiyorum.',
    urgency: "low",
    status: "read",
    fromAI: true,
    createdAt: "2026-02-13",
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: "3",
    subject: "Ayak bileğinde şişlik",
    content:
      "Son birkaç gündür sağ ayak bileğimde hafif şişlik fark ettim. Ağrı yok ama endişeliyim. Acil bir durum olabilir mi?",
    urgency: "high",
    status: "replied",
    fromAI: false,
    reply:
      "Ahmet Bey, ödem böbrek nakli hastalarında görülebilir. Ancak muayene etmem gerekiyor. Yarın saat 10:00'da randevu oluşturdum. Tuz alımınızı azaltın ve ayaklarınızı yüksekte tutun. Dr. Kaya",
    createdAt: "2026-02-12",
    doctor: "Dr. Ayşe Kaya",
  },
  {
    id: "4",
    subject: "İlaç yan etkisi - Baş ağrısı",
    content:
      "Mycophenolate almaya başladıktan sonra düzenli baş ağrıları yaşıyorum. Bu normal bir yan etki mi?",
    urgency: "medium",
    status: "sent",
    fromAI: false,
    createdAt: "2026-02-15",
    doctor: "Dr. Ayşe Kaya",
  },
];

const urgencyOptions = [
  { value: "low", label: "Düşük", desc: "Genel soru, acil değil" },
  { value: "medium", label: "Orta", desc: "Yakın zamanda yanıt bekleniyor" },
  { value: "high", label: "Yüksek", desc: "Acil durum, hızlı yanıt gerekli" },
];

const messageTemplates = [
  { id: "symptom", icon: Activity, label: "Yeni Semptom", text: "Yeni bir semptom fark ettim: [belirtiyi yazın]. Ne zaman başladığı, şiddeti ve eşlik eden başka belirtiler şunlar: [detay]." },
  { id: "side_effect", icon: Pill, label: "İlaç Yan Etkisi", text: "[İlaç adı] ilacını almaya başladıktan sonra şu yan etkileri yaşıyorum: [yan etki]. İlacı ne zaman başladığım: [tarih]." },
  { id: "lab", icon: FileText, label: "Lab Sonucu", text: "Son kan tahlilimde şu değerler dikkatimi çekti: [değerler]. Tahlil tarihi: [tarih]. Değerlendirmenizi rica ederim." },
  { id: "appointment", icon: Calendar, label: "Randevu Talebi", text: "Kontrol randevusu talep etmek istiyorum. Müsait olduğum günler: [günler]. Öncelikli konu: [konu]." },
  { id: "ai_verify", icon: Bot, label: "AI Yanıtını Doğrula", text: "AI asistana sorduğum soru ve aldığım yanıtı sizinle paylaşmak istiyorum. Soru: [soru]. AI yanıtı: [yanıt]. Bu bilgiyi doğrular mısınız?" },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<DoctorMessage[]>(initialMessages);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<DoctorMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sendSuccess, setSendSuccess] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    urgency: "low" as "low" | "medium" | "high",
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredMessages =
    filterStatus === "all"
      ? messages
      : messages.filter((m) => m.status === filterStatus);

  const statusCounts = {
    all: messages.length,
    sent: messages.filter((m) => m.status === "sent").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-600 via-navy-500 to-teal-600 p-6 sm:p-7 text-white shadow-xl shadow-navy-500/20">
        <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={15} className="text-teal-300" />
              <span className="text-teal-300 text-sm font-semibold">Güvenli Mesajlaşma</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">Doktor Mesajları</h1>
              <DemoBadge text="Örnek veri" className="bg-white/90 border-white/50 text-amber-700" />
            </div>
            <p className="text-white/60 text-sm">Doktorunuzla güvenli bir şekilde iletişim kurun.</p>
          </div>
          <button
            onClick={() => { setShowNewModal(true); setSelectedTemplate(null); setNewMessage({ subject: "", content: "", urgency: "low" }); }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-navy-700 hover:bg-white/92 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-navy-900/15 flex-shrink-0"
          >
            <Plus size={15} />
            Yeni Mesaj
          </button>
        </div>
      </div>

      {/* Send success */}
      {sendSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-800">Mesajınız Dr. Ayşe Kaya&apos;ya iletildi.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Toplam",
            count: statusCounts.all,
            filter: "all",
            icon: Mail,
            color: "bg-slate-100 text-slate-600",
          },
          {
            label: "Gönderildi",
            count: statusCounts.sent,
            filter: "sent",
            icon: Send,
            color: "bg-sky-100 text-sky-600",
          },
          {
            label: "Okundu",
            count: statusCounts.read,
            filter: "read",
            icon: CheckCircle,
            color: "bg-amber-100 text-amber-600",
          },
          {
            label: "Yanıtlandı",
            count: statusCounts.replied,
            filter: "replied",
            icon: MessageSquare,
            color: "bg-emerald-100 text-emerald-600",
          },
        ].map((stat) => (
          <button
            key={stat.filter}
            onClick={() => setFilterStatus(stat.filter)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === stat.filter
                ? "border-navy-300 bg-navy-50 shadow-sm"
                : "border-slate-100 bg-white hover:border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={16} />
              </div>
              <span className="text-xl font-bold text-slate-900">
                {stat.count}
              </span>
            </div>
            <p className="text-xs text-slate-500 text-left">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <Card className="text-center py-12">
            <MessageSquare
              className="mx-auto text-slate-300 mb-3"
              size={48}
            />
            <p className="text-slate-500">Bu kategoride mesaj bulunmuyor.</p>
          </Card>
        ) : (
          filteredMessages.map((msg) => (
            <Card
              key={msg.id}
              hover
              padding="sm"
              onClick={() => setSelectedMessage(msg)}
              className="cursor-pointer"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {msg.fromAI && (
                        <Badge variant="info" className="gap-1">
                          <Bot size={10} />
                          AI
                        </Badge>
                      )}
                      <Badge
                        className={getUrgencyColor(msg.urgency)}
                      >
                        {msg.urgency === "high"
                          ? "Acil"
                          : msg.urgency === "medium"
                            ? "Orta"
                            : "Düşük"}
                      </Badge>
                      <Badge
                        className={getStatusColor(msg.status)}
                      >
                        {getStatusText(msg.status)}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mt-2">
                      {msg.subject}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {msg.content}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400">{msg.createdAt}</p>
                    <p className="text-xs text-slate-400 mt-1">{msg.doctor}</p>
                  </div>
                </div>
                {msg.reply && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle size={12} className="text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">
                        Doktor Yanıtı
                      </span>
                    </div>
                    <p className="text-sm text-emerald-800">{msg.reply}</p>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* New Message Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Doktora Yeni Mesaj"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Konu"
            placeholder="Mesajınızın konusu"
            value={newMessage.subject}
            onChange={(e) =>
              setNewMessage((prev) => ({ ...prev, subject: e.target.value }))
            }
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Mesajınız
            </label>
            <textarea
              rows={5}
              placeholder="Doktorunuza iletmek istediğiniz mesajı yazın..."
              value={newMessage.content}
              onChange={(e) =>
                setNewMessage((prev) => ({ ...prev, content: e.target.value }))
              }
              className="modern-field w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Aciliyet Seviyesi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {urgencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setNewMessage((prev) => ({
                      ...prev,
                      urgency: opt.value as "low" | "medium" | "high",
                    }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    newMessage.urgency === opt.value
                      ? "border-navy-300 bg-navy-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900">
                    {opt.label}
                  </p>
                  <p className="text-xs text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
          {/* Message Templates */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Şablon Seçin (isteğe bağlı)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {messageTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                    setNewMessage((prev) => ({ ...prev, subject: tpl.label, content: tpl.text }));
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    selectedTemplate === tpl.id
                      ? "border-navy-300 bg-navy-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <tpl.icon size={14} className="flex-shrink-0 text-slate-500" />
                  <span className="font-medium text-slate-700">{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {newMessage.urgency === "high" ? (
            <div className="bg-red-50 border border-red-300 rounded-xl p-3 flex gap-2">
              <ShieldAlert
                size={18}
                className="text-red-600 flex-shrink-0 mt-0.5"
              />
              <div className="text-xs text-red-800">
                <p className="font-bold mb-0.5">Bu mesaj acil yanıt garantisi vermez.</p>
                <p>Ateş, nefes darlığı, göğüs ağrısı, şiddetli ödem veya idrar azalması gibi belirtileriniz varsa hemen <strong>112</strong>&apos;yi arayın veya en yakın acil servise gidin. Mesajlaşma sistemi acil müdahale yerine geçmez.</p>
                <p className="mt-1 font-semibold">Doktorunuz genellikle 24 saat içinde yanıtlar.</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
              <AlertCircle
                size={16}
                className="text-amber-500 flex-shrink-0 mt-0.5"
              />
              <div className="text-xs text-amber-700">
                <p>Acil tıbbi durumlar için lütfen 112&apos;yi arayın veya en yakın acil servise başvurun. Bu mesajlaşma sistemi acil durumlar için uygun değildir.</p>
                <p className="mt-1 font-semibold">Doktorunuz genellikle 24 saat içinde yanıtlar.</p>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => { setShowNewModal(false); setSelectedTemplate(null); }}
            >
              İptal
            </Button>
            <Button
              className="flex-1"
              disabled={!newMessage.subject.trim() || !newMessage.content.trim()}
              onClick={() => {
                if (!newMessage.subject.trim() || !newMessage.content.trim()) return;
                const sent: DoctorMessage = {
                  id: String(Date.now()),
                  subject: newMessage.subject,
                  content: newMessage.content,
                  urgency: newMessage.urgency,
                  status: "sent",
                  fromAI: false,
                  createdAt: new Date().toISOString().split("T")[0],
                  doctor: "Dr. Ayşe Kaya",
                };
                setMessages((prev) => [sent, ...prev]);
                setNewMessage({ subject: "", content: "", urgency: "low" });
                setShowNewModal(false);
                setSendSuccess(true);
                setTimeout(() => setSendSuccess(false), 3000);
              }}
            >
              <Send size={16} />
              Mesaj Gönder
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Message Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || ""}
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {selectedMessage.fromAI && (
                <Badge variant="info" className="gap-1">
                  <Bot size={10} />
                  AI Kaynağı
                </Badge>
              )}
              <Badge
                className={getUrgencyColor(selectedMessage.urgency)}
              >
                {selectedMessage.urgency === "high"
                  ? "Acil"
                  : selectedMessage.urgency === "medium"
                    ? "Orta"
                    : "Düşük"}
              </Badge>
              <Badge
                className={getStatusColor(selectedMessage.status)}
              >
                {getStatusText(selectedMessage.status)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={14} />
              <span>{selectedMessage.createdAt}</span>
              <span>•</span>
              <span>{selectedMessage.doctor}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {selectedMessage.content}
              </p>
            </div>
            {selectedMessage.reply && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    Doktor Yanıtı - {selectedMessage.doctor}
                  </span>
                </div>
                <p className="text-sm text-emerald-800 whitespace-pre-wrap">
                  {selectedMessage.reply}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
