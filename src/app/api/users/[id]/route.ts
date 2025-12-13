import { NextResponse } from "next/server";
import { z } from "zod";
import { userSchema } from "@/src/lib/validate";
import { supabase } from "@/src/lib/supabase";

export async function GET(req: Request, context: any) {
    const { id } = await context.params;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

export async function PUT(req: Request, context: any) {
    const { id } = await context.params;

    const body = await req.json();

    const parsed = userSchema.partial().safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    const { data, error } = await supabase
        .from("users")
        .update(parsed.data)
        .eq("id", id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
}

export async function DELETE(req: Request, context: any) {
    const { id } = await context.params;

    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ message: "User deleted" });
}
