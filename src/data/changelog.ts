export interface ChangelogEntry {
  version: string;
  date: string;
  changes: { en: string[]; zh: string[] };
}

export const changelog: ChangelogEntry[] = [
  {
    version: "v20260503.2",
    date: "2026-05-03",
    changes: {
      en: [
        "✨ KK phonetic notation (Taiwan standard) for all 60 vocabulary words",
        "📌 Acronym learning section in Review tab: POC, MVP, FRS, PRD, POI",
        "🔒 Stricter CSV import validation with specific error messages",
        "🔧 Type safety: introduce Difficulty literal union type",
        "♻️ Refactor: extract createBadge and createProgressBar helpers",
        "♻️ Refactor: split long render functions for better maintainability",
        "🐞 Fix infinite recursion bug in pronunciation formatter (caught by QA)",
        "🐞 Fix CSV import: properly strip quoted values on parse",
        "🧪 Expand e2e test suite to 9 tests (added KK + CSV validation coverage)"
      ],
      zh: [
        "✨ 全部 60 個單字加入 KK 音標（台灣標準）",
        "📌 Review 頁面新增縮寫學習區塊：POC、MVP、FRS、PRD、POI",
        "🔒 CSV 匯入加入嚴格驗證，顯示具體錯誤訊息",
        "🔧 型別安全：新增 Difficulty literal union 型別",
        "♻️ 重構：提取 createBadge 和 createProgressBar 輔助函數",
        "♻️ 重構：拆分過長的渲染函數，提升可維護性",
        "🐞 修正音標 fallback 無窮遞迴（由 QA 抓到）",
        "🐞 修正 CSV 匯入：正確處理帶引號的數值",
        "🧪 e2e 測試擴充至 9 項（新增 KK 覆蓋率與 CSV 驗證）"
      ]
    }
  },
  {
    version: "v20260503.1",
    date: "2026-05-03",
    changes: {
      en: [
        "Initial release of InnoWords",
        "5 learning modes: Daily Quest, Flashcards, Quiz, Word Match, Fill-in-the-Blank",
        "Gamification: XP, Levels, Streak counter, confetti celebrations",
        "60 vocabulary words for intermediate learners",
        "Bilingual UI: Chinese / English toggle",
        "Dark mode support",
        "localStorage persistence for all progress",
        "Mobile-first responsive design",
        "Settings panel with theme, language, and reset options"
      ],
      zh: [
        "InnoWords 初始版本發布",
        "5 種學習模式：每日任務、單字卡、選擇題、單字配對、填空挑戰",
        "遊戲化：經驗值、等級、連續打卡、慶祝動畫",
        "60 個中等程度英文單字",
        "雙語介面：中文 / 英文 切換",
        "暗黑模式支援",
        "localStorage 進度持久化",
        "Mobile-first 響應式設計",
        "設定面板：主題、語言、重置進度"
      ]
    }
  }
];

export function getCurrentVersion(): string {
  const saved = localStorage.getItem('innowords_version');
  if (saved) return saved;
  return changelog[0].version;
}

export function bumpVersion(): string {
  const today = new Date();
  const dateStr = today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');
  
  const saved = localStorage.getItem('innowords_version');
  let buildNum = 1;
  
  if (saved) {
    const match = saved.match(new RegExp('v' + dateStr + '\\.(\\d+)'));
    if (match) {
      buildNum = parseInt(match[1], 10) + 1;
    }
  }
  
  const newVersion = `v${dateStr}.${buildNum}`;
  localStorage.setItem('innowords_version', newVersion);
  return newVersion;
}

export function checkNewVersion(): { isNew: boolean; previousVersion: string | null; currentVersion: string } {
  const current = getCurrentVersion();
  const saved = localStorage.getItem('innowords_version_checked');
  
  if (!saved || saved !== current) {
    localStorage.setItem('innowords_version_checked', current);
    return { isNew: true, previousVersion: saved, currentVersion: current };
  }
  
  return { isNew: false, previousVersion: saved, currentVersion: current };
}

export function formatVersionDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
