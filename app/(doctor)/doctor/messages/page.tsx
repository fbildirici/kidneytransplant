"use client";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  Search,
  Pill,
  FileText,
  Copy,
  AlertCircle,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import PageTitle from "@/components/PageTitle";
import { useAuth } from "@/lib/auth-context";
import {
  getDoctorMessages,
  replyToMessage,
  markDoctorRead,
  getPatient,
  getMedications,
  type StoredMessage,
  type PatientRecord,
  type StoredMedication,
} from "@/lib/store";

type FilterStatus = "all" | "unread" | "read" | "replied";

const urgencyConfig = {
  low:    { label: "Düşük", color: "text-text-secondary", bg: "bg-slate-100" },
  medium: { label: "Orta",  color: "text-amber-700",      bg: "bg-amber-100" },
  high:   { label: "Acil",  color: "text-red-700",        bg: "bg-red-100" },
};

function getDisplayStatus(msg: StoredMessage): "unread" | "read" | "replied" {
  if (msg.replyContent) return "replied";
  if (msg.readByDoctor) return "read";
  return "unread";
}

const statusConfig = {
  unread:  { label: "Okunmadı",  color: "bg-blue-100 text-blue-700" },
  read:    { label: "Okundu",    color: "bg-slate-100 text-text-secondary" },
  replied: { label: "Yanıtlandı", color: "bg-emerald-100 text-emerald-700" },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch {
    return iso.split("T")[0];
  }
}

