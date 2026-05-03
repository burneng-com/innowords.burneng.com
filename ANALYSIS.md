# InnoWords 程式碼品質分析報告

> 分析日期：2026-05-03
> 專案路徑：/Users/eugene/Dropbox/burneng-com/innowords-bruneng-com

---

## 1. 程式碼品質 (Code Quality)

### 1.1 TypeScript 型別安全

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | `App.ts:367-378` | `difficultyBg()` 和 `difficultyLabel()` 參數型別為 `string`，應為 `'easy' \| 'medium' \| 'hard'` | 建立 `Difficulty` type alias |
| **Medium** | `App.ts:632` | `getWordsForDifficulty(difficulty: string)` 參數型別太寬鬆 | 改為 `difficulty: 'easy' \| 'medium' \| 'hard'` |
| **Low** | `App.ts:18-28` | `AppState` 介面缺少鴨子分部（duck typing）驗證 | 可考慮加入 runtime validation |

### 1.2 程式碼可讀性

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | `App.ts:168-1005` | `InnoWordsApp` 類別過於龐大（800+ 行），建議拆分成 Mixin 或模組 | 按功能拆分為 `GameStateMixin`, `RendererMixin` 等 |
| **Low** | `App.ts:68-75` | `todayStr()` 和 `yesterdayStr()` 重複的日期格式化邏輯 | 提取共用 utility function |

---

## 2. 架構設計 (Architecture)

### 2.1 模組化程度

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | `App.ts:168-1005` | 所有 UI 邏輯集中在單一類別，缺乏元件化 | 拆分為獨立組件（FlashcardView, QuizView 等） |
| **Low** | `vocabulary.ts`, `acronyms.ts` | 資料檔案無索引導出機制 | 建立 `index.ts` 統一導出 |

### 2.2 資料流

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | `App.ts:42-54` | `loadState()` / `saveState()` 無 atomic 保護，multi-tab 操作有 race condition 風險 | 考慮使用 `BroadcastChannel` 或 VERSION timestamp |
| **Low** | `App.ts:29-40` | `defaultState` 為 shallow copy，nested array mutation 風險較低但仍建議強化 | 使用 deep merge 或 `structuredClone()` |

---

## 3. 潛在 Bug (Potential Bugs)

### 3.1 Edge Cases

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **High** | `App.ts:421-429` | Daily 完成按鈕點擊後直接修改 `lastDailyDate`，若網頁時間被篡改可繞過驗證 | 改用 server-side timestamp 或更嚴格的 client-side 驗證 |
| **Medium** | `export-import.ts:33-82` | CSV import 時 `parseInt` 失敗不回報錯誤，視為 0 | 增加 parse error 回饋 |
| **Medium** | `App.ts:439-442` | Flashcard deck 為空時呼叫 `getRandomWords(10, knownIds)` 若 `knownIds` 涵蓋全部單字會回傳空陣列 | 處理 edge case，fallback 到無排除的隨機 |
| **Low** | `vocabulary.ts:621-629` | `getDailyWords` 使用確定性 hash，若 date 為無效值可能異常 | 增加 date validation |

### 3.2 記憶體洩漏風險

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | `App.ts:97-109` | `fireConfetti()` 使用 `setTimeout(() => piece.remove(), 4000)`，若 user 快速切換 tab 可能累積 orphaned elements | 考慮使用 CSS animation + `animationend` listener |
| **Low** | `App.ts:111-122` | `showToast` 創建 DOM 但沒有 cleanup mechanism | 加入 document-level toast container |

### 3.3 Race Condition

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **High** | `App.ts:42-54` | 多分頁同時 write localStorage 可能互相覆蓋 | 加入 VERSION field 或使用 `BroadcastChannel` 同步 |
| **Medium** | `export-import.ts:33-82` | CSV import 完成後立即 `saveState`，無 atomic 保證 | 先 validate 再 apply |

---

## 4. 效能 (Performance)

### 4.1 不必要的重渲染

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | `App.ts:347-365` | `switchTab` 每次清空並重建整個 DOM，效能損耗 | 使用 fragment 或差異更新 |
| **Low** | `App.ts:315-345` | `renderHeader` 每次重建整個 header，若 badge 順序固定可 incremental update | 快取 static elements |

### 4.2 DOM 操作優化

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Low** | `App.ts:135-137` | `clearChildren` 使用 `while + removeChild`，可用 `innerHTML = ''` 替代 | 效能優化但需注意 XSS |
| **Low** | `App.ts:577-612` | Quiz options 逐個 `appendChild`，可先用 `DocumentFragment` | batch append |

