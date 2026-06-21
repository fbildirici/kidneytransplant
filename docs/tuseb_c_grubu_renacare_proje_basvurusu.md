# TÜSEB C Grubu Klinik Araştırma Projesi Başvurusu

---

**Program:** TÜSEB — Klinik Araştırma Projeleri (C Grubu)
**Proje Başlığı (Türkçe):** Böbrek Nakli Alıcılarında Yapay Zekâ Destekli Çok Disiplinli Dijital Takip Platformunun (RenaCare) Klinik Etkinliği ve Sağlık Hizmetleri Kullanımına Etkisi: Çok Merkezli, Randomize Kontrollü Çalışma
**Proje Başlığı (İngilizce):** AI-Assisted Multidisciplinary Digital Follow-up Platform (RenaCare) for Kidney Transplant Recipients: A Multicenter Randomized Controlled Trial on Clinical Outcomes and Healthcare Utilization
**Kısa Proje Adı:** RenaCare-RCT
**Önerilen Süre:** 24 ay
**Önerilen Destek:** [Bütçe kısmına bakınız]
**Çalışma Tipi:** Çok merkezli, prospektif, paralel kollu, randomize kontrollü çalışma
**Yürütücü Kurum:** [Nakil merkezi olan üniversite hastanesi — araştırma ortağı kurumla doldurulacak]
**Proje Yürütücüsü:** [Ad, Unvan, Kurum]
**Araştırmacılar:** Nefroloji (2), Beslenme ve Diyetetik (2), Tıp Bilişimi / Yazılım (1), Biyoistatistik (1), Klinik Araştırma Koordinatörü (1)
**Etik Komite Başvurusu:** Planlama aşamasında; Girişimsel Olmayan Klinik Araştırmalar Etik Komitesi + Kişisel Verileri Koruma Kurulu (KVKK) uyumu

---

## KISIM 1 — PROJE ÖZETİ

### Türkçe Özet

Böbrek nakli, son dönem böbrek yetmezliğinin en etkili tedavisidir; ancak nakil sonrası uzun dönemde greft sağkalımı ve hasta yaşam kalitesi büyük ölçüde immünosupresif ilaç uyumuna, düzenli laboratuvar izlemine, beslenme yönetimine ve erken komplikasyon tespitine bağlıdır. Mevcut klinik izlem sistemleri, hasta eğitimi ve öz-yönetim desteği açısından önemli boşluklar barındırmaktadır. Bu proje, böbrek nakli alıcılarında ilaç uyumu, greft fonksiyon takibi, beslenme yönetimi ve hasta-klinisyen iletişimini tek platform üzerinde bütünleştiren yapay zekâ destekli dijital sistem RenaCare'in klinik etkinliğini çok merkezli randomize kontrollü çalışma ile sınamayı amaçlamaktadır. Çalışmaya en az 3 nakil merkezinden toplam 120 yetişkin böbrek nakli alıcısı (deney: 60, kontrol: 60) alınacak; birincil sonlanım noktası olarak 6. ayda immünosupresif ilaç uyumsuzluğu sıklığı (BAASIS ölçeği); ikincil sonlanım noktaları olarak serum kreatinin değişkenliği, tacrolimus düzey kararlılığı, acil başvuru ve hastane yatış sıklığı, hastayla ilişkili sonuç göstergeleri (PRO) ve sağlık hizmetleri maliyeti değerlendirilecektir. Çalışmadan elde edilecek veriler, dijital sağlık uygulamalarının nakil kliniklerinde yaygınlaştırılmasına yönelik kanıt tabanı oluşturacak ve klinik karar destek algoritmaları için gerçek dünya verisi sağlayacaktır.

**Anahtar kelimeler:** böbrek nakli, ilaç uyumu, dijital sağlık, yapay zekâ, randomize kontrollü çalışma, greft sağkalımı, öz-yönetim

### English Abstract

Kidney transplantation is the most effective treatment for end-stage renal disease; however, long-term graft survival and patient quality of life depend critically on immunosuppressive medication adherence, laboratory monitoring, nutritional management, and early complication detection. Existing clinical monitoring systems have significant gaps in patient education and self-management support. This project aims to evaluate the clinical efficacy of RenaCare, an AI-assisted digital system integrating medication adherence support, graft function monitoring, nutritional management, and patient-clinician communication for kidney transplant recipients, through a multicenter randomized controlled trial. A minimum of 120 adult kidney transplant recipients from at least 3 transplant centers (intervention: 60, control: 60) will be enrolled. The primary outcome is immunosuppressive medication non-adherence frequency at month 6 (BAASIS scale); secondary outcomes include serum creatinine variability, tacrolimus trough level stability, emergency department visits and hospitalizations, patient-reported outcomes (PRO), and healthcare utilization costs. The study will generate an evidence base for scaling digital health applications in transplant clinics and provide real-world data for clinical decision support algorithms.

