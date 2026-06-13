import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/openai";

// Simple in-memory rate limit: 20 requests / 60 seconds per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

function getFallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (/tacrolimus|prograf/.test(msg)) {
    return "Tacrolimus (Prograf), böbrek naklinden sonra kullanılan temel immünosupresif ilaçtır. Hedef kan düzeyi genellikle nakil zamanına göre 8–12 ng/mL aralığındadır. Düzeyin düşük olması rejeksiyon, yüksek olması ise toksik yan etki riskini artırır. Her zaman aç karnına ve aynı saatte alınmalıdır. Düzeyin takibi için doktorunuz düzenli kan testi isteyecektir.";
  }
  if (/kreatinin|creatinine/.test(msg)) {
    return "Kreatinin, böbrek fonksiyonunun temel göstergesidir. Nakil sonrası normal aralık genellikle 0,7–1,3 mg/dL'dir. Kreatinin yükselmesi böbrek fonksiyonunun azaldığına işaret edebilir ve doktorunuzun değerlendirmesini gerektirir. Ani yükselmeler durumunda doktorunuzu hemen bilgilendirin.";
  }
  if (/ilaç.*zaman|ne zaman.*ilaç|saat.*ilaç|ilaç.*saat/.test(msg)) {
    return "İmmünosupresif ilaçları her gün aynı saatte almak çok önemlidir. Doktorunuzun belirlediği saate kesinlikle uyun. Bir dozu kaçırırsanız ne yapacağınızı mutlaka doktorunuza sorun — asla çift doz almayın.";
  }
  if (/ateş|38|fever/.test(msg)) {
    return "⚠️ Nakil hastalarında 38°C üzeri ateş ciddi bir durumdur. Bağışıklık sisteminiz baskılandığı için enfeksiyonlara karşı savunmasızsınız. 38°C üzeri ateşte hemen doktorunuzu veya 112'yi arayın; gecikmeden acil servise başvurun.";
  }
  if (/acil|112|emergency/.test(msg)) {
    return "Aşağıdaki belirtiler ACİL durumlardır — hemen 112'yi arayın:\n• 38°C üzeri ateş\n• Nefes darlığı\n• Göğüs ağrısı\n• İdrar miktarında ciddi azalma\n• Ciddi şişlik (ödem)\n• Bilinç değişikliği\n• Nakil bölgesinde ağrı veya kızarıklık";
  }
  if (/beslenme|yemek|diyet|gıda|meyve|sebze/.test(msg)) {
    return "Nakil sonrası beslenme önerileri:\n• Greyfurt ve pomelo KESİNLİKLE yasaktır (Tacrolimus metabolizmasını etkiler)\n• Potasyum kısıtlaması: muz, portakal, kuru meyve sınırlı tüketilmeli\n• Tuz kısıtlaması: günde 5 g altında\n• Çiğ et, balık ve pastörize edilmemiş ürünlerden kaçının\n• Diyetisyeninizle kişisel planınızı oluşturun.";
  }
  if (/greyfurt|grapefruit|pomelo/.test(msg)) {
    return "⚠️ Greyfurt ve pomelo, Tacrolimus ve diğer immünosupresif ilaçların kan düzeyini ciddi şekilde yükseltir. Bu meyveleri — suyu dahil — YEMEYİN. Bu kural yaşam boyu geçerlidir.";
  }
  if (/rejeksiyon|reddedilme|rejection/.test(msg)) {
    return "Akut rejeksiyon belirtileri:\n• Kreatinin yükselmesi\n• Ateş\n• Nakledilen böbrekte ağrı veya şişlik\n• İdrar miktarında azalma\n\nBu belirtilerde HEMEN doktorunuzu veya hastaneyi arayın. Erken teşhis tedavi başarısını doğrudan etkiler.";
  }
  if (/enfeksiyon|infection|mikrop/.test(msg)) {
    return "Bağışıklık sisteminiz baskılandığı için enfeksiyonlara yatkınsınız:\n• Ateş (38°C üzeri → acil)\n• Yara yerinde kızarıklık veya akıntı\n• İdrar yaparken yanma\n• Öksürük, nefes darlığı\n\nKalabalık ortamlardan kaçının, maske kullanın ve elleri sık yıkayın.";
  }
  if (/böbrek|kidney|nakil|transplant/.test(msg)) {
    return "Böbrek nakli sonrası sağlıklı yaşam için:\n• İmmünosupresif ilaçları asla bırakmayın\n• Kan tahlillerini aksatmayın\n• Tansiyonu düzenli ölçün\n• Doktorunuzun önerdiği sıklıkta kontrole gidin\n• Sigara ve alkol kullanmayın\n• Güneş koruyucu kullanın (cilt kanseri riski artar)";
  }
  if (/yan etki|mide bulantı/.test(msg)) {
    return "İmmünosupresif ilaçların yaygın yan etkileri:\n• Tacrolimus: titreme, baş ağrısı, böbrek toksisitesi, hipertansiyon\n• Mycophenolate: mide bulantısı, ishal (yemekle alınırsa azalır)\n• Prednizolon: kilo alımı, yüz şişmesi, kemik erimesi riski\n\nYan etkileri doktorunuzla paylaşın; dozu kendi başınıza değiştirmeyin.";
  }

  return "Sağlık sorunuzu anlayamadım. Şu konularda yardımcı olabilirim:\n• İlaç bilgisi (Tacrolimus, Mycophenolate vb.)\n• Beslenme kısıtlamaları\n• Acil belirtiler\n• Rejeksiyon semptomları\n• Genel nakil sonrası bakım\n\nLütfen sorunuzu daha açık ifade edin veya doktorunuzla iletişime geçin.";
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderildi. Lütfen bir dakika bekleyin." },
        { status: 429 }
      );
    }

    const { messages } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const lastUserMsg = [...messages]
        .reverse()
        .find((m: { role: string; content: string }) => m.role === "user")?.content ?? "";
      return NextResponse.json({
        message: {
          role: "assistant",
          content: getFallbackResponse(lastUserMsg),
        },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();

    return NextResponse.json({
      message: data.choices[0].message,
    });
  } catch {
    return NextResponse.json(
      { error: "AI yanıt veremedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