---

## 5. 安全性 (Security)

### 5.1 XSS 風險

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **High** | `index.astro:72` | `Version: v20260503.1` 硬編碼在 HTML 中，自動更新的 version 邏輯 client-side 執行 | 確保 server-side render version |
| **Low** | `App.ts:125-133` | `el()` helper 有 `html?: string` 參數但目前未使用，值得信賴但需注意未來變動 | 若不需要可移除該參數 |
| **Low** | `App.ts:947` | `container.innerHTML = ''` 在 `renderChangelog` 使用，若資料來自外部有風險 | 確認 `changelog` 為靜態定義 |

### 5.2 localStorage 濫用

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | `export-import.ts:33-82` | CSV import 無任何 input sanitization，直接寫入 state | 驗證每個 field 的 type 和 range |
| **Low** | `App.ts:53` | `localStorage.setItem` 在 quota 滿時會 silent fail | 加入 error handling 或 quota check |

---

## 6. 可維護性 (Maintainability)

### 6.1 程式碼重複

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | 多處 | Badge 創建 (`level-badge`, `streak-badge`, `xp-badge`) 邏輯重複 | 建立 `createBadge(type, value)` helper |
| **Medium** | 多處 | `el('div', { className: 'card ...' })` pattern 重複 | 建立 `createCard(children, style?)` helper |
| **Low** | `App.ts:324-326` | Header gradient 樣式重複 | 提出成 CSS class 或 utility |

### 6.2 過長函數

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **Medium** | `App.ts:519-618` | `renderQuiz()` 100 行，考慮拆分 | 提取 `renderQuizQuestion()`, `renderQuizResult()` |
| **Medium** | `App.ts:437-516` | `renderFlashcards()` 80 行 | 提取 `renderFlashcardFace()`, `renderFlashcardControls()` |
| **Medium** | `App.ts:381-434` | `renderDaily()` 55 行 | 提取 `renderWordCard()`, `renderDailyBanner()` |
| **Low** | `App.ts:763-841` | `buildFillInBlank()` 80 行 | 提取 `buildSentenceWithBlank()`, `buildFillOptions()` |

### 6.3 過度耦合

| 嚴重程度 | 檔案:行號 | 問題描述 | 建議修正 |
|---------|----------|---------|---------|
| **High** | `App.ts:168-1005` | InnoWordsApp 類別依賴所有功能，更改任一模組都會影響 | 重構為 composition: `App` + `ViewManager` + `StateManager` |
| **Medium** | `App.ts:111-122` | `showToast` 函數 hardcode 樣式，不易客製化 | 改用 CSS class 或 theme variable |

---

## 7. 總結與優先修復建議

### 緊急 (Critical)
1. **Race Condition** - `App.ts:42-54` localStorage 無 atomic 保護，multi-tab 數據可能損壞
2. **XSS** - `index.astro:72` version 硬編碼需確認安全
3. **Daily Bypass** - `App.ts:421-429` client-side date 可被篡改

### 高優先 (High)
4. CSV import validation - `export-import.ts:33-82`
5. Class 過度龐大 - `InnoWordsApp` 重構為 Composition API
6. Flashcard 空 deck edge case - `App.ts:439-442`

### 中優先 (Medium)
7. TypeScript 型別強化 - `difficultyBg`, `getWordsForDifficulty`
8. 程式碼重複 - badge creation, card creation helpers
9. 函數過長 - renderQuiz, renderFlashcards, buildFillInBlank

### 低優先 (Low)
10. DOM 操作優化 - clearChildren, fragment usage
11. Toast cleanup mechanism
12. CSS class extraction for repeated styles

---

## 附錄：檔案行數統計

| 檔案 | 總行數 | 主要職責 |
|-----|-------|---------|
| `src/components/App.ts` | 1006 | 主要應用邏輯、UI 渲染、狀態管理 |
| `src/data/vocabulary.ts` | 639 | 單字資料與 helper 函數 |
| `src/data/i18n.ts` | 359 | 多語系翻譯 |
| `src/data/export-import.ts` | 104 | CSV 匯出入功能 |
| `src/data/acronyms.ts` | 68 | 縮寫學習資料 |
| `src/data/changelog.ts` | 81 | 版本更新日誌 |
| `src/pages/index.astro` | 156 | Astro 頁面框架 |
| **Total** | **~2409 行** | |

建議重構方向：將 `App.ts` 拆分為多個職責明確的模組，參考 Component-Based Architecture。
