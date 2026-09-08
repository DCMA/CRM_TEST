# Plan — 建立公司資訊(名稱 + 統一編號)CRUD(Issue #1)

## 來源

- Spec:`docs/tickets/1/spec.md`(核准版本 commit:6d9996a)

## 變更範圍

技術棧決定(本票一併建立專案骨架,因為目前是空 repo):Next.js(App Router)+
TypeScript + Prisma + PostgreSQL。

| 檔案 / 模組 | 變更內容 |
|-------------|----------|
| `package.json`, `tsconfig.json`, `next.config.ts` | 建立 Next.js + TypeScript 專案骨架 |
| `prisma/schema.prisma` | 定義 `Company` model:`id`、`name`、`taxId`(unique)、`deletedAt`(軟刪除用)、`createdAt`、`updatedAt` |
| `prisma/migrations/`(初始 migration) | 對應 schema 產生的初始 migration |
| `lib/prisma.ts` | Prisma Client singleton |
| `lib/validation/taxId.ts` | 台灣統編格式(8 碼數字)+ 檢查碼演算法驗證函式 |
| `lib/validation/taxId.test.ts` | 統編驗證邏輯的單元測試(合法碼、格式錯、檢查碼錯) |
| `app/companies/actions.ts` | Server actions:`createCompany`、`listCompanies`、`updateCompany`、`softDeleteCompany`(含統編格式驗證與唯一性檢查) |
| `app/companies/actions.test.ts` | CRUD actions 的整合測試(含重複統編、軟刪除後不出現在列表) |
| `app/companies/page.tsx` | 公司列表頁(顯示未刪除資料) |
| `app/companies/new/page.tsx` | 新增公司表單頁 |
| `app/companies/[id]/edit/page.tsx` | 編輯公司表單頁 |
| `components/CompanyForm.tsx` | 新增/編輯共用表單元件(含前端基本輸入檢查) |

## 實作順序

以 tracer bullet 排序,每一步都是一條可獨立驗證的垂直切片:

1. **專案骨架** — 建立 Next.js + TypeScript 專案(`package.json`、`tsconfig.json`、
   `next.config.ts`),確認 `next dev` 可以跑起來、有一個可存取的首頁。
2. **統編驗證邏輯(先寫測試)** — 先寫 `lib/validation/taxId.test.ts` 涵蓋 AC2
   (格式錯 / 檢查碼錯 / 合法碼三種情境),再實作 `lib/validation/taxId.ts` 讓
   測試通過。這是純函式,不依賴資料庫,最適合第一個垂直切片。
3. **新增(Create)垂直切片** — 建立 `prisma/schema.prisma`(`Company` model)、
   初始 migration、`lib/prisma.ts`、`app/companies/actions.ts` 的
   `createCompany`(套用統編驗證 + 唯一鍵檢查,對應 AC1、AC2、AC3)、
   `app/companies/new/page.tsx` + `CompanyForm.tsx`。做完可以手動新增一筆資料
   並在資料庫看到。
4. **查詢(Read)垂直切片** — `listCompanies`(排除 `deletedAt` 非 null 的資料,
   對應 AC4)+ `app/companies/page.tsx` 列表頁。做完可以在畫面上看到剛新增的資料。
5. **修改(Update)垂直切片** — `updateCompany`(套用同樣的驗證與唯一鍵檢查,
   對應 AC5)+ `app/companies/[id]/edit/page.tsx`,`CompanyForm.tsx` 擴充支援
   編輯模式。
6. **刪除(Soft delete)垂直切片** — `softDeleteCompany`(設定 `deletedAt`,
   對應 AC6)+ 列表頁的刪除操作入口。
7. **整合測試補齊** — `app/companies/actions.test.ts` 補齊 AC1-AC6 對應的
   CRUD 整合測試案例。

## 風險與對策

- **規模偏大,使用者選擇不拆票**:本票同時包含專案骨架建立與第一個 CRUD 功能,
  預估變更 12-14 個檔案、跨 4 個模組(骨架/資料層/邏輯層/UI層),超過建議拆票的
  門檻。已在 `write-plan` 階段提出證據並詢問使用者,使用者決定維持單一 plan、
  不拆票,理由是專案骨架屬於一次性設定,與第一個 CRUD 功能綁在一起才能驗證
  整條路徑是否打通。
- **統編檢查碼演算法實作錯誤風險**:先寫測試(步驟 2)並涵蓋已知合法統編範例與
  邊界情況,降低誤判風險。
- **資料庫 schema 一旦上線後修改成本較高**:目前是全新專案、尚無正式資料,
  風險可控;`taxId` 設定 unique constraint 由資料庫層保證,不僅靠應用層檢查。
- **軟刪除邏輯遺漏(查詢忘記過濾 `deletedAt`)**:在 `listCompanies` 與所有
  查詢路徑統一過濾,並在整合測試(步驟 7)明確涵蓋「刪除後不出現在列表」案例。

## 驗證方式

- 執行 `lib/validation/taxId.test.ts`、`app/companies/actions.test.ts`,全數通過。
- 手動操作:`next dev` 啟動後,於 `/companies/new` 新增一筆資料(含格式錯誤與
  重複統編的錯誤情境),於 `/companies` 列表確認顯示,於編輯頁修改後確認列表
  同步更新,執行刪除後確認該筆資料不再出現於列表。
- 逐條對照 spec.md 的 AC1-AC6 手動或自動驗證皆通過。

## 簽核

| 關卡 | 結論 | 決定者 | 身分 | 日期 | 依據 |
|------|------|--------|------|------|------|
| plan |      |        |      |      |      |
