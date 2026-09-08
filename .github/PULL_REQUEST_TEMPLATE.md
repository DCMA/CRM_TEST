## 對應 Ticket

Related to #<N>

<!-- 替換 <N> 為實際 ticket 編號。注意是 "Related to" 不是 "Closes"——用 Closes
     會讓 issue 在這個 PR merge 時就關掉,但票 merge 後還要走 To be verified /
     Verifying / UAT,不該這時候關單。

     這行只是給人看的 cross-reference,review-mr 不會讀它:票與 PR 的關聯是靠
     Project board(或 Jira)的 `Linked PR` 欄位,由 open-pr.sh 寫入。所以 PR
     請優先用 aidlc 的方式開:
       "${CLAUDE_PLUGIN_ROOT}/scripts/open-pr.sh" <N> "<title>" <body-file>
     從 GitHub 網頁開的 PR 要補跑:
       "${CLAUDE_PLUGIN_ROOT}/scripts/write-pr-field.sh" <N> "#<PR 編號> <PR URL>"

     Jira tracker:把上面的 "Related to #<N>" 改成 `Ticket: <ISSUE-KEY>`
     (Jira key 在 GitHub 不會產生連結),實際關聯靠 editJiraIssue 把 PR 網址
     填進 Jira 票的 Linked PR 欄位。 -->

## 摘要

<!-- 這個 PR 做了什麼、為什麼 -->

## 測試

<!-- 怎麼驗證這個改動:跑了什麼測試、手動驗證步驟 -->
