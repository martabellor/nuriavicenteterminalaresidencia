import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json({ error: "Falta ADMIN_PASSWORD en el servidor" }, { status: 500 });
    }

    if (password !== expected) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    await setAdminCookie(password);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
}
