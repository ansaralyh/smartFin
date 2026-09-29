import { isAuthError, requireAuth } from "@/lib/auth-request";
import { deleteCategory, updateCategory } from "@/lib/services/finance-crud";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  try {
    const category = await updateCategory(auth.userId, id, await request.json());
    return NextResponse.json(category);
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
    await deleteCategory(auth.userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 404 },
    );
  }
}
