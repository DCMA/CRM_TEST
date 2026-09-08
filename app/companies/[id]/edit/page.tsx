import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyForm } from "@/components/CompanyForm";
import { getCompany, updateCompany } from "@/app/companies/actions";

type EditCompanyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCompanyPage({
  params,
}: EditCompanyPageProps) {
  const { id } = await params;
  const company = await getCompany(id);

  if (!company) {
    notFound();
  }

  const updateCompanyWithId = updateCompany.bind(null, company.id);

  return (
    <main>
      <h1>編輯公司資料</h1>
      <CompanyForm
        action={updateCompanyWithId}
        defaultValues={{ name: company.name, taxId: company.taxId }}
        submitLabel="更新"
      />
      <p>
        <Link href="/companies">回列表</Link>
      </p>
    </main>
  );
}
