import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: productCount }, { count: orderCount }, { data: orders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total_cents").eq("status", "paid"),
    ]);

  const totalRevenueCents = (orders ?? []).reduce(
    (sum, o) => sum + (o.total_cents ?? 0),
    0
  );

  const stats = [
    { label: "Products", value: productCount ?? 0 },
    { label: "Orders", value: orderCount ?? 0 },
    {
      label: "Revenue (paid)",
      value: `$${(totalRevenueCents / 100).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <p className="eyebrow mb-2">Overview</p>
      <h1 className="font-display text-3xl text-bone">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
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
