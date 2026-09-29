import { isAuthError, requireAuth } from "@/lib/auth-request";
import { getReportById } from "@/lib/services/reports";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const report = await getReportById(auth.userId, id);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const filename = `${report.title.replace(/\s+/g, "-").toLowerCase()}.json`;
  return new NextResponse(JSON.stringify(report.data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