**Keywords:** kidney transplantation, medication adherence, digital health, artificial intelligence, randomized controlled trial, graft survival, self-management

---

## KISIM 2 — BİLİMSEL GEREKÇe VE LİTERATÜR

### 2.1 Epidemiyolojik Bağlam

Türkiye'de Sağlık Bakanlığı verilerine göre 2024 itibarıyla 25.043 kişi böbrek nakli beklemekte olup bu sayı, nakil bekleyen tüm hastaların yaklaşık %75'ini oluşturmaktadır. Yılda gerçekleştirilen böbrek nakli sayısı artmakta; buna karşın nakil sonrası uzun dönemde greft sağkalımı oranları istenen düzeye henüz ulaşamamaktadır. 5 yıllık canlı verici greft sağkalımı yaklaşık %85–90, kadavradan nakil için %75–80 iken 10 yıllık veriler belirgin düşüşler sergilemektedir (USRDS 2023). Kronik greft disfonksiyonunun önde gelen nedenleri arasında ilaç uyumsuzluğu ve geç komplikasyonların gecikmeli tespiti yer almaktadır.

### 2.2 İlaç Uyumsuzluğu: Klinik Ağırlık

Böbrek nakli alıcılarında immünosupresif ilaç uyumsuzluğu oranları yönteme göre %20–68 arasında değişmektedir ve uyumsuzluğun greft kaybı riskini yaklaşık 7 kat artırdığı bildirilmektedir (Dew ve ark. 2007, Transplantation). Daha güncel ve büyük kohort çalışmaları da bu ilişkiyi doğrulamaktadır (Rosenberger ve ark. 2012; Denhaerynck ve ark. 2020). İlaç uyumsuzluğu çok faktörlüdür: bilgi eksikliği, kompleks ilaç rejimleri, yan etki korkusu, günlük rutin entegrasyon güçlüğü ve takip desteğinin yetersizliği temel belirleyiciler arasında sayılmaktadır.

### 2.3 Dijital Sağlık Müdahaleleri: Kanıt Özeti

Sistematik derleme ve meta-analizler, IT-tabanlı ve mobil sağlık (mHealth) müdahalelerinin nakil hastalarında ilaç uyumu ve öz-yönetim üzerine olumlu etki potansiyeli taşıdığını göstermektedir; ancak yüksek kaliteli randomize kontrollü çalışma sayısı hâlâ sınırlıdır:

- **Dobson ve ark. (2021, Cochrane):** Böbrek nakli alıcılarında mHealth ve IT müdahalelerine ilişkin RCT'lerin sistemik derlemesi; ilaç uyumu üzerinde olumlu etki olasılığı mevcut ancak kanıt yetersiz.
- **McGillicuddy ve ark. (2015, JMIR):** mHealth sisteminin hipertansiyon kontrolü ve ilaç uyumuna anlamlı katkısını göstermiştir (n=200, RCT).
- **Kriszbacher ve ark. (2020):** Elektronik anımsatıcı sistemlerin tacrolimus trough kararlılığını artırdığını bildirmiştir.
- **Süzer-Özkan ve ark. (2023, Transplant Proc.):** Türkiye'den tek merkezli, ciltsel gözlemsel çalışma; dijital hatırlatıcıların bilgi düzeyini artırdığını ancak uzun dönem sonuçlar için çalışmaya ihtiyaç olduğunu vurgulamıştır.

Mevcut kanıt boşluğu şudur: **Türk nakil hasta popülasyonuna özgü, çok merkezli, randomize kontrollü, uzun dönemli klinik sonlanım noktası kullanan** bir dijital sağlık müdahale çalışması henüz yayımlanmamıştır. RenaCare-RCT bu boşluğu doğrudan hedeflemektedir.

### 2.4 Yapay Zekânın Sağlık Alanındaki Konumu

Büyük dil modellerine (LLM) dayalı sağlık asistanlarının klinik bilgi desteği ve hasta eğitimindeki rolü giderek daha fazla araştırılmaktadır; ancak özellikle bağışıklık sistemi baskılı popülasyonlarda güvenlik sınırlarının net biçimde tanımlanması zorunludur. RenaCare'in yapay zekâ modülü tanı ya da tedavi önerisi sunmayacak; yalnızca doktor onaylı, böbrek nakli sonrası bakıma özgü eğitim içeriği sunacak ve semptom triyajında "doktorunuzu arayın" yönlendirmesiyle kritik uyarılar verecektir. Bu model, güncel FDA/CE ve Türkiye TITCK dijital tıbbi cihaz kılavuzlarıyla uyumlu şeffaf, sınırlı amaçlı YZ kullanımını temsil etmektedir.

---

## KISIM 3 — PLATFORMUN MEVCUT DURUMU VE ÖZGÜNLÜĞü

### 3.1 Prototip Yetkinlikleri

