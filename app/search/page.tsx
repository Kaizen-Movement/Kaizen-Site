import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SearchFilters } from "@/components/SearchFilters";
import type { Category, Product } from "@/lib/types";

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    sort?: string;
    price?: string;
  };
}

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: Props) {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  let query = supabase.from("products").select("*").eq("status", "published");

  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`);
  }

  if (searchParams.category) {
    const cat = (categories ?? []).find(
      (c) => c.slug === searchParams.category
    );
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (searchParams.price) {
    const [min, max] = searchParams.price.split("-").map(Number);
    if (!Number.isNaN(min)) query = query.gte("price_cents", min);
    if (!Number.isNaN(max)) query = query.lte("price_cents", max);
  }

  switch (searchParams.sort) {
    case "price_asc":
      query = query.order("price_cents", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_cents", { ascending: false });
      break;
    case "alpha":
      query = query.order("title", { ascending: true });
      break;
    case "popular":
      query = query.order("is_recommended", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
          <p className="eyebrow mb-3">Search</p>
          <form action="/search" className="mb-2">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q}
              placeholder="Search products..."
              className="w-full max-w-lg border-b border-white/20 bg-transparent pb-3 font-display text-3xl text-bone placeholder:text-bone/30 focus:outline-none"
            />
          </form>
        </div>

        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <SearchFilters categories={(categories ?? []) as Category[]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {(products as Product[]).map((product) => (
                <ProductCard key={product.id} product={product} coverUrl={null} />
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-sm text-bone/40">
              No products matched your search.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
