import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

type Signup = {
  id: number;
  name: string;
  menu_choice: string;
  allergies: string;
  created_at: string;
};

export default async function AdminPage() {
  const ok = await isAdminAuthenticated();

  if (!ok) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("signups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const signups = (data || []) as Signup[];

  return (
    <main>
      <div className="container">
        <section className="card">
          <div className="admin-top">
            <div>
              <span className="badge">🧾 Panel de administración</span>
              <h1>Inscritos a la cena de Nuria</h1>
              <div className="kpi">Total inscritos: {signups.length}</div>
            </div>

            <div className="admin-actions">
              <a className="btn-primary" href="/api/admin/export">
                Descargar CSV
              </a>

              <form action="/api/admin/logout" method="post">
                <button className="btn-secondary" type="submit">
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Menú</th>
                  <th>Alergias</th>
                  <th>Fecha inscripción</th>
                </tr>
              </thead>
              <tbody>
                {signups.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Todavía no hay inscritos.</td>
                  </tr>
                ) : (
                  signups.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td style={{ textTransform: "capitalize" }}>{item.menu_choice}</td>
                      <td>{item.allergies}</td>
                      <td>
                        {new Intl.DateTimeFormat("es-ES", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(item.created_at))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