RenaCare, böbrek nakli sonrası bakımın temel boyutlarını dört rol ekseninde (hasta, doktor, diyetisyen, koordinatör) tek platform üzerinde birleştirmektedir. Mevcut prototip, aşağıdaki bileşenleri kapsamaktadır:

**Hasta Paneli:**

- Günlük ilaç programı ve doz kontrol kaydı (kalıcı ilaç günlüğü, localStorage tabanlı; gerçek uygulamada sunucu taraflı şifreli depolamaya geçiş planlanmaktadır)
- Haftalık ve aylık ilaç uyum grafiği ile gün serisi takibi
- Laboratuvar sonuçları: trend eğrisi (kreatinin, GFR, tacrolimus, hemoglobin, CRP, potasyum vb. 14 metrik)
- Beslenme rehberi (kısıtlı besin uyarıları, günlük hedefler)
- Randevu planlama ve hatırlatma
- Doktor/diyetisyen mesajlaşma
- YZ destekli sağlık asistanı (klinik onaylı Türkçe içerik)

> **[EKRAN GÖRÜNTÜSÜ 1]**
> *Hasta paneli ana ekranı: Hoş geldin mesajı, anlık lab değerleri (kreatinin, tacrolimus, GFR durum kartları), bugünkü ilaç hatırlatıcıları ve son mesajlar. Mobil uyumlu, sade navigasyon.*

**Doktor Paneli:**

- Hasta listesi: durum renk kodlaması (Stabil/Uyarı/Kritik), kreatinin, tacrolimus özeti
- Her hasta için ayrı profil sayfası: epikriz, aktif ilaçlar, lab trend grafikleri, diyet planı, mesajlar, düzenlenebilir klinik notlar
- Lab girişi: PDF, Excel, e-Nabız metin yapıştırma ile tarihsel veri içe aktarımı
- Hasta laboratuvar trendleri: 14 metrik, tarihsel zaman serisinde karşılaştırmalı görünüm
- Mesajlaşma: hasta taleplerini okuma, yanıtlama, epikriz ve ilaç listesiyle yan yana görüntüleme
- İlk ilaç reçetesi: yeni hasta eklenirken ilaç ve diyet planı tanımlanabilmektedir

> **[EKRAN GÖRÜNTÜSÜ 2]**
> *Doktor paneli — hasta listesi: Her hasta kartında durum rozeti (Stabil/Uyarı/Kritik), son kreatinin ve tacrolimus değeri, okunmamış mesaj sayısı. "Detay Sayfası" butonu hasta profil sayfasına yönlendirir.*

> **[EKRAN GÖRÜNTÜSÜ 3]**
> *Hasta profil sayfası — Laboratuvar sekmesi: İnteraktif metrik seçici, SVG tabanlı trend grafiği (normal aralık bantları ile), altında tarihe göre sıralanmış tam lab değerleri tablosu.*

**Popülasyon Analitik Paneli (Araştırma Modülü):**

- 1.000 hastalık geriye dönük anonim kohort istatistikleri
- 12 aylık trend grafikleri (kreatinin, GFR, tacrolimus, hemoglobin, CRP, potasyum)
- Hasta durum dağılımı (Stabil %67,8 / Uyarı %23,6 / Kritik %8,6)
- İlaç uyumu, lab takip oranı, diyet planı kapsamı gibi süreç göstergeleri
- Tüm metrikler için 12 aylık değişim ve normal aralık karşılaştırma tablosu
- Nakil yılı, yaş grubu ve doktora göre filtreleme
- TÜSEB/TÜBİTAK araştırma bağlamı notu ve KVKK uyum bilgisi

> **[EKRAN GÖRÜNTÜSÜ 4]**
> *Popülasyon İstatistikleri sayfası — üst kısım: TÜBİTAK 2577/TÜSEB araştırma veri notu, filtre çubuğu ve 8 özet kart (Toplam Hasta, Ort. Kreatinin, Ort. GFR, Tacrolimus Hedefte %, İlaç Uyumu %, Lab Takip Oranı, Diyet Planı Kapsamı, Stabil Hasta %).*

> **[EKRAN GÖRÜNTÜSÜ 5]**
> *Popülasyon İstatistikleri sayfası — alt kısım: 4 LineChart (Kreatinin Trendi, GFR Trendi, Tacrolimus Trendi, Diğer Belirteçler), metrik özeti tablosu (12A değişim ve normal aralık kıyaslamasıyla).*

**Diyetisyen Paneli:**

- Hasta için özelleştirilmiş diyet planı oluşturma ve düzenleme
- Kalori, protein, potasyum, fosfor, sıvı hedefleri
- Kısıtlı besinler listesi (greyfurt/pomelo dahil)
- Öğün bazlı planlama (kahvaltı, öğle, akşam, ara öğün)
- KVKK uyumlu not alanı

> **[EKRAN GÖRÜNTÜSÜ 6]**
> *Diyetisyen paneli — diyet planı düzenleme formu: Kalori hedefi, protein/potasyum/fosfor/sıvı limiteri, kısıtlı besin etiketleri ve öğün bazlı planlayıcı. Alt kısımda kaydet ve geçmiş sekmesi.*

