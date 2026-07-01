import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Category, Product } from "@/lib/types";

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const supabase = createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  if (!product) notFound();

  const boundAction = updateProduct.bind(null, params.id);

  return (
    <div>
      <p className="eyebrow mb-2">Catalog</p>
      <h1 className="mb-8 font-display text-3xl text-bone">
        Edit — {product.title}
      </h1>
      <ProductForm
        action={boundAction}
        categories={(categories ?? []) as Category[]}
        product={product as Product}
      />
    </div>
  );
}
