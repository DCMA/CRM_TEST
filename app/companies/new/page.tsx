import Link from "next/link";
import { CompanyForm } from "@/components/CompanyForm";
import { createCompany } from "@/app/companies/actions";

export default function NewCompanyPage() {
  return (
    <main>
      <h1>新增公司資料</h1>
      <CompanyForm action={createCompany} submitLabel="新增" />
      <p>
        <Link href="/companies">回列表</Link>
      </p>
    </main>
  );
}
