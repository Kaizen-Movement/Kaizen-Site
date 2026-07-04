import { createClient } from "@/lib/supabase/server";
import { LiveVisitorsCard } from "@/components/admin/LiveVisitorsCard";

export default async function AdminDashboard() {
  const supabase = createClient();

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const abandonedCutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const [
    { count: productCount },
    { count: orderCount },
    { data: paidOrders },
    { data: weekOrders },
    { count: pendingCount },
    { count: customerCount },
    { count: abandonedCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_cents").eq("status", "paid"),
    supabase
      .from("orders")
      .select("total_cents")
      .eq("status", "paid")
      .gte("created_at", weekAgo),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("legacy_customers").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .lt("created_at", abandonedCutoff),
  ]);

  const totalRevenueCents = (paidOrders ?? []).reduce(
    (sum, o) => sum + (o.total_cents ?? 0),
    0
  );
  const weekRevenueCents = (weekOrders ?? []).reduce(
    (sum, o) => sum + (o.total_cents ?? 0),
    0
  );

  const stats = [
    { label: "Products", value: productCount ?? 0 },
    { label: "Orders", value: orderCount ?? 0 },
    { label: "Pending Orders", value: pendingCount ?? 0 },
    { label: "Abandoned Checkouts", value: abandonedCount ?? 0 },
    { label: "Customers", value: customerCount ?? 0 },
    {
      label: "Revenue (all time)",
      value: `$${(totalRevenueCents / 100).toFixed(2)}`,
    },
    {
      label: "Revenue (last 7d)",
      value: `$${(weekRevenueCents / 100).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <p className="eyebrow mb-2">Overview</p>
      <h1 className="font-display text-3xl text-bone">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <LiveVisitorsCard />
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-white/10 bg-charcoal p-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/50">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl text-gold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
