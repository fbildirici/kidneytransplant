"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  MessageSquare,
  Send,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Mail,
  Pill,
  Activity,
  Calendar,
  FileText,
  Bot,
  ShieldAlert,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/lib/toast-context";
import PageTitle from "@/components/PageTitle";
import { useAuth } from "@/lib/auth-context";
import {
  getPatientMessages,
  sendPatientMessage,
  type StoredMessage,
} from "@/lib/store";

const urgencyOptions = [
  { value: "low",    label: "Düşük öncelik", desc: "Genel soru, yanıt acil değil" },
  { value: "medium", label: "Normal öncelik", desc: "Birkaç gün içinde yanıt bekleniyor" },
  { value: "high",   label: "Yüksek öncelik", desc: "Hızlı yanıt gerektiren tıbbi soru" },
];

const messageTemplates = [
  { id: "symptom",     icon: Activity,  label: "Yeni Semptom",            text: "Yeni bir semptom fark ettim: [belirtiyi yazın]. Ne zaman başladığı, şiddeti ve eşlik eden başka belirtiler şunlar: [detay]." },
  { id: "side_effect", icon: Pill,      label: "İlaç Yan Etkisi",         text: "[İlaç adı] ilacını almaya başladıktan sonra şu yan etkileri yaşıyorum: [yan etki]. İlacı ne zaman başladığım: [tarih]." },
  { id: "lab",         icon: FileText,  label: "Lab Sonucu",              text: "Son kan tahlilimde şu değerler dikkatimi çekti: [değerler]. Tahlil tarihi: [tarih]. Değerlendirmenizi rica ederim." },
  { id: "appointment", icon: Calendar,  label: "Randevu Talebi",          text: "Kontrol randevusu talep etmek istiyorum. Müsait olduğum günler: [günler]. Öncelikli konu: [konu]." },
  { id: "ai_verify",   icon: Bot,       label: "Asistan Yanıtını Doğrula", text: "Sağlık asistanına sorduğum soru ve aldığım yanıtı sizinle paylaşmak istiyorum. Soru: [soru]. Asistan yanıtı: [yanıt]. Bu bilgiyi doğrular mısınız?" },
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch {
    return iso.split("T")[0];
  }
}

