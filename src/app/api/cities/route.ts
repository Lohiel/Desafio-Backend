import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  return Response.json(
    await supabase.from("cities").insert(body).select().single()
  );
}

export async function GET() {
  return Response.json(await supabase.from("cities").select("*"));
}
