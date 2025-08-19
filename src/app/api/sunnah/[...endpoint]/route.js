import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // 1. اجمع المسار المطلوب
    const endpoint = params.endpoint.join("/");
    const url = `https://api.sunnah.com/v1/${endpoint}`;

    // Debug logs
    console.log("🔗 Sunnah API URL:", url);

    // 2. نفذ الطلب
    const res = await fetch(url, {
      headers: {
        "X-API-Key": process.env.SUNNAH_API_KEY,
      },
    });

    console.log("📡 Sunnah API Status:", res.status);

    // 3. لو حصل خطأ من السيرفر
    if (!res.ok) {
      const text = await res.text(); // حاول تجيب الـ body الخام
      console.error("❌ Sunnah API Error Body:", text);

      return NextResponse.json(
        { error: `Sunnah API error: ${res.status}`, details: text },
        { status: res.status }
      );
    }

    // 4. لو كل حاجة تمام
    const data = await res.json();

    console.log("✅ Sunnah API Response Sample:", JSON.stringify(data, null, 2).slice(0, 500));

    return NextResponse.json(data);
  } catch (error) {
    console.error("🔥 Internal Server Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
