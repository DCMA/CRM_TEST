import Link from "next/link";
import { listCompanies, softDeleteCompany } from "@/app/companies/actions";

// Always reflects the latest data — this list changes on every create/
// update/delete, so it must not be statically prerendered at build time.
export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await listCompanies();

  return (
    <main>
      <h1>公司資料</h1>
      <p>
        <Link href="/companies/new">新增公司</Link>
      </p>
      {companies.length === 0 ? (
        <p>目前沒有公司資料。</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>公司名稱</th>
              <th>統一編號</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.taxId}</td>
                <td>
                  <Link href={`/companies/${company.id}/edit`}>編輯</Link>
                </td>
                <td>
                  <form action={softDeleteCompany}>
                    <input type="hidden" name="id" value={company.id} />
                    <button type="submit">刪除</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
