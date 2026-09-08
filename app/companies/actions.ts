"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isValidTaxId } from "@/lib/validation/taxId";

export type CompanyFormState = {
  error?: string;
};

async function isTaxIdTakenByOther(
  taxId: string,
  excludeId?: string,
): Promise<boolean> {
  const existing = await prisma.company.findFirst({
    where: {
      taxId,
      deletedAt: null,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });
  return existing !== null;
}

function readCompanyInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    taxId: String(formData.get("taxId") ?? "").trim(),
  };
}

export async function createCompany(
  _prevState: CompanyFormState,
  formData: FormData,
): Promise<CompanyFormState> {
  const { name, taxId } = readCompanyInput(formData);

  if (!name) {
    return { error: "公司名稱不可為空" };
  }
  if (!isValidTaxId(taxId)) {
    return { error: "統一編號格式不正確(需為 8 碼數字且通過檢查碼驗證)" };
  }
  if (await isTaxIdTakenByOther(taxId)) {
    return { error: "統一編號已存在" };
  }

  await prisma.company.create({ data: { name, taxId } });
  redirect("/companies");
}

export async function listCompanies() {
  return prisma.company.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCompany(id: string) {
  return prisma.company.findFirst({ where: { id, deletedAt: null } });
}

export async function updateCompany(
  id: string,
  _prevState: CompanyFormState,
  formData: FormData,
): Promise<CompanyFormState> {
  const { name, taxId } = readCompanyInput(formData);

  if (!name) {
    return { error: "公司名稱不可為空" };
  }
  if (!isValidTaxId(taxId)) {
    return { error: "統一編號格式不正確(需為 8 碼數字且通過檢查碼驗證)" };
  }
  if (await isTaxIdTakenByOther(taxId, id)) {
    return { error: "統一編號已存在" };
  }

  await prisma.company.update({ where: { id }, data: { name, taxId } });
  redirect("/companies");
}
