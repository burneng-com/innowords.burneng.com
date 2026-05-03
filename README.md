# 🎯 InnoWords

> A playful vocabulary quest for **innoblue** — 每天 5 分鐘，像玩小遊戲一樣累積英文單字量。

InnoWords 是一個 mobile-first 的英文單字學習 PWA，靈感來自 Duolingo，但更輕量、專注於單字累積。所有進度透過 `localStorage` 儲存，不需要登入或後端，可以直接部署到 Cloudflare Pages。

🌐 **Production URL**: [innowords.bruneng.com](https://innowords.bruneng.com)

---

## ✨ Features

### 5 種學習模式
1. **📅 Daily Word Quest** — 每日 5 個新單字，內含詞性、中文意思、英文解釋、例句、發音提示
2. **🎴 Flashcards** — 翻卡學習，可標記「我會了」或「之後複習」
3. **❓ Multiple Choice Quiz** — 4 選 1 中文意思測驗，即時回饋
4. **🎯 Word Match** — 英文單字配對中文意思
5. **✍️ Fill in the Blank** — 在 Review 頁的填空挑戰

### 遊戲化系統
- 🔥 **連續打卡天數** (Streak)
- ⚡ **XP 經驗值** + 等級系統 (每 50 XP 升一級)
- 📊 進度條與動畫回饋
- 🎊 慶祝紙花動畫
- 💬 隨機鼓勵訊息

### UI / UX
- 🌗 **暗黑模式** 切換
- 🌐 **中英文切換** (繁體中文 / English)
- 📱 Mobile-first，桌機自動置中為手機外觀容器
- 🎨 漸層配色、圓角卡片、流暢過渡動畫
- ♻️ 重置進度按鈕（含確認）

### 詞彙資料
- 內建 60+ 個中等程度的英文單字
- 每個單字包含：詞性、中文意思、英文解釋、例句、發音提示、難度標籤

---

## 🛠️ Tech Stack

| 項目 | 說明 |
|------|------|
| Runtime | [Bun](https://bun.sh/) |
| Framework | [Astro 6](https://astro.build/) (static output) |
| Language | TypeScript / Vanilla JS |
| Persistence | `localStorage` |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com/) (via Wrangler CLI) |
| Backend | 無 (純靜態) |
| Authentication | 無 |

---

## 🚀 Getting Started

### 1. 安裝相依套件
```bash
bun install
```

### 2. 啟動開發伺服器
```bash
bun run dev
```
打開 [http://localhost:4321](http://localhost:4321) 即可看到應用程式。

### 3. 建置 production 版本
```bash
bun run build
```
產出在 `dist/` 資料夾。

### 4. 預覽 production 版本
```bash
bun run preview
```

---

## ☁️ Deployment to Cloudflare Pages (本地部署)

我們使用 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) 從本地直接部署到 Cloudflare Pages。

### 第一次設置

#### 1. 登入 Cloudflare
```bash
bun run cf:login
```
這會打開瀏覽器讓你授權。

#### 2. 部署到 Production
```bash
bun run deploy
```

這個指令會：
1. 執行 `bun run build` 建置靜態網站到 `dist/`
2. 透過 `wrangler pages deploy dist --project-name=innowords` 上傳到 Cloudflare

第一次部署時，Wrangler 會自動建立 `innowords` 專案。

#### 3. 部署 Preview 版本
```bash
bun run deploy:preview
```

### 設置自訂網域 (innowords.bruneng.com)

1. 部署完成後，到 [Cloudflare Pages Dashboard](https://dash.cloudflare.com/?to=/:account/pages)
2. 選擇 `innowords` 專案
3. 點選 **Custom domains** → **Set up a custom domain**
4. 輸入 `innowords.bruneng.com`
5. Cloudflare 會自動建立 CNAME (因為 `bruneng.com` 已在 Cloudflare DNS)

### Wrangler 設定 (`wrangler.toml`)
```toml
name = "innowords"
compatibility_date = "2024-12-01"
pages_build_output_dir = "dist"
```

---

## 📂 Project Structure

```
innowords-bruneng-com/
├── public/
│   └── favicon.svg              # InnoWords 漸層 logo
├── src/
│   ├── components/
│   │   └── App.ts               # 主要應用邏輯 (5 個模式 + 遊戲化)
│   ├── data/
│   │   ├── vocabulary.ts        # 60+ 個單字資料
│   │   └── i18n.ts              # 中英文翻譯字串
│   ├── pages/
│   │   └── index.astro          # 主頁面 (HTML 結構 + bottom nav + settings)
│   └── styles/
│       └── global.css           # 全域樣式 (含暗黑模式、動畫)
├── astro.config.mjs             # Astro 設定 (static output)
├── wrangler.toml                # Cloudflare Pages 設定
├── package.json
├── README.md
└── worklog.md                   # 開發日誌
```

---

## 💾 Data Persistence (localStorage)

所有狀態存在瀏覽器的 `localStorage` 中：

| Key | 內容 |
|-----|------|
| `innowords_state_v1` | XP / Level / Streak / Review List / Known Words / Daily Date |
| `innowords_theme` | `light` 或 `dark` |
| `innowords_lang` | `zh` 或 `en` |

**清除所有進度：** Settings → Reset Progress (或在瀏覽器 DevTools 清除 localStorage)

---

## 🎮 Gameplay Tips

- **每天打卡**：完成 Daily Word Quest 連續打卡，提升 streak 🔥
- **Flashcard**：對自己誠實，不會的單字標「之後複習」
- **Quiz**：滿分有額外 confetti 慶祝動畫 🎊
- **Match**：5 對配對遊戲，每組 +8 XP
- **Review**：填空挑戰會從整個詞彙池隨機抽題

### XP 獎勵表

| 行為 | XP |
|------|-----|
| 完成 Daily Quest | +25 |
| Flashcard 標「我會了」 | +5 |
| Quiz 答對 | +10 |
| Quiz 答錯 | +1 (鼓勵嘗試) |
| Match 配對成功 | +8 |
| Fill-in-Blank 答對 | +8 |
| 從 Review 移除 | +5 |

每 50 × `level` XP 升一級。

---

## 🌐 i18n (中英文切換)

點右上角 ⚙️ 設定按鈕 → Language → 選擇中文 / English。

支援的語言：
- 🇹🇼 繁體中文 (預設)
- 🇺🇸 English

UI 文字、按鈕標籤、鼓勵訊息都會即時切換。詞彙的「英文單字」與「中文意思」永遠都顯示，因為這是學習目標。

---

## 🛠️ Development

### 加入新單字
編輯 `src/data/vocabulary.ts`，按照現有格式新增物件即可：

```ts
{
  id: 61,
  word: "your_word",
  partOfSpeech: "verb",
  chineseMeaning: "中文意思",
  englishMeaning: "English explanation",
  exampleSentence: "An example sentence.",
  pronunciationHint: "your-WORD",
  difficulty: "easy"  // easy | medium | hard
}
```

### 加入新翻譯
編輯 `src/data/i18n.ts`，在 `en` 與 `zh` 兩個物件中加入對應的鍵值。

---

## 📝 License

Private project — 屬於 [innoblue](https://github.com/innoblue) 個人。

---

## 🙏 Credits

Built by Claude Code, designed for **innoblue** to enjoy a daily English vocabulary quest. 🎯