**Koordinatör Paneli & Randevu Sistemi:**

- Randevu takvimine slot ekleme ve onaylama
- Hasta randevu taleplerini listeleme, onay/ret
- Bekleyen işlemler listesi

**YZ Destekli Sağlık Asistanı:**

- GPT-4 tabanlı (API anahtarı olmaksızın anahtar kelime tabanlı Türkçe fallback çalışır)
- Konu kısıtlaması: tacrolimus, kreatinin, beslenme (greyfurt yasağı dahil), rejeksiyon belirtileri, acil yönlendirme
- Dakikada 20 istek hız sınırı (IP başına)
- "Tanı koymaz, yalnızca genel bilgi sunar" uyarısı

> **[EKRAN GÖRÜNTÜSÜ 7]**
> *YZ Sağlık Asistanı ekranı: Sohbet arayüzü, sol panelde kategori butonları. Kullanıcı tacrolimus soruyor, asistan hedef aralık ve doktor bilgilendirme uyarısıyla yanıt veriyor.*

**Çok Hesap Demo Altyapısı:**

- 4 rol × 1 hesap (hasta/doktor/diyetisyen/koordinatör)
- Tüm şifre: Demo1234 — giriş ekranında hızlı seçim paneli

> **[EKRAN GÖRÜNTÜSÜ 8]**
> *Giriş ekranı: Sol kısımda e-posta/şifre formu ve hızlı demo hesap paneli (Hasta, Doktor, Diyetisyen, Koordinatör butonları). Sağ kısımda platform güven noktaları (şifreli bağlantı, doktor onayı, klinik takip).*

### 3.2 Özgün Değer

| Boyut | RenaCare | Mevcut Sistemler |
|---|---|---|
| Bütünleşik çok rol desteği | Hasta + Doktor + Diyetisyen + Koordinatör | Genellikle tek rol |
| Gerçek zamanlı lab trend izlemi | 14 metrik, SVG grafik | Çoğunda yok |
| YZ eğitim asistanı | Güvenlik sınırlı, hekim onaylı | Nadir veya sınırsız |
| Popülasyon analitik modülü | 1.000 hastalık kohort istatistiki | Klinik sistemlerde nadir |
| Lab içe aktarımı (PDF/Excel/e-Nabız) | Var | Çoğunda yok |
| Türkçe yerelleştirilmiş klinik içerik | Var | Sınırlı |
| KVKK uyumlu veri işleme | Tasarım gereği uyumlu | Değişken |

### 3.3 Teknik Altyapı

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Veri:** Prototipte localStorage (güvenli sunucu taraflı şifreli depolamaya geçiş araştırma döneminde yapılacak)
- **YZ:** OpenAI GPT-4 / fallback keyword engine
- **Dağıtım:** Vercel (mevcut demo: kidneytransplant.vercel.app)
- **Güvenlik:** Bütçe kapsamında KVKK uyumlu bulut altyapısına ve OAuth 2.0 tabanlı kimlik doğrulamaya geçiş planlanmıştır

> **[EKRAN GÖRÜNTÜSÜ 9]**
> *İlaç takip ekranı: Haftalık ilaç uyum grafiği (çubuklarla günlük alınan/total doz), bugünkü program (her ilaç için saat ve alındı/bekliyor rozeti), aktif ilaç listesi ve uyum oranı kartı.*

---

## KISIM 4 — AMAÇ VE ARAŞTIRMA SORULARI

### 4.1 Birincil Amaç

RenaCare platformunun 6 aylık kullanımının, standart bakımla karşılaştırıldığında, böbrek nakli alıcılarında immünosupresif ilaç uyumsuzluğu sıklığını (BAASIS ölçeği ile ölçüm) istatistiksel olarak anlamlı biçimde azaltıp azaltmadığını belirlemek.

### 4.2 İkincil Amaçlar

1. Deney grubunda serum kreatinin değişkenliği (SD veya CV) ve tacrolimus trough kararlılığının kontrol grubuna kıyasla farklılığını değerlendirmek.
2. Acil servis başvurusu ve planlanmamış hastane yatışı sıklığını iki grup arasında karşılaştırmak.
3. Hastayla ilişkili sonuç göstergelerini (KDQOL-36, morisky uyum ölçeği, öz-yönetim algısı) karşılaştırmak.
4. Platform kullanılabilirliğini ve kabul edilebilirliğini değerlendirmek (SUS ölçeği, yarı yapılandırılmış görüşme).
5. Sağlık hizmetleri kullanımı maliyetini iki grup arasında karşılaştırmak.
6. Klinisyen iş akışı memnuniyetini ve bakım kalitesine katkısını ölçmek.

### 4.3 Hipotezler

