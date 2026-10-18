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

    const backendRes = await fetch(`${apiUrl}/api/admin/upload`, {
      method: "POST",
      headers: {
        "X-Admin-Secret": adminSecret,
        Accept: "application/json",
      },
      body: outboundFormData,
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || data.error || "Failed to upload image to backend storage.",
        },
        { status: backendRes.status || 500 }
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
