# Test Plan — 建立公司資訊(名稱 + 統一編號)CRUD(Issue #1)

## 來源

- Spec:`docs/tickets/1/spec.md`
- PR:#2

## 測試項目

| # | 對應 AC | 測試步驟 | 預期結果 | 類型 |
|---|---------|----------|----------|------|
| T1 | AC1 | 於 `/companies/new` 輸入公司名稱與格式合法的統一編號(如 `10000009`)並送出 | 導向 `/companies`,新資料出現在列表中,資料庫確實新增一筆記錄 | 自動(`actions.test.ts`)+ 手動 |
| T2 | AC2 | 於新增/編輯頁輸入非 8 碼數字(如 `1234567`)或未過檢查碼的統編(如 `48000000`)並送出 | 系統拒絕操作,顯示格式錯誤訊息,資料庫未新增/未更新 | 自動(`taxId.test.ts`、`actions.test.ts`)+ 手動 |
| T3 | AC3 | 已有一筆統編為 X 的未刪除公司,新增或修改另一筆為相同統編 X | 系統拒絕操作,顯示重複錯誤訊息,資料庫沒有第二筆相同統編的未刪除資料 | 自動(`actions.test.ts`) |
| T3b | AC3(邊界) | 已有一筆統編為 X 但已軟刪除的公司,新增一筆統編同為 X 的新公司 | 允許新增成功(軟刪除的資料不算在唯一性檢查內) | 自動(`actions.test.ts`) |
| T4 | AC4 | 系統中有多筆公司資料(含至少一筆已軟刪除),查詢 `/companies` | 只顯示未刪除的公司名稱與統一編號,已刪除的不出現 | 自動(`actions.test.ts`)+ 手動 |
| T5 | AC5 | 修改既有公司的名稱或統一編號為合法且不重複的新值並送出 | 該筆資料更新成功,`/companies` 列表顯示新值 | 自動(`actions.test.ts`)+ 手動 |
| T5b | AC5(邊界) | 修改公司時統一編號維持原值不變(不改統編只改名稱) | 允許更新成功(不會誤判成與自己重複) | 自動(`actions.test.ts`) |
| T6 | AC6 | 對既有公司執行刪除 | `/companies` 列表不再顯示該筆資料,但直接查資料庫該筆記錄仍存在且 `deletedAt` 有值 | 自動(`actions.test.ts`)+ 手動 |

## 回歸範圍

本票是專案的第一個功能與第一次建立專案骨架,repo 內沒有其他既有功能,因此沒有
額外的回歸測試範圍。後續票如果修改 `Company` schema、`app/companies/actions.ts`
的共用驗證邏輯(`isTaxIdTakenByOther`、`isValidTaxId`),都要重跑本測試計劃的
T1-T6 作為回歸基準。

## 測試環境與資料

- 環境:本地開發環境,`next dev` + 本地 PostgreSQL(Docker container `crm_test_db`,
  port 5434,連線字串見 `.env.example` 格式)。跑 `npx prisma migrate dev` 套用
  schema 後即可測試,不需要額外種子資料。
- 沒有串接第三方系統(SAP/ERP 等),不需要 mock 外部服務。
- 自動測試(`npm run test`)直接對真實 Postgres 執行整合測試(非 mock DB),
  每個測試案例在 `beforeEach` 清空 `Company` 表以確保互不干擾;跑測試前需要
  `DATABASE_URL` 指向可用的測試用 Postgres。
- 統一編號測試資料使用 `lib/validation/taxId.test.ts` 已驗證過的合法碼
  (`10000009`、`48000009`、`10000078`)與已知不合法碼(`1234567`、`48000000`)。

## 簽核

| 關卡 | 結論 | 決定者 | 身分 | 日期 | 依據 |
|------|------|--------|------|------|------|
| testplan | pass | testplan-reviewer | agent | 2026-09-08 | AC1-6 皆有對應測項(含 T3b/T5b 兩個 spec 隱含的邊界情境);測試步驟與預期結果具體可執行;回歸範圍合理(全新專案僅此一功能);測試環境與資料交代清楚,QA 可直接照做 |
