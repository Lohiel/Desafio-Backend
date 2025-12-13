import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { userSchema } from '@/src/lib/validate';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) return NextResponse.json(parsed.error, { status: 400 });

  const hashed = await bcrypt.hash(body.password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert({ ...body, password: hashed })
    .select()
    .single();

  return NextResponse.json({ data, error });
}

export async function GET() {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}
