import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const ok = await isAdminAuthenticated();

  if (!ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("signups")
    .select("name, menu_choice, allergies, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = [
    ["Nombre", "Menu", "Alergias", "Fecha_inscripcion"],
    ...(data || []).map((item) => [
      escapeCsv(item.name),
      escapeCsv(item.menu_choice),
      escapeCsv(item.allergies),
      escapeCsv(item.created_at),
    ]),
  ];

  const csv = rows.map((row) => row.join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="inscritos-cena-nuria.csv"',
    },
  });
}

function escapeCsv(value: string) {
  const safe = String(value ?? "");
  if (safe.includes(",") || safe.includes('"') || safe.includes("\n")) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}
