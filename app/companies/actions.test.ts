import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createCompany,
  getCompany,
  listCompanies,
  softDeleteCompany,
  updateCompany,
} from "./actions";

function formData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

async function expectRedirectTo(promise: Promise<unknown>, path: string) {
  try {
    await promise;
    throw new Error(`expected a redirect to ${path}, but none was thrown`);
  } catch (error) {
    if (!isNextRedirect(error)) throw error;
    expect((error as { digest: string }).digest).toContain(`;${path};`);
  }
}

const VALID_TAX_ID_1 = "10000009"; // see lib/validation/taxId.test.ts
const VALID_TAX_ID_2 = "48000009";

beforeEach(async () => {
  await prisma.company.deleteMany();
});

describe("createCompany", () => {
  it("creates a company and redirects to /companies (AC1)", async () => {
    await expectRedirectTo(
      createCompany(
        {},
        formData({ name: "測試公司", taxId: VALID_TAX_ID_1 }),
      ),
      "/companies",
    );

    const companies = await prisma.company.findMany();
    expect(companies).toHaveLength(1);
    expect(companies[0]).toMatchObject({
      name: "測試公司",
      taxId: VALID_TAX_ID_1,
      deletedAt: null,
    });
  });

  it("rejects an invalid tax ID and does not create a row (AC2)", async () => {
    const result = await createCompany(
      {},
      formData({ name: "測試公司", taxId: "1234567" }),
    );

    expect(result.error).toBeDefined();
    expect(await prisma.company.count()).toBe(0);
  });

  it("rejects a duplicate tax ID against an existing non-deleted company (AC3)", async () => {
    await prisma.company.create({
      data: { name: "既有公司", taxId: VALID_TAX_ID_1 },
    });

    const result = await createCompany(
      {},
      formData({ name: "另一家公司", taxId: VALID_TAX_ID_1 }),
    );

    expect(result.error).toBeDefined();
    expect(await prisma.company.count()).toBe(1);
  });

  it("allows reusing a tax ID that only belongs to a soft-deleted company", async () => {
    const deleted = await prisma.company.create({
      data: { name: "已刪除公司", taxId: VALID_TAX_ID_1, deletedAt: new Date() },
    });

    await expectRedirectTo(
      createCompany(
        {},
        formData({ name: "新公司", taxId: VALID_TAX_ID_1 }),
      ),
      "/companies",
    );

    const nonDeleted = await prisma.company.findMany({
      where: { deletedAt: null },
    });
    expect(nonDeleted).toHaveLength(1);
    expect(nonDeleted[0].name).toBe("新公司");
    expect(nonDeleted[0].id).not.toBe(deleted.id);
  });
});

describe("listCompanies", () => {
  it("returns only non-deleted companies (AC4)", async () => {
    await prisma.company.create({
      data: { name: "顯示中", taxId: VALID_TAX_ID_1 },
    });
    await prisma.company.create({
      data: { name: "已刪除", taxId: VALID_TAX_ID_2, deletedAt: new Date() },
    });

    const companies = await listCompanies();

    expect(companies).toHaveLength(1);
    expect(companies[0].name).toBe("顯示中");
  });
});

describe("updateCompany", () => {
  it("updates name and tax ID and redirects to /companies (AC5)", async () => {
    const company = await prisma.company.create({
      data: { name: "舊名稱", taxId: VALID_TAX_ID_1 },
    });

    await expectRedirectTo(
      updateCompany(
        company.id,
        {},
        formData({ name: "新名稱", taxId: VALID_TAX_ID_2 }),
      ),
      "/companies",
    );

    const updated = await getCompany(company.id);
    expect(updated).toMatchObject({ name: "新名稱", taxId: VALID_TAX_ID_2 });
  });

  it("rejects updating to a tax ID already used by another non-deleted company", async () => {
    const a = await prisma.company.create({
      data: { name: "公司 A", taxId: VALID_TAX_ID_1 },
    });
    await prisma.company.create({
      data: { name: "公司 B", taxId: VALID_TAX_ID_2 },
    });

    const result = await updateCompany(
      a.id,
      {},
      formData({ name: "公司 A", taxId: VALID_TAX_ID_2 }),
    );

    expect(result.error).toBeDefined();
    const unchanged = await getCompany(a.id);
    expect(unchanged?.taxId).toBe(VALID_TAX_ID_1);
  });

  it("allows keeping a company's own tax ID unchanged", async () => {
    const company = await prisma.company.create({
      data: { name: "公司", taxId: VALID_TAX_ID_1 },
    });

    await expectRedirectTo(
      updateCompany(
        company.id,
        {},
        formData({ name: "公司(改名)", taxId: VALID_TAX_ID_1 }),
      ),
      "/companies",
    );

    const updated = await getCompany(company.id);
    expect(updated?.name).toBe("公司(改名)");
  });
});

describe("softDeleteCompany", () => {
  it("marks a company deleted without removing the row (AC6)", async () => {
    const company = await prisma.company.create({
      data: { name: "待刪除", taxId: VALID_TAX_ID_1 },
    });

    // revalidatePath() requires a live Next.js request context, which
    // doesn't exist when calling the action directly from a vitest test
    // (confirmed working for real via manual browser verification).
    // Swallow just that one invariant so the test can assert on the DB
    // effect that actually matters here.
    try {
      await softDeleteCompany(formData({ id: company.id }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!message.includes("static generation store missing")) throw error;
    }

    const raw = await prisma.company.findUnique({ where: { id: company.id } });
    expect(raw).not.toBeNull();
    expect(raw?.deletedAt).not.toBeNull();

    const visible = await listCompanies();
    expect(visible.find((c) => c.id === company.id)).toBeUndefined();
  });
});
