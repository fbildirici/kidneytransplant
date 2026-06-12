"use client";
import { useState } from "react";
import {
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  Search,
  Bot,
  Pill,
  FileText,
  Copy,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import PageTitle from "@/components/PageTitle";

type Urgency = "low" | "medium" | "high";
type Status = "unread" | "read" | "replied";

interface PatientMessage {
  id: string;
  patientName: string;
  patientInitials: string;
  subject: string;
  content: string;
  urgency: Urgency;
  status: Status;
  fromAI: boolean;
  createdAt: string;
  reply?: string;
  patientAge: number;
  transplantDate: string;
  creatinine: string;
  tacrolimusLevel: string;
  medications: { name: string; dosage: string }[];
  epicrisis: string;
}

const initialMessages: PatientMessage[] = [
  {
    id: "1",
    patientName: "Ahmet Yılmaz",
    patientInitials: "AY",
    subject: "Tacrolimus seviyesi hakkında",
    content:
      "Sayın Dr. Kaya, son kan tahlilimde tacrolimus seviyem 12.5 ng/mL çıktı. Bu değer normal aralıkta mı? Endişelenmelimiyim? Biraz yorgunluk hissediyorum ayrıca.",
    urgency: "medium",
    status: "replied",
    fromAI: false,
    reply: "Ahmet Bey, tacrolimus seviyeniz biraz yüksek (hedef 8-12 ng/mL). Şu anki dozunuzu 1.5mg'a düşürelim. 1 hafta sonra tekrar kan tahlili yaptırın. Yorgunluk bu değerle ilgili olabilir. İyi dileklerimle.",
    createdAt: "2026-03-05",
    patientAge: 45,
    transplantDate: "15.06.2023",
    creatinine: "1.2 mg/dL",
    tacrolimusLevel: "12.5 ng/mL",
    medications: [
      { name: "Tacrolimus (Prograf)", dosage: "2mg → 1.5mg" },
      { name: "Mycophenolate (CellCept)", dosage: "500mg" },
      { name: "Prednizolon", dosage: "5mg" },
    ],
    epicrisis:
      "Ahmet Yılmaz, 45 yaşında erkek hasta. 15.06.2023 tarihinde canlı vericiden böbrek nakli yapıldı. Son kontrolde Tacrolimus düzeyi 12.5 ng/mL (hafif yüksek). Doz 1.5mg'a düşürüldü. Kreatinin stabil. Akut rejeksiyon bulgusu yok.",
  },
  {
    id: "2",
    patientName: "Mehmet Çelik",
    patientInitials: "MÇ",
    subject: "Ayak bileğinde şişlik - Acil",
    content:
      "Dr. Kaya, son 2 gündür sağ ayak bileğimde ciddi şişlik var. Nefes almakta da biraz zorluk çekiyorum. Acil bir durum mu bu?",
    urgency: "high",
    status: "unread",
    fromAI: false,
    createdAt: "2026-03-07",
    patientAge: 52,
    transplantDate: "20.11.2022",
    creatinine: "2.4 mg/dL",
    tacrolimusLevel: "4.1 ng/mL",
    medications: [
      { name: "Tacrolimus (Prograf)", dosage: "3mg" },
      { name: "Mycophenolate (CellCept)", dosage: "1000mg" },
      { name: "Prednizolon", dosage: "20mg" },
      { name: "Metilprednizolon IV", dosage: "500mg puls" },
    ],
    epicrisis:
      "Mehmet Çelik, 52 yaşında erkek hasta. 20.11.2022 tarihinde canlı vericiden nakil. Akut rejeksiyon episodu nedeniyle pulse steroid başlandı. Kreatinin 2.4 mg/dL (yüksek). Tacrolimus 4.1 ng/mL (kritik düşük). Biyopsi sonucu bekleniyor.",
  },
  {
    id: "3",
    patientName: "Fatma Demir",
    patientInitials: "FD",
    subject: "İlaç yan etkisi - Baş ağrısı",
    content:
      "Mycophenolate almaya başladıktan sonra düzenli baş ağrıları yaşıyorum. Mide bulantısı da var. Bu normal bir yan etki mi? Dozu azaltabilir miyiz?",
    urgency: "medium",
    status: "read",
    fromAI: false,
    createdAt: "2026-03-06",
    patientAge: 38,
    transplantDate: "03.03.2024",
    creatinine: "1.8 mg/dL",
    tacrolimusLevel: "6.2 ng/mL",
    medications: [
      { name: "Tacrolimus (Prograf)", dosage: "2mg" },
      { name: "Mycophenolate (CellCept)", dosage: "750mg" },
      { name: "Prednizolon", dosage: "10mg" },
    ],
    epicrisis:
      "Fatma Demir, 38 yaşında kadın hasta. 03.03.2024 tarihinde kadavradan nakil. Kreatinin 1.8 mg/dL (hafif yüksek). Tacrolimus 6.2 ng/mL (hedef altı). Mycophenolate yan etkileri gözlemleniyor. Doz revizyonu değerlendiriliyor.",
  },
  {
    id: "4",
    patientName: "Ahmet Yılmaz",
    patientInitials: "AY",
    subject: "Sağlık Asistanı Yanıtı - Beslenme sorusu",
    content:
      'Sağlık asistanına "Nakil sonrası hangi meyveleri yiyebilirim?" diye sordum. Özellikle greyfurt yemek istiyorum. Asistan greyfurttan kaçınmamı söyledi. Bu doğru mu?',
    urgency: "low",
    status: "unread",
    fromAI: true,
    createdAt: "2026-03-07",
    patientAge: 45,
    transplantDate: "15.06.2023",
    creatinine: "1.2 mg/dL",
    tacrolimusLevel: "12.5 ng/mL",
    medications: [
      { name: "Tacrolimus (Prograf)", dosage: "1.5mg" },
      { name: "Mycophenolate (CellCept)", dosage: "500mg" },
    ],
    epicrisis:
      "Ahmet Yılmaz, 45 yaşında erkek hasta. 15.06.2023 tarihinde canlı vericiden nakil. Stabil seyir. Beslenme danışmanlığı için diyetisyene yönlendirme yapıldı.",
  },
];

const urgencyConfig: Record<Urgency, { label: string; color: string; bg: string }> = {
  low: { label: "Düşük", color: "text-text-secondary", bg: "bg-slate-100" },
  medium: { label: "Orta", color: "text-amber-700", bg: "bg-amber-100" },
  high: { label: "Acil", color: "text-red-700", bg: "bg-red-100" },
};

const statusConfig: Record<Status, { label: string; color: string }> = {
  unread: { label: "Okunmadı", color: "bg-blue-100 text-blue-700" },
  read: { label: "Okundu", color: "bg-slate-100 text-text-secondary" },
  replied: { label: "Yanıtlandı", color: "bg-emerald-100 text-emerald-700" },
};

export default function DoctorMessagesPage() {
  const [messages, setMessages] = useState<PatientMessage[]>(initialMessages);
  const [selectedMsg, setSelectedMsg] = useState<PatientMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeDetailTab, setActiveDetailTab] = useState<"message" | "epicrisis" | "medications">("message");
  const [copiedEpicrisis, setCopiedEpicrisis] = useState(false);

  const filteredMessages = messages
    .filter((m) => filterStatus === "all" || m.status === filterStatus)
    .filter(
      (m) =>
        m.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const counts = {
    all: messages.length,
    unread: messages.filter((m) => m.status === "unread").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
  };

  const openMessage = (msg: PatientMessage) => {
    setSelectedMsg(msg);
    setReplyText(msg.reply || "");
    setActiveDetailTab("message");
    setCopiedEpicrisis(false);
    if (msg.status === "unread") {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m))
      );
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMsg) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMsg.id
          ? { ...m, status: "replied", reply: replyText }
          : m
      )
    );
    setSelectedMsg((prev) => (prev ? { ...prev, status: "replied", reply: replyText } : null));
  };

  const handleCopyEpicrisis = () => {
    if (selectedMsg) {
      navigator.clipboard.writeText(selectedMsg.epicrisis);
      setCopiedEpicrisis(true);
      setTimeout(() => setCopiedEpicrisis(false), 2000);
    }
  };

  return (
    <>
      <PageTitle title="Hasta Mesajları" />
      <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-navy-700 p-6 sm:p-7 text-white shadow-elevated">
        <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={15} className="text-white/70" />
              <span className="text-white/70 text-sm font-semibold">İletişim Merkezi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Hasta Mesajları</h1>
            <p className="text-white/60 text-sm">Hastalarınızın mesajlarını okuyun ve yanıtlayın.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-[var(--radius-lg)] px-4 py-2.5 text-center">
              <p className="text-xs text-white/60 font-medium">Toplam</p>
              <p className="text-xl font-bold text-white">{counts.all}</p>
            </div>
            {counts.unread > 0 && (
              <div className="bg-red-500/90 border border-red-400/30 rounded-[var(--radius-lg)] px-4 py-2.5 text-center">
                <p className="text-xs text-white/80 font-medium">Okunmadı</p>
                <p className="text-xl font-bold text-white">{counts.unread}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "unread", "read", "replied"] as const).map((f) => {
          const labels: Record<string, string> = { all: "Tümü", unread: "Okunmadı", read: "Okundu", replied: "Yanıtlandı" };
          return (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] text-sm font-semibold transition-all cursor-pointer ${
                filterStatus === f
                  ? "bg-teal-500 text-white shadow-md shadow-teal-500/25"
                  : "bg-surface border border-border text-text-secondary hover:border-border-hover"
              }`}
            >
              {labels[f]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                filterStatus === f ? "bg-white/20 text-white" : "bg-slate-100 text-text-secondary"
              }`}>
                {counts[f as keyof typeof counts]}
              </span>
            </button>
          );
        })}

        {/* Search */}
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Hasta veya konu ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="modern-field pl-8 pr-4 py-2 text-sm rounded-[var(--radius-lg)] border border-border focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent w-52"
          />
        </div>
      </div>

      {/* Message List */}
      <div className="space-y-2">
        {filteredMessages.length === 0 ? (
          <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-12 text-center">
            <MessageSquare size={40} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-tertiary">Bu kategoride mesaj bulunmuyor.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const urg = urgencyConfig[msg.urgency];
            const st = statusConfig[msg.status];
            return (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`bg-surface rounded-[var(--radius-lg)] border transition-all cursor-pointer hover:shadow-md ${
                  msg.status === "unread"
                    ? "border-l-4 border-l-teal-500 border-border"
                    : "border-border hover:border-teal-200"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-medical-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {msg.patientInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`font-bold text-sm ${msg.status === "unread" ? "text-text-primary" : "text-text-secondary"}`}>
                            {msg.patientName}
                          </span>
                          {msg.fromAI && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                              <Bot size={9} />
                              AI
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${urg.bg} ${urg.color}`}>
                            {urg.label}
                          </span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                        <p className={`text-sm mb-1 ${msg.status === "unread" ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}>
                          {msg.subject}
                        </p>
                        <p className="text-xs text-text-muted line-clamp-1">{msg.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted flex-shrink-0">
                      <Clock size={12} />
                      <span className="text-xs">{msg.createdAt}</span>
                    </div>
                  </div>

                  {msg.reply && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CheckCircle size={12} className="text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">Yanıtınız</span>
                      </div>
                      <p className="text-xs text-emerald-800 line-clamp-2">{msg.reply}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Detail Modal */}
      <Modal
        isOpen={!!selectedMsg}
        onClose={() => setSelectedMsg(null)}
        title={selectedMsg?.subject || ""}
        size="lg"
      >
        {selectedMsg && (
          <div className="space-y-4">
            {/* Patient info row */}
            <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-[var(--radius-lg)]">
              <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-medical-500 flex items-center justify-center text-white text-sm font-bold">
                {selectedMsg.patientInitials}
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{selectedMsg.patientName}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-text-tertiary">{selectedMsg.patientAge} yaş</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-xs text-text-tertiary">Nakil: {selectedMsg.transplantDate}</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-xs text-text-tertiary">Kre: {selectedMsg.creatinine}</span>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${urgencyConfig[selectedMsg.urgency].bg} ${urgencyConfig[selectedMsg.urgency].color}`}>
                  {urgencyConfig[selectedMsg.urgency].label}
                </span>
              </div>
            </div>

            {/* Inner tabs */}
            <div className="flex gap-1 bg-surface-muted p-1 rounded-[var(--radius-lg)]">
              {(["message", "epicrisis", "medications"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeDetailTab === tab ? "bg-surface text-teal-700 shadow-card" : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  {tab === "message" && <MessageSquare size={13} />}
                  {tab === "epicrisis" && <FileText size={13} />}
                  {tab === "medications" && <Pill size={13} />}
                  {tab === "message" ? "Mesaj & Yanıt" : tab === "epicrisis" ? "Epikriz" : "İlaçlar"}
                </button>
              ))}
            </div>

            {/* Message & Reply tab */}
            {activeDetailTab === "message" && (
              <div className="space-y-3">
                {selectedMsg.fromAI && (
                  <div className="flex items-center gap-2 p-2.5 bg-purple-50 border border-purple-100 rounded-[var(--radius-lg)]">
                    <Bot size={14} className="text-purple-600" />
                    <p className="text-xs text-purple-700 font-medium">Bu mesaj sağlık asistanı konuşmasından iletilmiştir.</p>
                  </div>
                )}
                <div className="p-4 bg-surface-muted rounded-[var(--radius-lg)]">
                  <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{selectedMsg.content}</p>
                  <p className="text-xs text-text-muted mt-3">{selectedMsg.createdAt}</p>
                </div>

                {selectedMsg.reply && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-[var(--radius-lg)]">
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">Yanıtınız</span>
                    </div>
                    <p className="text-sm text-emerald-800 whitespace-pre-wrap">{selectedMsg.reply}</p>
                  </div>
                )}

                {/* Reply textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">
                    {selectedMsg.reply ? "Yanıtı Güncelle" : "Yanıt Yaz"}
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Hastanıza yanıtınızı yazın..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="modern-field w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setSelectedMsg(null)}
                    >
                      Kapat
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSendReply}
                    >
                      <Send size={15} />
                      {selectedMsg.reply ? "Yanıtı Güncelle" : "Yanıt Gönder"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Epicrisis tab */}
            {activeDetailTab === "epicrisis" && (
              <div>
                <div className="p-4 bg-surface-muted rounded-[var(--radius-lg)] text-xs text-text-secondary leading-relaxed font-mono whitespace-pre-wrap">
                  {selectedMsg.epicrisis}
                </div>
                <button
                  onClick={handleCopyEpicrisis}
                  className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-lg)] border-2 text-sm font-semibold transition-all cursor-pointer ${
                    copiedEpicrisis
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                  }`}
                >
                  {copiedEpicrisis ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copiedEpicrisis ? "Epikriz Kopyalandı!" : "Epikriz Metnini Kopyala"}
                </button>
              </div>
            )}

            {/* Medications tab */}
            {activeDetailTab === "medications" && (
              <div className="space-y-2">
                {selectedMsg.medications.map((med, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-surface-muted rounded-[var(--radius-lg)]">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Pill size={14} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{med.name}</p>
                      <p className="text-xs text-text-tertiary">{med.dosage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
    </>
  );
}
