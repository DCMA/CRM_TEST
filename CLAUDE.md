# Project Conventions(給 agent 的專案慣例,保持一頁以內)

> 由 `/aidlc:init` 建立。用 `/aidlc:onboard` 訪談式填寫,只放「agent 每次都需要
> 知道」的事實——流程規則不寫在這裡,它屬於 aidlc plugin。

## 專案是什麼

CRM 系統,供內部業務團隊使用。

## 常用指令

```bash
# build: npm run build
# test:  npm run test
# lint:  npm run lint
```

## 架構要點

- 技術棧:Next.js(App Router)+ TypeScript + Prisma + PostgreSQL(見 #1 plan.md)。

## 慣例與地雷

<!-- 命名規則、不能動的目錄、已知的坑 -->

<!-- aidlc:pointer -->
## AI-DLC

本專案的票走 AI-DLC 9-state 流程。**流程規則、產出物格式、開 PR 的方式一律以
`aidlc` plugin 的 skill 為準**,不抄寫在這裡(抄過來就會跟 plugin 升級脫節)。

- 階段:`/aidlc:capture-intent`(開票)→ `/aidlc:write-spec <N>` →
  `/aidlc:write-plan <N>` → `/aidlc:implement <N>` → `/aidlc:review-mr <N>` →
  `/aidlc:write-test-plan <N>` → `/aidlc:run-verification <N>`
- 大 feature 不用另外記指令:`write-plan` 探索後規模過大會問你要不要拆成子票。
  拆了的話子票走到 merge,驗證在 parent 做
- 開 PR:走 `aidlc:ticket-ops` 的 `open-pr.sh`,不要直接 `gh pr create`
  (直接開的 PR 不會被記進票的 `Linked PR` 欄位,`review-mr` 之後找不到)
- 忘記某張票走到哪:`/aidlc:next <N>`;想看整個 board:`/aidlc:next`
- 需要人核准的關卡:agent 會在票上貼一則請求留言,**按 👍 就是核准**,👎 是退回
- 票的產出物:`docs/tickets/<N>/`;設定(含 `GATE_*` 關卡政策):`.aidlc/config`
