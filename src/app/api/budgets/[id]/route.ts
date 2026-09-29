import { isAuthError, requireAuth } from "@/lib/auth-request";
import { deleteBudget, updateBudget } from "@/lib/services/finance-crud";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const body = await request.json();
  try {
    const budget = await updateBudget(auth.userId, id, body);
    return NextResponse.json(budget);
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
  try {
    await deleteBudget(auth.userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 404 },
    );
  }
}
