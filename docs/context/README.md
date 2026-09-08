# 專案知識庫(Project Context)

> 所有 aidlc skill 透過 `aidlc:project-context` 載入這個目錄。
> 放「domain 知識、系統串接、名詞定義」——會過期的事實寫上日期。

建議檔案(依需要增減,保持每檔一個主題):

- `glossary.md` — 專案 / 公司術語表(縮寫、系統代號)
- `systems.md` — 對外串接系統清單(SAP、ERP、金流…):端點、權限、限制、聯絡窗口
- `domain.md` — 業務規則(例:訂單狀態機、庫存計算邏輯)
- `stakeholders.md` — 成員清單(姓名/角色/範圍/聯絡方式)+ 簽核關卡對照
  (Spec Review 的 PO、Plan 高風險變更的技術負責人、Test Plan 的 QA、UAT 的
  業務/使用者各是誰):skill 需要 tag 人簽核時查這裡,避免每張票都重新問一次。
  新增/異動成員不用重跑整個 `/aidlc:onboard`,見該 skill 的「新增/異動成員」章節

## 維護規則

- 每張票結案時,若過程中發現知識庫錯誤或缺漏,順手更新。
- 這裡只放**專案事實**。流程規則、review 政策、產出物格式屬於 aidlc plugin,
  公司跨專案共用的知識(公司術語、共用 API 標準)放公司共用 plugin——
  兩者都不要抄進這個目錄,抄過來就不會跟著升級。
