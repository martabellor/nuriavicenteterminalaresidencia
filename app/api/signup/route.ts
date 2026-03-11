import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const menu_choice = String(body.menu_choice || "").trim().toLowerCase();
    const allergies = String(body.allergies || "").trim();

    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    if (!["pescado", "carne"].includes(menu_choice)) {
      return NextResponse.json({ error: "La elección de menú no es válida" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("signups").insert([
      {
        name,
        menu_choice,
        allergies: allergies || "ninguna",
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
}
