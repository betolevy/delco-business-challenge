import type { RecapItem } from "@/lib/scoring";
import type { Tier } from "@/lib/tiers";

const FROM = process.env.RESEND_FROM_EMAIL ?? "info@delcolaw.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://delco-business-challenge.vercel.app";

export const emailConfigured = Boolean(process.env.RESEND_API_KEY);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function recapItemHtml(item: RecapItem, index: number): string {
  const badgeColor = item.correct ? "#1a7f37" : "#c22b2b";
  const badgeLabel = item.correct ? "Correct" : "Incorrect";

  const optionsHtml = item.options
    .map((option) => {
      const isCorrect = option.id === item.correctOptionId;
      const isWrongPick = option.id === item.selectedOptionId && !isCorrect;
      const bg = isCorrect ? "#e6f4ea" : isWrongPick ? "#fbe9e9" : "#f5f5f5";
      const border = isCorrect ? "#1a7f37" : isWrongPick ? "#c22b2b" : "#e0e0e0";
      return `<div style="border:1px solid ${border};background:${bg};border-radius:8px;padding:8px 12px;margin-bottom:6px;font-size:13px;color:#222;">${escapeHtml(
        option.label
      )}</div>`;
    })
    .join("");

  return `
    <div style="border:1px solid #e5e5e5;border-radius:12px;padding:18px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:600;letter-spacing:0.04em;color:#002F87;text-transform:uppercase;margin-bottom:6px;">
        ${item.sectionEmoji} ${escapeHtml(item.section)}
        <span style="float:right;background:${badgeColor};color:#fff;border-radius:999px;padding:2px 10px;font-size:11px;">${badgeLabel}</span>
      </div>
      <div style="font-size:12px;color:#777;margin-bottom:4px;">Case ${index + 1} — ${escapeHtml(item.caseTitle)}</div>
      <div style="font-size:15px;font-weight:600;color:#111;margin-bottom:10px;">${escapeHtml(item.prompt)}</div>
      ${optionsHtml}
      <div style="font-size:13px;line-height:1.5;color:#444;margin-top:10px;">${escapeHtml(item.explanation)}</div>
    </div>
  `;
}

export async function sendResultsEmail(params: {
  to: string;
  name: string;
  score: number;
  totalQuestions: number;
  percentile: number;
  tier: Tier;
  recap: RecapItem[];
}): Promise<void> {
  if (!emailConfigured) return;

  // Loaded on demand so the SDK stays out of the /api/submit bundle while
  // email is switched off — submit is the hottest path at the event.
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { to, name, score, totalQuestions, percentile, tier, recap } = params;

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f7f7f8;padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ececec;">
      <div style="background:#0a0a0a;padding:28px 28px 24px;text-align:center;">
        <img src="${SITE_URL}/icons/icon-192.png" width="40" height="40" alt="delco" style="border-radius:10px;" />
        <div style="color:#fff;font-size:18px;font-weight:700;margin-top:10px;">Business Challenge</div>
      </div>

      <div style="padding:28px;">
        <p style="font-size:15px;color:#222;">Hi ${escapeHtml(name)},</p>
        <p style="font-size:15px;color:#222;line-height:1.5;">
          Thanks for taking the delco Business Challenge. Here's how you did:
        </p>

        <div style="text-align:center;margin:24px 0;">
          <div style="font-size:56px;font-weight:800;color:#0a0a0a;line-height:1;">${score}<span style="color:#999;font-size:32px;">/${totalQuestions}</span></div>
          <div style="display:inline-block;margin-top:12px;background:#e6fbf9;color:#00706a;border:1px solid #00BCB4;border-radius:999px;padding:6px 16px;font-size:14px;font-weight:600;">
            ${tier.emoji} ${escapeHtml(tier.label)}
          </div>
          <p style="font-size:13px;color:#666;margin-top:12px;">
            You know more than <strong>${percentile}%</strong> of founders.
          </p>
        </div>

        <h2 style="font-size:16px;color:#0a0a0a;margin:28px 0 14px;">Case by case</h2>
        ${recap.map((item, i) => recapItemHtml(item, i)).join("")}

        <div style="text-align:center;margin-top:28px;">
          <a href="${SITE_URL}/leaderboard" style="display:inline-block;background:#002F87;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;">
            View the Leaderboard
          </a>
        </div>
      </div>

      <div style="padding:20px 28px;border-top:1px solid #ececec;text-align:center;">
        <p style="font-size:12px;color:#999;margin:0;">delco — delvalle, escalona, levy &amp; corró</p>
      </div>
    </div>
  </div>
  `;

  await resend.emails.send({
    from: `delco Business Challenge <${FROM}>`,
    to,
    subject: `You scored ${score}/${totalQuestions} — ${tier.emoji} ${tier.label}`,
    html,
  });
}