function getDisplayStatus(msg: StoredMessage): "sent" | "read" | "replied" {
  if (msg.replyContent) return "replied";
  if (msg.readByDoctor) return "read";
  return "sent";
}

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const patientId       = user?.uid ?? "1";
  const patientName     = profile?.displayName ?? "Hasta";
  const patientInitials = (profile?.firstName?.[0] ?? "H") + (profile?.lastName?.[0] ?? "");
  const doctorName      = profile?.doctorName ?? "Dr. Ayşe Kaya";

  const [messages, setMessages]             = useState<StoredMessage[]>([]);
  const [showNewModal, setShowNewModal]     = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<StoredMessage | null>(null);
  const [filterStatus, setFilterStatus]     = useState<string>("all");
  const toast = useToast();
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    urgency: "low" as "low" | "medium" | "high",
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    setMessages(getPatientMessages(patientId));
  }, [patientId]);

  const filteredMessages = messages.filter((m) => {
    if (filterStatus === "all") return true;
    return getDisplayStatus(m) === filterStatus;
  });

  const statusCounts = {
    all:     messages.length,
    sent:    messages.filter((m) => getDisplayStatus(m) === "sent").length,
    read:    messages.filter((m) => getDisplayStatus(m) === "read").length,
    replied: messages.filter((m) => getDisplayStatus(m) === "replied").length,
  };

  const handleSend = () => {
    if (!newMessage.subject.trim() || !newMessage.content.trim()) return;
    sendPatientMessage({
      patientId,
      patientName,
      patientInitials,
      senderRole: "patient",
      senderName: patientName,
      subject:   newMessage.subject,
      content:   newMessage.content,
      urgency:   newMessage.urgency,
    });
    setMessages(getPatientMessages(patientId));
    setNewMessage({ subject: "", content: "", urgency: "low" });
    setSelectedTemplate(null);
    setShowNewModal(false);
    toast.addToast(`Mesajınız ${doctorName}'ya iletildi.`, "success");
  };

  return (
    <>
      <PageTitle title="Mesajlar" />
      <div className="space-y-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 sm:p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-1">Mesajlar</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1">
                Sağlık Ekibinizle İletişim
              </h1>
              <p className="text-sm text-text-secondary max-w-lg">
                Doktorunuza ve sağlık ekibinize mesaj gönderin. Endişelerinizi, sorularınızı ve lab sonuçlarınızı güvenle paylaşın.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                onClick={() => {
                  setShowNewModal(true);
                  setSelectedTemplate(null);
                  setNewMessage({ subject: "", content: "", urgency: "low" });
                }}
              >
                <Plus size={15} />
                Yeni Mesaj
              </Button>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 bg-danger-50 border border-danger-200 rounded-[var(--radius-lg)] px-4 py-3">
            <ShieldAlert size={14} className="text-danger-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-danger-700 leading-relaxed">
              <span className="font-semibold">Acil durumlarda mesaj beklemek yerine 112'yi arayın.</span>{" "}
              Göğüs ağrısı, nefes darlığı, bilinç bulanıklığı, ciddi ateş veya ani kötüleşme durumlarında doğrudan acil sağlık hizmetine başvurun.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Toplam",     count: statusCounts.all,     filter: "all",     icon: Mail,          color: "bg-surface-muted text-text-secondary" },
            { label: "Gönderildi", count: statusCounts.sent,    filter: "sent",    icon: Send,          color: "bg-navy-50 text-navy-600" },
            { label: "Okundu",     count: statusCounts.read,    filter: "read",    icon: CheckCircle,   color: "bg-warning-50 text-warning-600" },
            { label: "Yanıtlandı", count: statusCounts.replied, filter: "replied", icon: MessageSquare, color: "bg-success-50 text-success-600" },
          ].map((stat) => (
            <button
              key={stat.filter}
              onClick={() => setFilterStatus(stat.filter)}
              className={`p-4 rounded-[var(--radius-lg)] border transition-all cursor-pointer ${
                filterStatus === stat.filter
                  ? "border-navy-300 bg-navy-50"
                  : "border-border bg-surface hover:border-border-hover"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={16} />
                </div>
                <span className="text-xl font-bold text-text-primary">{stat.count}</span>
              </div>
              <p className="text-xs text-text-tertiary text-left">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Message List */}
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="Bu kategoride mesaj bulunmuyor"
              description="Doktorunuza yeni bir mesaj göndererek iletişime geçebilirsiniz."
              action={{ label: "Yeni Mesaj", href: "/messages" }}
            />
          ) : (
            filteredMessages.map((msg) => {
              const status = getDisplayStatus(msg);
              return (
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
                          {msg.urgency === "high" ? (
                            <Badge variant="danger"><AlertCircle size={10} /> Acil</Badge>
                          ) : msg.urgency === "medium" ? (
                            <Badge variant="warning"><AlertCircle size={10} /> Orta</Badge>
                          ) : (
                            <Badge variant="success"><CheckCircle size={10} /> Düşük</Badge>
                          )}
                          {status === "sent" ? (
                            <Badge variant="info"><Send size={10} /> Gönderildi</Badge>
                          ) : status === "read" ? (
                            <Badge variant="warning"><Eye size={10} /> Okundu</Badge>
                          ) : (
                            <Badge variant="success"><MessageSquare size={10} /> Yanıtlandı</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-text-primary mt-2">{msg.subject}</h3>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{msg.content}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-text-tertiary">{formatDate(msg.sentAt)}</p>
                        <p className="text-xs text-text-tertiary mt-1">{doctorName}</p>
                      </div>
                    </div>
                    {msg.replyContent && (
                      <div className="mt-3 p-3 rounded-[var(--radius-lg)] bg-success-50 border border-success-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle size={12} className="text-success-600" />
                          <span className="text-xs font-medium text-success-700">Doktor Yanıtı</span>
                        </div>
                        <p className="text-sm text-success-800 line-clamp-2">{msg.replyContent}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
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
              onChange={(e) => setNewMessage((prev) => ({ ...prev, subject: e.target.value }))}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Mesajınız</label>
              <textarea
                rows={5}
                placeholder="Doktorunuza iletmek istediğiniz mesajı yazın..."
                value={newMessage.content}
                onChange={(e) => setNewMessage((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-[3px] focus:ring-navy-500/15 focus:border-navy-400 hover:border-border-strong resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Aciliyet Seviyesi</label>
              <div className="grid grid-cols-3 gap-2">
                {urgencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNewMessage((prev) => ({ ...prev, urgency: opt.value as "low" | "medium" | "high" }))}
                    className={`p-3 rounded-[var(--radius-lg)] border text-left transition-all cursor-pointer ${
                      newMessage.urgency === opt.value
                        ? "border-navy-300 bg-navy-50"
                        : "border-border hover:border-border-hover bg-surface"
                    }`}
                  >
                    <p className="text-sm font-medium text-text-primary">{opt.label}</p>
                    <p className="text-xs text-text-tertiary">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Şablon Seçin (isteğe bağlı)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {messageTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tpl.id);
                      setNewMessage((prev) => ({ ...prev, subject: tpl.label, content: tpl.text }));
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-[var(--radius-lg)] border text-left text-xs transition-all cursor-pointer ${
                      selectedTemplate === tpl.id
                        ? "border-navy-300 bg-navy-50"
                        : "border-border hover:border-border-hover bg-surface"
                    }`}
                  >
                    <tpl.icon size={14} className="flex-shrink-0 text-navy-500" />
                    <span className="font-medium text-text-secondary">{tpl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {newMessage.urgency === "high" ? (
              <div className="bg-danger-50 border border-danger-200 rounded-[var(--radius-lg)] p-4 flex gap-3">
                <ShieldAlert size={16} className="text-danger-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-danger-800">
                  <p className="font-semibold mb-1">Bu mesaj acil yanıt garantisi vermez.</p>
                  <p className="leading-relaxed mb-2">
                    Ateş (38°C üstü), nefes darlığı, göğüs ağrısı, şiddetli ödem veya idrar azalması gibi belirtileriniz varsa
                    hemen <span className="font-bold">112</span>'yi arayın.
                  </p>
                  <p className="font-medium text-danger-700">Doktorunuz genellikle 24 saat içinde yanıtlar.</p>
                </div>
              </div>
            ) : (
              <div className="bg-surface-muted border border-border rounded-[var(--radius-lg)] p-3 flex gap-2">
                <AlertCircle size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary leading-relaxed">
                  Acil tıbbi durumlar için 112'yi arayın. Doktorunuz mesajlarınızı genellikle 24 saat içinde yanıtlar.
                </p>
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
                onClick={handleSend}
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
          title={selectedMessage?.subject ?? ""}
          size="lg"
        >
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {selectedMessage.urgency === "high" ? (
                  <Badge variant="danger"><AlertCircle size={10} /> Acil</Badge>
                ) : selectedMessage.urgency === "medium" ? (
                  <Badge variant="warning"><AlertCircle size={10} /> Orta</Badge>
                ) : (
                  <Badge variant="success"><CheckCircle size={10} /> Düşük</Badge>
                )}
                {(() => {
                  const s = getDisplayStatus(selectedMessage);
                  return s === "sent" ? (
                    <Badge variant="info"><Send size={10} /> Gönderildi</Badge>
                  ) : s === "read" ? (
                    <Badge variant="warning"><Eye size={10} /> Okundu</Badge>
                  ) : (
                    <Badge variant="success"><MessageSquare size={10} /> Yanıtlandı</Badge>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-tertiary">
                <Clock size={14} />
                <span>{formatDate(selectedMessage.sentAt)}</span>
                <span>•</span>
                <span>{doctorName}</span>
              </div>
              <div className="p-4 bg-surface-muted rounded-[var(--radius-lg)]">
                <p className="text-sm text-text-primary whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
              {selectedMessage.replyContent && (
                <div className="p-4 bg-success-50 border border-success-100 rounded-[var(--radius-lg)]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle size={14} className="text-success-600" />
                    <span className="text-sm font-medium text-success-700">
                      Doktor Yanıtı — {selectedMessage.repliedBy ?? doctorName}
                    </span>
                  </div>
                  <p className="text-sm text-success-800 whitespace-pre-wrap">{selectedMessage.replyContent}</p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
