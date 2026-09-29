import { isAuthError, requireAuth } from "@/lib/auth-request";
import { deleteNotification, markNotificationRead } from "@/lib/services/finance-crud";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  try {
    const notification = await markNotificationRead(auth.userId, id);
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 404 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  await deleteNotification(auth.userId, id);
  return NextResponse.json({ success: true });
}
