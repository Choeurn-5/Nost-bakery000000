import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") || formData.get("image");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const adminSecret = process.env.ADMIN_API_SECRET || "nost-bakery-internal-admin-secret-2025";

    // Prepare outbound multipart form data for Laravel backend
    const outboundFormData = new FormData();
    outboundFormData.append("file", file);

    let data: any = null;
    let backendRes: Response | null = null;

    try {
      // 1. Attempt standard multipart upload first
      backendRes = await fetch(`${apiUrl}/api/admin/upload`, {
        method: "POST",
        headers: {
          "X-Admin-Secret": adminSecret,
          Accept: "application/json",
        },
        body: outboundFormData,
      });

      if (backendRes.ok) {
        data = await backendRes.json();
      }
    } catch {
      // Fallback below
    }

    // 2. If multipart was rejected by server firewall (e.g. 403 or non-200), fall back to base64 JSON payload
    if (!data || !data.success) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mime = file.type || "image/jpeg";
      const base64Data = `data:${mime};base64,${buffer.toString("base64")}`;

      backendRes = await fetch(`${apiUrl}/api/admin/upload`, {
        method: "POST",
        headers: {
          "X-Admin-Secret": adminSecret,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          image_base64: base64Data,
        }),
      });

      try {
        data = await backendRes.json();
      } catch {
        data = null;
      }
    }

    if (!data || !data.success) {
      return NextResponse.json(
        {
          success: false,
          error: data?.message || data?.error || "Failed to upload image to backend storage.",
        },
        { status: backendRes?.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      filename: data.filename,
      size: data.size,
      width: data.width,
      height: data.height,
      mimeType: data.mime_type,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal upload error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
