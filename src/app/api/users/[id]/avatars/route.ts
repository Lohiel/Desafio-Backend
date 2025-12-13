import { supabase } from "@/src/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Nome único do arquivo
    const filePath = `${params.id}-${Date.now()}-${file.name}`;

    // Upload para o Supabase
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Erro no upload:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Pegar URL pública (funciona porque o bucket é público)
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Salvar URL no banco
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", params.id);

    if (updateError) {
      console.error("Erro ao atualizar usuário:", updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: avatarUrl,
    });

  } catch (e: any) {
    console.error("Erro:", e);
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}