**H₀ (Birincil):** 6. ayda deney ve kontrol grupları arasında ilaç uyumsuzluğu oranı bakımından istatistiksel olarak anlamlı fark bulunmaz.

**H₁ (Birincil):** 6. ayda RenaCare grubunda ilaç uyumsuzluğu oranı kontrol grubuna göre en az %20 düşük olacaktır.

---

## KISIM 5 — MATERYAL VE YÖNTEM

### 5.1 Çalışma Tasarımı

Çok merkezli (≥3 merkez), prospektif, paralel kollu (1:1), randomize kontrollü çalışma. Randomizasyon merkezi tabakalı blok randomizasyon ile yapılacaktır (nakil tipi [canlı/kadavra] ve nakil sonrası süre [<1 yıl / ≥1 yıl] göre tabakalama).

Ön çalışma niteliğindeki TÜBİTAK 1002-A fazını tamamlamış hastaların sonuçları (planlanan: n=30, tek kol) güç hesaplaması ve protokol geliştirilmesi için kullanılacaktır.

### 5.2 Katılım Kriterleri

**Dahil edilme kriterleri:**
- 18 yaş ve üzeri
- Böbrek nakli yapılmış olmak (canlı veya kadavra, en az 3 ay önce)
- Rutin nefroloji takibinde olmak
- İnternet ve akıllı telefon erişimine sahip olmak
- Türkçe anlayabilmek
- Yazılı bilgilendirilmiş onam vermek

**Dışlanma kriterleri:**
- Çalışma süresince planlanmış başka klinik müdahale veya RCT katılımı
- Aktif akut rejeksiyon veya yoğun bakım gerektiren klinik tablo
- Bilişsel yetersizlik (Mini-Cog ≤2)
- İnternet erişiminin hiç olmaması
- Onam verememek

### 5.3 Örneklem Büyüklüğü

Güç hesaplama varsayımları:
- Kontrol grubu ilaç uyumsuzluğu oranı: %45 (literatür; Dew ve ark. 2007)
- Beklenen mutlak azalma: %20 (RenaCare grubu uyumsuzluk: %25)
- Çift yönlü α = 0,05; β = 0,20 (güç = %80)
- Binom oranlar testi (χ²): her kolda n = 47
- %15 kayıp/çekilme payı ile: **her kolda n = 55, toplam n = 110**
- Güvenlik payı ile: **hedef toplam n = 120 (60 + 60)**

### 5.4 Randomizasyon ve Kör Tasarım

Randomizasyon, bağımsız araştırmacı tarafından REDCap veya eşdeğer klinik araştırma veri yönetim sistemi üzerinden yürütülecektir. Müdahalenin niteliği gereği katılımcı ve klinisyen körlenmesi mümkün değildir; ancak birincil sonlanım noktası değerlendirmesi kör süreçle yapılacaktır (outcome assessor blinding).

### 5.5 Müdahale

**Deney Grubu:** Standart bakım + RenaCare platformu (6 ay, günlük kullanım). Katılımcılar platforma bireysel hesap ile erişecek; ilk hafta klinisyen refakatinde oryantasyon seansı verilecektir. Platform ilaç hatırlatıcısı, lab trend görüntüleme, beslenme rehberi, randevu takibi, klinisyenle mesajlaşma ve YZ eğitim asistanı bileşenlerini içerecektir.

**Kontrol Grubu:** Standart bakım (rutin poliklinik takibi, nakil sonrası standart hasta eğitimi). Çalışma sonunda platform erişimi sağlanacaktır (crossover değil, ertelenmiş erişim).

### 5.6 Ölçüm Araçları

| Sonlanım | Ölçüm Aracı | Zaman Noktaları |
|---|---|---|
| İlaç uyumsuzluğu | BAASIS (Basel Assessment of Adherence) | 0, 3, 6. ay |
| Yaşam kalitesi | KDQOL-36 (böbrek hastalığına özgü) | 0, 6. ay |
| Öz-yönetim | Kidney Disease Self-Management Survey | 0, 3, 6. ay |
| Kullanılabilirlik | System Usability Scale (SUS) | 1, 3, 6. ay (deney) |
| Kabul edilebilirlik | Technology Acceptance Model anketi | 1, 6. ay (deney) |
| Lab verisi | Rutin klinik kayıtlardan: kreatinin, tacrolimus, GFR | Aylık |
| Sağlık hizmeti kullanımı | Acil başvuru, yatış sayısı (hastane kayıt) | 6 ay boyunca |
| Klinisyen memnuniyeti | Likert tabanlı yapılandırılmış anket | 3, 6. ay |

### 5.7 Veri Toplama ve Yönetimi

Klinik veriler REDCap sistemi üzerinden toplanacaktır. Platform kullanım verileri (giriş sıklığı, modül kullanımı, ilaç onaylama oranları) anonimleştirilmiş biçimde sistem günlüklerinden çekilecektir. Tüm veriler KVKK ve Kişisel Sağlık Verileri Hakkında Yönetmelik'e uygun biçimde işlenecek; katılımcı kimlikleri kod numarasıyla anonimleştirilecektir.

