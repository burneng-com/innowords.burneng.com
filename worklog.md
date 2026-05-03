# 📝 InnoWords 開發日誌 (Worklog)

> 此檔案記錄 InnoWords 專案的開發過程、決策、與里程碑。

---

## 🗓️ 2026-05-03 — 專案初始化 & MVP 完成

### 🎯 目標
為 innoblue 打造一個 mobile-first 的英文單字學習網站，部署到 `innowords.bruneng.com`。

### ✅ 完成項目

#### 階段 1: 專案初始化
- [x] 用 `bun create astro@latest --template minimal` 建立 Astro 專案骨架
- [x] 初始化 `bun install`，鎖定 Astro 6.2.1
- [x] 確認專案結構：`src/pages/`, `src/components/`, `src/data/`, `src/styles/`

#### 階段 2: 資料層
- [x] 建立 `src/data/vocabulary.ts`，60 個中等難度的英文單字
  - 每個單字包含：`id`, `word`, `partOfSpeech`, `chineseMeaning`, `englishMeaning`, `exampleSentence`, `pronunciationHint`, `difficulty`
  - 加入 helper functions：`getRandomWords()`, `getDailyWords()`, `getWordsForDifficulty()`, `getWordById()`
  - `getDailyWords()` 採用「日期種子」方式產生，同一天每次拿到的 5 個單字都一樣
- [x] 建立 `src/data/i18n.ts`，提供完整的中英文翻譯
  - 130+ 個翻譯字串，涵蓋 5 個學習模式 + 設定 + 鼓勵語

#### 階段 3: 樣式與設計系統
- [x] 建立 `src/styles/global.css`，包含：
  - CSS 變數 (色票、間距、圓角、陰影、過渡)
  - **暗黑模式** 支援 (`[data-theme="dark"]`)
  - Mobile-first layout，桌機自動置中為 430px 手機外觀
  - 5 種卡片動畫 (`fadeIn`, `popIn`, `shake`, `float`, `confetti`)
  - 漸層配色：主色 `#4F6DFF` → 紫色 `#A55EEA`
  - Bottom navigation 樣式
  - Flashcard 翻面 3D 效果

#### 階段 4: 核心應用邏輯
- [x] 建立 `src/components/App.ts` (約 1000 行 TypeScript)
- [x] 實作 5 個學習模式：
  1. **Daily Word Quest** — 每日 5 個固定單字，完成可 +25 XP
  2. **Flashcards** — 10 張一輪，3D 翻卡，「會了」+5 XP
  3. **Multiple Choice Quiz** — 5 題一輪，答對 +10 XP，答錯 +1 XP
  4. **Word Match** — 5 對配對，每對 +8 XP
  5. **Fill in the Blank** — 嵌在 Review 頁面，答對 +8 XP
- [x] 實作 **遊戲化系統**：
  - XP 累積 (每 50 × level XP 升一級)
  - 連續打卡 streak (基於 `lastActiveDate` 比對)
  - 紙花慶祝動畫 (Daily 完成 / 滿分 Quiz / 全部配對)
  - Toast 訊息提示
- [x] 實作 **設定面板**：
  - 暗黑/亮色模式切換 (含 prefers-color-scheme 偵測)
  - 中英文切換 (即時更新所有 UI 文字)
  - 重置進度 (含確認對話框)
- [x] 實作 **localStorage 持久化**：
  - `innowords_state_v1`: 主要應用狀態 (XP / Level / Streak / Review / Known)
  - `innowords_theme`: 主題偏好
  - `innowords_lang`: 語言偏好

#### 階段 5: HTML 結構
- [x] 改寫 `src/pages/index.astro`：
  - Mobile viewport meta + theme-color
  - 載入 `global.css`
  - Header (動態渲染)、Main content、Settings modal、Bottom nav
  - 載入 `App.ts` (Astro 自動 bundle TypeScript)
- [x] 自製 InnoWords 漸層 favicon (`public/favicon.svg`)

#### 階段 6: 部署設置
- [x] 安裝 `wrangler` 為 devDependency
- [x] 建立 `wrangler.toml`：
  ```toml
  name = "innowords"
  compatibility_date = "2024-12-01"
  pages_build_output_dir = "dist"
  ```
