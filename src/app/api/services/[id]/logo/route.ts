import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request, { params }: any) {
  const form = await req.formData();
  const file = form.get("file") as File;

  const path = `logos/${params.id}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("logos")
    .upload(path, file, { upsert: true });

  await supabase
    .from("services")
    .update({ logo_url: data?.path })
    .eq("id", params.id);

  return Response.json({ data, error });
}