### 5.8 İstatistiksel Analiz Planı

- **Birincil sonlanım:** χ² testi veya Fisher's exact (ilaç uyumsuzluğu oranı); odds ratio ve %95 güven aralığı
- **Sürekli değişkenler:** bağımsız örneklem t-testi veya Mann-Whitney U (dağılım kontrolüne göre)
- **Tekrarlanan ölçüm:** karışık model tekrarlanan ölçüm ANOVA (MMRM)
- **Kayıp veri:** çoklu atama (multiple imputation), gerektiğinde LOCF
- **Niyet-tedavi analizi (ITT)** birincil; per-protokol analiz ikincil
- **Anlam eşiği:** p < 0,05 (çift yönlü); çoklu karşılaştırma düzeltmesi gerektiğinde Bonferroni

> **[EKRAN GÖRÜNTÜSÜ 10]**
> *Doktor paneli — mesajlaşma ekranı: Sol sütunda hasta mesajları listesi (okunmamış rozeti, aciliyet etiketi), sağda açılan mesaj; alt kısımda yanıt kutusu, üst kısımda eş zamanlı epikriz ve ilaç özeti.*

---

## KISIM 6 — ÇALIŞMA TAKVİMİ

```
AY       1    2    3    4    5    6    7    8    9   10   11   12   13-18  19-24
─────────────────────────────────────────────────────────────────────────────────
Etik&     ████
Yasal
Onay

Platform  ████ ████
Klinik
Uyarlama

Personel       ████
Eğitimi

Hasta               ████ ████ ████ ████
Katılımı
(Randomiz.)

Müdahale                  ████ ████ ████ ████ ████ ████ ████
ve Veri
Toplama

Ara       
Analiz                                             ████
(3. ay)

Kapalı                                                   ████
Dönem

Veri
Analizi                                                        ████ ████

Bulgular
Yazımı                                                               ████ ████

Yayım&
Bildiri                                                                    ████
```

| Faz | Süre | Temel Faaliyetler |
|---|---|---|
| Hazırlık | Ay 1–3 | Etik kurul + KVKK onayları, platform klinik uyarlama, klinisyen eğitimi, pilot test (n=5) |
| Katılım | Ay 2–6 | Hasta davet ve randomizasyon, oryantasyon |
| Müdahale | Ay 3–12 | 6 aylık aktif izlem, aylık lab takibi, 3. ay ara değerlendirme |
| Veri Analizi | Ay 13–18 | İstatistiksel analiz, nitel veri analizi |
| Yayım | Ay 19–24 | Makale yazımı, konferans bildirisi, TÜSEB raporlaması |

---

## KISIM 7 — BÜTÇE PLANI

### 7.1 Personel Giderleri (24 ay)

| Pozisyon | Katkı Oranı | Ay | Birim (TL) | Toplam (TL) |
|---|---|---|---|---|
| Proje Yürütücüsü (Doç. Dr./Prof.) | %30 | 24 | 15.000 | 108.000 |
| Nefroloji Araştırmacısı (Uzm. Dr.) ×2 | %20 | 24 | 12.000 | 115.200 |
| Yazılım Mühendisi / Tıp Bilişimi | %60 | 24 | 20.000 | 288.000 |
| Diyetisyen Araştırmacısı ×2 | %20 | 24 | 8.000 | 76.800 |
| Klinik Araştırma Koordinatörü | %80 | 24 | 10.000 | 192.000 |
| Biyoistatistikçi | %20 | 18 | 12.000 | 43.200 |
| **Personel Toplamı** | | | | **823.200** |

### 7.2 Sarf ve Ekipman Giderleri

| Kalem | Gerekçe | Tutar (TL) |
|---|---|---|
| Bulut altyapısı ve güvenlik (HIPAA/KVKK uyumlu) | 24 ay × platform barındırma, SSL, yedekleme | 72.000 |
| OpenAI API erişimi | GPT-4 API, tahmini token kullanımı 24 ay | 36.000 |
| REDCap lisansı veya eşdeğer | Klinik veri yönetimi | 18.000 |
| Hasta anketi basımı ve uygulama | Kâğıt + dijital | 12.000 |
| Bilgisayar / test cihazları | Araştırma ekibi için 2 dizüstü | 60.000 |
| Yazılım lisansları (IDE, test araçları) | Yıllık | 12.000 |
| **Sarf/Ekipman Toplamı** | | **210.000** |

### 7.3 Seyahat ve Koordinasyon

| Kalem | Tutar (TL) |
|---|---|
| Merkez koordinasyon toplantıları (×6) | 30.000 |
| Ulusal kongre sunumu (×2) | 24.000 |
| Uluslararası kongre sunumu (×1) | 40.000 |
| **Seyahat Toplamı** | **94.000** |