- [x] 在 `package.json` 加入部署腳本：
  - `bun run deploy` — build + 部署到 production
  - `bun run deploy:preview` — build + 部署到 preview branch
  - `bun run cf:login` — 登入 Cloudflare
- [x] 更新 `astro.config.mjs` 為 `output: 'static'`，相容 Cloudflare Pages

#### 階段 7: 文件
- [x] 撰寫 `README.md` (使用 / 部署 / Tech stack / Gameplay tips)
- [x] 撰寫 `worklog.md` (本檔案)

### 🧠 主要設計決策

#### 為什麼選 Astro + 純 TypeScript？
- 使用者要求 Bun + Astro 組合
- 因為這是純前端互動，不需要 SSR，所以採 `output: 'static'`
- 不引入 React/Vue 等框架，降低 bundle size，加快載入

#### 為什麼資料只放 `localStorage`？
- 使用者明確指出「不要後端」
- 每個使用者只在自己的瀏覽器使用，不需要跨裝置同步
- localStorage 上限約 5-10 MB，足以儲存 1000+ 個單字進度

#### 為什麼 `Daily Words` 用日期種子算法？
- 確保使用者今天看到的 5 個單字今天都一樣，不會每次點選都換
- 不需要伺服器，純前端就能算
- 算法：`hashA = ((id * 9301 + dateSeed) % 49297) / 49297` → sort

#### 為什麼預設語言是中文？
- innoblue 是中文母語使用者，預設中文降低使用門檻
- 但 UI 要清楚保留切英文的選項，方便沉浸式學習

#### 安全性考量
- 在處理 DOM 動態內容時，全程用 `createElement` + `textContent`，避免 `innerHTML` 的 XSS 風險
- 雖然詞彙資料是寫死的不會被注入，但好習慣養成

### 🎨 UI/UX 細節

- **Bottom nav** 固定 64px，5 個 tab，每個 tab 有 SVG icon + 文字
- **Flashcard** 用 CSS 3D transform 翻面，正面是英文 + 發音，背面是中文 + 例句
- **Match game** 採左右兩欄設計，正確配對後綠色高亮、變透明
- **Quiz feedback** 答對綠色背景 + ✓，答錯粉色背景 + ✗ + shake 動畫
- **Confetti** 30 個彩色方塊隨機落下，3 秒後自動清除

### 🚀 部署流程 (本地部署)

```bash
# 第一次設置
bun install
bun run cf:login   # 在瀏覽器授權

# 部署到 production
bun run deploy

# 之後在 Cloudflare Pages Dashboard 綁定自訂網域
# innowords.bruneng.com → CNAME 到 innowords.pages.dev
```

### 📊 統計
- 總檔案數：~10
- 總程式碼行數：~2500 (含 CSS / TS / Astro / Markdown)
- 內建單字數：60
- 學習模式數：5
- 支援語言：2 (中文 / 英文)
- 主題：2 (亮 / 暗)

---

## 🔜 後續可能的功能 (TODO)

- [ ] 加入更多單字 (目標 200+)
- [ ] 加入發音音檔 (用 Web Speech API 即時發音)
- [ ] 加入「按詞性分類」的篩選器
- [ ] 加入週統計 / 月統計圖表
- [ ] 加入分享成就到社群的功能
- [ ] PWA manifest，可加到主畫面
- [ ] 自訂單字本：使用者自己加單字
- [ ] 拼字模式：根據中文意思打字拼出英文
- [ ] 聽力模式：聽 TTS 然後選正確的單字
- [ ] 匯出 / 匯入進度 (JSON 檔)

---

## 📌 開發筆記 (Notes)

- 使用者偏好用 Bun，所有指令都用 `bun run XXX` 而非 `npm`
- 專案路徑：`/Users/eugene/Dropbox/burneng-com/innowords-bruneng-com`
- 目標 subdomain：`innowords.bruneng.com`
- 主要使用者：**innoblue** (主人)
- App 名稱：**InnoWords**
- Tagline：「innoblue 專屬的單字冒險」/「A playful vocabulary quest」
