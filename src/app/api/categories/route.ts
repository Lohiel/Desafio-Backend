import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  return Response.json(
    await supabase.from("categories").insert(body).select().single()
  );
}

export async function GET() {
  return Response.json(await supabase.from("categories").select("*"));
}