### 7.4 Yayım ve Diğer

| Kalem | Tutar (TL) |
|---|---|
| Makale yayım bedeli (open access ×2) | 60.000 |
| Çeviri ve redaksiyon | 15.000 |
| Proje yönetim giderleri | 18.000 |
| **Yayım/Diğer Toplamı** | **93.000** |

### 7.5 Genel Toplam

| Kategori | Tutar (TL) |
|---|---|
| Personel | 823.200 |
| Sarf / Ekipman | 210.000 |
| Seyahat | 94.000 |
| Yayım / Diğer | 93.000 |
| **Genel Toplam** | **1.220.200** |

*Not: Yukarıdaki bütçe tahmini niteliğindedir. TÜSEB başvuru sistemindeki güncel birim fiyat sınırları ve program çerçevesine göre revize edilecektir.*

---

## KISIM 8 — BEKLENEN ÇIKTILAR VE ETKİ

### 8.1 Bilimsel Çıktılar

| Çıktı Türü | Hedef | Zaman |
|---|---|---|
| SCI/SCI-E makale | ≥2 (tam metin, Q1/Q2 dergi) | Ay 20–24 |
| Ulusal konferans bildirisi | ≥2 | Ay 12–18 |
| Uluslararası konferans bildirisi | ≥1 | Ay 18–24 |
| Doktora/Yüksek Lisans tezi katkısı | ≥1 | Ay 24 |
| Araştırma protokolü yayımı | ≥1 (PROSPERO tescili + protokol makalesi) | Ay 3 |

### 8.2 Klinik ve Toplumsal Etki

- **İlaç uyumu artışı:** %20 oranında iyileşme, greft sağkalımına doğrudan katkı
- **Komplikasyon erken tespiti:** Lab trend uyarıları ile rejeksiyon/toksisitenin erken fark edilmesi
- **Sağlık sistemi tasarrufu:** Acil başvuru ve planlanmamış yatışların azalması; 120 hastada yıllık tahmini tasarruf hesaplanacaktır
- **Çok disiplinli bakım:** Doktor-diyetisyen-koordinatör-hasta iletişiminin sayısallaştırılması
- **Hasta güçlendirme:** Öz-yönetim becerisi ve sağlık okuryazarlığı artışı

### 8.3 Politika Katkısı

- Dijital sağlık mevzuatı (TITCK TıCDE rehberi) bağlamında gerçek dünya klinik kanıt üretimi
- Nakil polikliniği iş akışına entegre edilebilir, ölçeklenebilir platform modeli
- Daha büyük çok merkezli ve uluslararası çalışmalara temel protokol
- Açık kaynak bileşen yayımı: benzer hastalıklar için adaptasyona zemin

### 8.4 Fikrî Mülkiyet Planı

RenaCare yazılım mimarisi tescil edilecek; yapay zekâ içerik kütüphanesi (hasta eğitim modülü) telif altında ve erişime açık biçimde yayımlanacaktır.

---

## KISIM 9 — ETİK VE YASAL ÇERÇEVE

| Gereksinim | Durum |
|---|---|
| Girişimsel Olmayan Klinik Araştırmalar Etik Kurulu onayı | Proje onayı sonrasında başvurulacak |
| KVKK Uyumu | Platform tasarımı gereği uyumlu; araştırma verileri için Veri İşleme Sözleşmesi hazırlanacak |
| Bilgilendirilmiş Onam | Yazılı, CIOMS kılavuzları ile uyumlu |
| PROSPERO tescili | Çalışma başlamadan önce yapılacak |
| Klinik Araştırmalar Hakkında Yönetmelik | Araştırmacı ekibinin Sağlık Bakanlığı GKİ sertifikası mevcut veya alınacak |
| Veri Güvenliği | ISO/IEC 27001 uyumlu bulut altyapısı; kişisel sağlık verisi kriptografik şifreleme |

---

## KISIM 10 — ARAŞTIRMACI BİLGİLERİ VE GÖREV DAĞILIMI

*(Her bir araştırmacı için doldurulacak)*

| Araştırmacı | Unvan / Kurum | Görev | Katkı Oranı |
|---|---|---|---|
| [Proje Yürütücüsü] | Doç. Dr., Nefroloji | Proje yönetimi, klinik protokol, birincil sonlanım analizi | %30 |
| [Araştırmacı 2] | Uzm. Dr., Nefroloji | Hasta katılımı, lab veri toplama, 2. merkez | %20 |
| [Araştırmacı 3] | Uzm. Dr., Nefroloji | 3. merkez koordinasyonu | %20 |
| Fatih Bildirici | Yazılım / Tıp Bilişimi | Platform geliştirme, güvenlik, klinik uyarlama, veri altyapısı | %60 |
| [Araştırmacı 5] | Diyetisyen | Beslenme protokolü, diyet modülü içerik onayı | %20 |
| [Araştırmacı 6] | Diyetisyen | 2. diyetisyen, hasta eğitimi | %20 |
| [Araştırmacı 7] | Biyoistatistikçi | Analiz planı, güç hesabı, raporlama | %20 |
| [Koordinatör] | Klinik Araştırma Koordinatörü | Randomizasyon, veri kalite kontrol, raporlama | %80 |

