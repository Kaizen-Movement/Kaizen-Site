"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from "@/lib/auth";
import { getExistingDownloadLinks } from "@/lib/orders";
import { sendEmail } from "@/lib/email/resend";
import { renderOrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";

function toAbsoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kaizensubliminals.store";
  return `${base.replace(/\/$/, "")}${path}`;
}

export interface ActionResult {
  success?: boolean;
  error?: string;
}

/**
 * Re-sends the order confirmation email using whatever download tokens
 * currently exist for the order — does NOT mint new tokens. Use
 * regenerateDownloadToken first if a link needs to actually change
 * (e.g. it was compromised or the customer says it's expired).
 */
export async function resendOrderEmail(orderId: string): Promise<ActionResult> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return { error: "Not authorized." };

  const supabase = createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, customer_email, total_cents, currency")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) return { error: "Order not found." };
  if (order.status !== "paid") {
    return { error: "Only paid orders have a confirmation email to resend." };
  }
  if (!order.customer_email) return { error: "Order has no customer email on file." };

  const links = await getExistingDownloadLinks(orderId);

  const { subject, html } = renderOrderConfirmationEmail({
    orderId,
    totalCents: order.total_cents,
    currency: order.currency,
    items: links.map((l) => ({
      productTitle: l.productTitle,
      downloadUrl: l.downloadPath ? toAbsoluteUrl(l.downloadPath) : null,
      note: l.note,
    })),
  });

  const result = await sendEmail({ to: order.customer_email, subject, html });
  if (!result.sent) return { error: result.error ?? "Email failed to send." };

  return { success: true };
}

/**
 * Invalidates one download token and mints a fresh one in its place
 * (same order_item + product_file, new random token, reset expiry and
 * download count). The old token stops working immediately since it's
 * deleted, not just superseded — important if the reason for
 * regenerating is a leaked/compromised link. Does not send an email by
 * itself; call resendOrderEmail after if the customer needs the new
 * link delivered.
 */
export async function regenerateDownloadToken(
  tokenId: string,
  orderId: string
): Promise<ActionResult> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) return { error: "Not authorized." };

  const supabase = createClient();

  const { data: oldToken, error: fetchError } = await supabase
    .from("download_tokens")
    .select("id, order_item_id, product_file_id")
    .eq("id", tokenId)
    .maybeSingle();

  if (fetchError || !oldToken) return { error: "Download token not found." };

  const { error: insertError } = await supabase.from("download_tokens").insert({
    order_item_id: oldToken.order_item_id,
    product_file_id: oldToken.product_file_id,
  });
  if (insertError) return { error: insertError.message };

  const { error: deleteError } = await supabase
    .from("download_tokens")
    .delete()
    .eq("id", oldToken.id);
  if (deleteError) return { error: deleteError.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
