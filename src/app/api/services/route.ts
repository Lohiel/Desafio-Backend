import { supabase } from "@/src/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const category = searchParams.get("category");

  let query = supabase.from("services").select("*");

  if (city) query = query.eq("city_id", city);
  if (category) query = query.eq("category_id", category);

  const { data, error } = await query;

  return Response.json({ data, error });
}
