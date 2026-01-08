import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId, linkId } = body;

    if (!pageId) {
      return NextResponse.json({ error: "Page ID required" }, { status: 400 });
    }

    // Get device info from user agent
    const userAgent = request.headers.get("user-agent") || "";
    let device = "Desktop";
    if (/mobile/i.test(userAgent)) device = "Mobile";
    else if (/tablet/i.test(userAgent)) device = "Tablet";

    // Get browser
    let browser = "Other";
    if (/chrome/i.test(userAgent)) browser = "Chrome";
    else if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent)) browser = "Safari";
    else if (/edge/i.test(userAgent)) browser = "Edge";

    // Get referer
    const referer = request.headers.get("referer");

    // Get country from header (if behind a proxy/CDN that provides this)
    const country = request.headers.get("cf-ipcountry") || 
                    request.headers.get("x-vercel-ip-country") || 
                    null;

    await prisma.click.create({
      data: {
        pageId,
        linkId,
        device,
        browser,
        referer,
        country,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