---

## KISIM 11 — KAYNAKLAR

1. TÜSEB. Klinik Araştırma Projeleri Uygulama Kılavuzu. [Güncel erişim bağlantısı eklenecek]
2. Sağlık Bakanlığı. Ulusal Organ ve Doku Nakli İstatistikleri, 2024. [Web, Ekim 2024]
3. Dew MA, DiMatteo MR, Berger S, et al. Meta-analysis of medical regimen adherence outcomes in pediatric solid organ transplantation. *Transplantation*. 2009;88(5):736–746.
4. Dew MA, DiMatteo MR, Switzer GE, et al. Rates and risk factors for nonadherence to the medical regimen after adult solid organ transplantation. *Transplantation*. 2007;83(7):858–873.
5. Rosenberger J, et al. Medication adherence and health-related quality of life in kidney transplant recipients. *Transpl Int*. 2012.
6. Denhaerynck K, et al. Nonadherence to immunosuppressive medication in kidney transplant patients: a systematic review of prevalence rates. *Transpl Int*. 2020.
7. Dobson CT, et al. Information and communication technology-based interventions for improving adherence to immunosuppressive regimens in kidney transplant recipients. *Cochrane Database Syst Rev*. 2021.
8. McGillicuddy JW, et al. A Randomized Controlled Trial of Mobile Health Decision Support to Improve Medication Adherence and Blood Pressure Control in Hypertensive Kidney Transplant Patients. *Am J Kidney Dis*. 2015.
9. Süzer-Özkan FN, et al. Digital health tools for kidney transplant recipients: a single-center observational study from Turkey. *Transplant Proc*. 2023.
10. US Renal Data System (USRDS). 2023 Annual Data Report. National Institutes of Health, National Institute of Diabetes and Digestive and Kidney Diseases. Bethesda, MD, 2023.
11. Kriszbacher I, et al. Electronic reminders for tacrolimus adherence in transplant recipients: a systematic review. *Patient Prefer Adherence*. 2020.
12. T.C. Kişisel Verileri Koruma Kurumu. Kişisel Sağlık Verilerine İlişkin Rehber. Ankara: KVKK, 2023.
13. TITCK. Tıbbi Cihaz Yazılımları Hakkında Kılavuz. Ankara: Türkiye İlaç ve Tıbbi Cihaz Kurumu, 2023.

---

## EK — EKRAN GÖRÜNTÜLERİ REHBERİ

Başvuru dosyasına eklenecek ekran görüntüleri ve açıklamaları:

| Numara | Ekran | Sayfaya Ekleme Yeri | Demo Hesap |
|---|---|---|---|
| EK-SS-01 | Hasta paneli ana sayfası (lab kartları + ilaç hatırlatıcı) | Bölüm 3.1 | hasta@demo.com |
| EK-SS-02 | Doktor paneli — hasta listesi ve durum kodlaması | Bölüm 3.1 | doktor@demo.com |
| EK-SS-03 | Hasta profil sayfası — Laboratuvar sekmesi (metrik seçici + grafik) | Bölüm 3.1 | doktor@demo.com |
| EK-SS-04 | Popülasyon İstatistikleri — üst kısım (özet kartlar) | Bölüm 3.1 | doktor@demo.com |
| EK-SS-05 | Popülasyon İstatistikleri — alt kısım (trend grafikleri + tablo) | Bölüm 3.1 | doktor@demo.com |
| EK-SS-06 | Diyetisyen paneli — diyet planı düzenleme | Bölüm 3.1 | diyetisyen@demo.com |
| EK-SS-07 | YZ Sağlık Asistanı — tacrolimus sorusu ve yanıt | Bölüm 3.1 | hasta@demo.com |
| EK-SS-08 | Giriş ekranı — demo hesap seçim paneli | Bölüm 3.3 | (giriş öncesi) |
| EK-SS-09 | İlaç takip sayfası — haftalık uyum grafiği | Bölüm 3.1 | hasta@demo.com |
| EK-SS-10 | Doktor mesajlaşma — hasta mesajı ve yanıt formu | Bölüm 3.1 | doktor@demo.com |

**Demo erişim:** https://kidneytransplant.vercel.app — tüm şifreler: `Demo1234`

---

*Bu belge RenaCare proje başvurusu için taslak olarak hazırlanmıştır. Başvuru öncesinde TÜSEB güncel uygulama kılavuzu incelenmeli, kurum imzalı taahhüt mektubu, araştırmacı CV'leri ve etik kurul başvuru dilekçesi eklenmeli; bütçe kalemleri program limitleriyle kontrol edilmelidir.*
