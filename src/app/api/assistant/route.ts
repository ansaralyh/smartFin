import { isAuthError, requireAuth } from "@/lib/auth-request";
import { answerLocally } from "@/lib/services/assistant";
import { getEnv } from "@/lib/env";
import { getDashboard } from "@/lib/services/finance";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

function isOpenAIQuotaError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; status?: number; error?: { code?: string } };
  return (
    e.code === "insufficient_quota" ||
    e.error?.code === "insufficient_quota" ||
    e.status === 429
  );
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const trimmed = message.trim();
    const env = getEnv();

    if (env.OPENAI_API_KEY) {
      try {
        const { summary, categoryExpenses } = await getDashboard(auth.userId);
        const context = [
          `Monthly income: PKR ${summary.totalIncome}`,
          `Monthly expenses: PKR ${summary.totalExpenses}`,
          `Current balance: PKR ${summary.currentBalance}`,
          `Financial health score: ${summary.financialHealthScore}/100`,
          `Top categories: ${categoryExpenses.map((c) => `${c.category} PKR ${c.amount}`).join(", ") || "none"}`,
        ].join("\n");

        const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are SmartFin AI, a personal finance assistant. Answer clearly and concisely. Use PKR for currency. Use ONLY the financial data below — never invent numbers.\n${context}`,
            },
            { role: "user", content: trimmed },
          ],
          max_tokens: 500,
        });

        const reply = completion.choices[0]?.message?.content?.trim();
        if (reply) {
          return NextResponse.json({ reply, source: "openai" });
        }
      } catch (openaiError) {
        if (isOpenAIQuotaError(openaiError)) {
          console.warn("OpenAI quota exhausted — using local assistant");
        } else {
          console.error("OpenAI error — falling back to local assistant:", openaiError);
        }
      }
    }

    const reply = await answerLocally(auth.userId, trimmed);
    return NextResponse.json({ reply, source: "local" });
  } catch (error) {
    console.error("Assistant error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Assistant request failed" },
      { status: 500 },
    );
  }
}
