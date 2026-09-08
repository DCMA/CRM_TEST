# Test Report — 建立公司資訊(名稱 + 統一編號)CRUD(Issue #1)

## 來源

- Test Plan:`docs/tickets/1/test-plan.md`
- 測試環境:本地開發環境,`next dev` + 本地 PostgreSQL(Docker `crm_test_db`,port 5434),main 分支 commit `db87456`(已含 PR #2 全部變更)
- 執行時間:2026-09-08

## 結果總覽

| 通過 | 失敗 | 未執行 |
|------|------|--------|
| 10 | 0 | 0 |

## 逐項結果

| # | 結果 | 證據(log / 截圖 / 輸出) | 備註 |
|---|------|--------------------------|------|
| 自動套件 | ✅ | `npm run test`:2 test files passed, 15 tests passed(`lib/validation/taxId.test.ts` 6 個、`app/companies/actions.test.ts` 9 個) | 涵蓋 T1-T6 及 T3b/T5b 等價的自動化案例 |
| 自動 lint/build | ✅ | `npm run lint`(0 warning/error)、`npm run build`(TypeScript 檢查通過,`/companies`、`/companies/[id]/edit` 正確標示為 Dynamic) | |
| T1 | ✅ | 手動於 `/companies/new` 輸入合法統編 `10000009`,導向 `/companies` 並顯示新資料 | |
| T2 | ✅ | 手動輸入未過檢查碼的統編 `48000000`,頁面顯示「統一編號格式不正確」,未建立資料 | |
| T3 | ✅ | 手動對已存在的 `10000009` 再次新增,頁面顯示「統一編號已存在」,未建立第二筆 | |
| T3b | ✅ | 手動將已軟刪除公司的統編(`48000009`)用於新公司,成功建立(見下方 T6 之後的重用測試) | 驗證軟刪除資料不計入唯一性檢查 |
| T4 | ✅ | 手動查詢 `/companies`,格式錯誤(T2)與重複(T3)的操作皆未出現在列表,只顯示成功建立的資料 | |
| T5 | ✅ | 手動將公司名稱與統編一併修改為新的合法值(`48000009`),列表顯示更新後的值 | |
| T5b | ✅ | 手動只修改公司名稱、統編維持原值(`10000009`)不變,更新成功未被誤判為重複 | 驗證「排除自己 id」的唯一性檢查邏輯 |
| T6 | ✅ | 手動執行刪除,`/companies` 列表立即不再顯示該筆資料;直接查詢資料庫確認該筆記錄仍存在且 `deletedAt` 已設定時間戳 | 證據見 verification/t6-db-state.txt |

## 失敗項目與處置

無失敗項目。

## UAT 交接

- **測什麼**:業務人員在 `/companies` 建立、查詢、修改、刪除公司資料(名稱 + 統一編號)的完整流程。
- **怎麼進入測試環境**:
  1. `npm install`
  2. 確認本地 PostgreSQL 可用(或啟動 `docker run -d --name crm_test_db -e POSTGRES_USER=crm -e POSTGRES_PASSWORD=crm -e POSTGRES_DB=crm_test -p 5434:5432 postgres:16`)
  3. `.env` 設定 `DATABASE_URL="postgresql://crm:crm@localhost:5434/crm_test?schema=public"`(範例見 `.env.example`)
  4. `npx prisma migrate deploy`
  5. `npm run dev`,瀏覽 `http://localhost:3000/companies`
- **已知限制**(不阻擋 UAT,已在 PR review 中揭露):
  - 統編唯一性檢查是 check-then-create,理論上有極低機率的併發重複風險
  - 軟刪除的公司資料目前沒有復原入口(UI 上看不到已刪除的資料,需要直接操作資料庫才能復原)
  - 沒有權限控管(任何能進入系統的人都可以新增/修改/刪除),此為 spec 明確排除的範圍