export default function DoctorMessagesPage() {
  const { user } = useAuth();
  const doctorName = user?.displayName ?? "Dr. Ayşe Kaya";

  const [messages, setMessages]       = useState<StoredMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<StoredMessage | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientRecord | null>(null);
  const [patientMeds, setPatientMeds] = useState<StoredMedication[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery]   = useState("");
  const [replyText, setReplyText]       = useState("");
  const [activeTab, setActiveTab]       = useState<"message" | "epicrisis" | "medications">("message");
  const [copiedEpicrisis, setCopiedEpicrisis] = useState(false);

  useEffect(() => {
    setMessages(getDoctorMessages());
  }, []);

  const filteredMessages = messages
    .filter((m) => filterStatus === "all" || getDisplayStatus(m) === filterStatus)
    .filter(
      (m) =>
        m.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const counts = {
    all:     messages.length,
    unread:  messages.filter((m) => getDisplayStatus(m) === "unread").length,
    read:    messages.filter((m) => getDisplayStatus(m) === "read").length,
    replied: messages.filter((m) => getDisplayStatus(m) === "replied").length,
  };

  const openMessage = (msg: StoredMessage) => {
    setSelectedMsg(msg);
    setReplyText(msg.replyContent ?? "");
    setActiveTab("message");
    setCopiedEpicrisis(false);

    const patient = getPatient(msg.patientId);
    setPatientInfo(patient);
    setPatientMeds(getMedications(msg.patientId));

    if (!msg.readByDoctor && !msg.replyContent) {
      markDoctorRead([msg.id]);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, readByDoctor: true } : m))
      );
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMsg) return;
    replyToMessage(selectedMsg.id, replyText, doctorName);
    const updated = { ...selectedMsg, replyContent: replyText, repliedBy: doctorName, repliedAt: new Date().toISOString(), readByDoctor: true };
    setSelectedMsg(updated);
    setMessages((prev) =>
      prev.map((m) => (m.id === selectedMsg.id ? updated : m))
    );
  };

  const handleCopyEpicrisis = () => {
    if (patientInfo?.epicrisis) {
      navigator.clipboard.writeText(patientInfo.epicrisis);
      setCopiedEpicrisis(true);
      setTimeout(() => setCopiedEpicrisis(false), 2000);
    }
  };

  return (
    <>
      <PageTitle title="Hasta Mesajları" />
      <div className="space-y-6 max-w-6xl mx-auto">

        {/* Header */}
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

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(["all", "unread", "read", "replied"] as const).map((f) => {
            const labels: Record<FilterStatus | "all", string> = { all: "Tümü", unread: "Okunmadı", read: "Okundu", replied: "Yanıtlandı" };
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
                  {counts[f]}
                </span>
              </button>
            );
          })}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Hasta veya konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm rounded-[var(--radius-lg)] border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent w-52"
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
              const status = getDisplayStatus(msg);
              const urg = urgencyConfig[msg.urgency];
              const st  = statusConfig[status];
              return (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`bg-surface rounded-[var(--radius-lg)] border transition-all cursor-pointer hover:shadow-md ${
                    status === "unread"
                      ? "border-l-4 border-l-teal-500 border-border"
                      : "border-border hover:border-teal-200"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-medical-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {msg.patientInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className={`font-bold text-sm ${status === "unread" ? "text-text-primary" : "text-text-secondary"}`}>
                              {msg.patientName}
                            </span>
                            {msg.urgency === "high" && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                                <AlertCircle size={9} /> Acil
                              </span>
                            )}
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${urg.bg} ${urg.color}`}>
                              {urg.label}
                            </span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${st.color}`}>
                              {st.label}
                            </span>
                          </div>
                          <p className={`text-sm mb-1 ${status === "unread" ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}>
                            {msg.subject}
                          </p>
                          <p className="text-xs text-text-muted line-clamp-1">{msg.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-muted flex-shrink-0">
                        <Clock size={12} />
                        <span className="text-xs">{formatDate(msg.sentAt)}</span>
                      </div>
                    </div>
                    {msg.replyContent && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle size={12} className="text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">Yanıtınız</span>
                        </div>
                        <p className="text-xs text-emerald-800 line-clamp-2">{msg.replyContent}</p>
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
          title={selectedMsg?.subject ?? ""}
          size="lg"
        >
          {selectedMsg && (
            <div className="space-y-4">
              {/* Patient info */}
              <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-[var(--radius-lg)]">
                <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-medical-500 flex items-center justify-center text-white text-sm font-bold">
                  {selectedMsg.patientInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{selectedMsg.patientName}</p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {patientInfo && (
                      <>
                        <span className="text-xs text-text-tertiary">{patientInfo.age} yaş</span>
                        <span className="text-text-muted">·</span>
                        <span className="text-xs text-text-tertiary">Nakil: {patientInfo.transplantDate}</span>
                        <span className="text-text-muted">·</span>
                        <span className="text-xs text-text-tertiary">Kre: {patientInfo.creatinine}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${urgencyConfig[selectedMsg.urgency].bg} ${urgencyConfig[selectedMsg.urgency].color}`}>
                    {urgencyConfig[selectedMsg.urgency].label}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-surface-muted p-1 rounded-[var(--radius-lg)]">
                {(["message", "epicrisis", "medications"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === tab ? "bg-surface text-teal-700 shadow-card" : "text-text-tertiary hover:text-text-primary"
                    }`}
                  >
                    {tab === "message"     && <MessageSquare size={13} />}
                    {tab === "epicrisis"   && <FileText size={13} />}
                    {tab === "medications" && <Pill size={13} />}
                    {tab === "message" ? "Mesaj & Yanıt" : tab === "epicrisis" ? "Epikriz" : "İlaçlar"}
                  </button>
                ))}
              </div>

              {/* Message & Reply */}
              {activeTab === "message" && (
                <div className="space-y-3">
                  <div className="p-4 bg-surface-muted rounded-[var(--radius-lg)]">
                    <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{selectedMsg.content}</p>
                    <p className="text-xs text-text-muted mt-3">{formatDate(selectedMsg.sentAt)}</p>
                  </div>

                  {selectedMsg.replyContent && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-[var(--radius-lg)]">
                      <div className="flex items-center gap-1.5 mb-2">
                        <CheckCircle size={14} className="text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">Yanıtınız</span>
                      </div>
                      <p className="text-sm text-emerald-800 whitespace-pre-wrap">{selectedMsg.replyContent}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">
                      {selectedMsg.replyContent ? "Yanıtı Güncelle" : "Yanıt Yaz"}
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Hastanıza yanıtınızı yazın..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
                    />
                    <div className="flex gap-3">
                      <Button variant="ghost" className="flex-1" onClick={() => setSelectedMsg(null)}>
                        Kapat
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={!replyText.trim()}
                        onClick={handleSendReply}
                      >
                        <Send size={15} />
                        {selectedMsg.replyContent ? "Yanıtı Güncelle" : "Yanıt Gönder"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Epicrisis */}
              {activeTab === "epicrisis" && (
                <div>
                  {patientInfo?.epicrisis ? (
                    <>
                      <div className="p-4 bg-surface-muted rounded-[var(--radius-lg)] text-xs text-text-secondary leading-relaxed font-mono whitespace-pre-wrap">
                        {patientInfo.epicrisis}
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
                    </>
                  ) : (
                    <p className="text-sm text-text-tertiary text-center py-8">Bu hasta için epikriz kaydı bulunamadı.</p>
                  )}
                </div>
              )}

              {/* Medications */}
              {activeTab === "medications" && (
                <div className="space-y-2">
                  {patientMeds.length === 0 ? (
                    <p className="text-sm text-text-tertiary text-center py-8">Bu hasta için ilaç kaydı bulunamadı.</p>
                  ) : (
                    patientMeds.map((med) => (
                      <div key={med.id} className="flex items-center gap-3 p-3.5 bg-surface-muted rounded-[var(--radius-lg)]">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Pill size={14} className="text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{med.name}</p>
                          <p className="text-xs text-text-tertiary">{med.dosage} — {med.frequency}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
