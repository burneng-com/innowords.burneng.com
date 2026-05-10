// Bilingual translations for InnoWords UI
export type Language = 'en' | 'zh';

export interface Translations {
  // App
  appName: string;
  appTagline: string;

  // Bottom nav
  navDaily: string;
  navCards: string;
  navQuiz: string;
  navMatch: string;
  navReview: string;

  // Daily mode
  dailyTitle: string;
  dailySubtitle: string;
  dailyComplete: string;
  dailyCompleted: string;
  dailyResetTomorrow: string;
  newWord: string;
  example: string;
  pronunciation: string;
  partOfSpeechLabel: string;

  // Flashcard mode
  flashcardTitle: string;
  flashcardSubtitle: string;
  tapToFlip: string;
  iKnowIt: string;
  reviewLater: string;
  flashcardEmpty: string;
  startOver: string;

  // Quiz mode
  quizTitle: string;
  quizSubtitle: string;
  quizQuestion: string;
  quizCorrect: string;
  quizWrong: string;
  quizScore: string;
  nextQuestion: string;
  quizComplete: string;
  playAgain: string;

  // Match mode
  matchTitle: string;
  matchSubtitle: string;
  matchSuccess: string;
  matchProgress: string;
  matchAllDone: string;
  newRound: string;

  // Fill in blank
  fillTitle: string;
  fillSubtitle: string;
  fillHint: string;
  fillCheck: string;
  fillNext: string;

  // Review
  reviewTitle: string;
  reviewSubtitle: string;
  reviewEmpty: string;
  reviewEmptyHint: string;
  removeFromReview: string;

  // Stats / Gamification
  streak: string;
  streakDays: string;
  xp: string;
  level: string;
  progress: string;

  // Settings
  settings: string;
  darkMode: string;
  language: string;
  resetProgress: string;
  resetConfirm: string;
  cancel: string;
  confirm: string;

  // Encouragement
  encouragement: string[];

  // Difficulty
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;

  // Common
  back: string;
  next: string;
  close: string;
  yes: string;
  no: string;
  awesome: string;
  greatJob: string;
  keepGoing: string;
  // Version & Changelog
  version: string;
  whatsNew: string;
  changelogTitle: string;
  changelogEmpty: string;
  closeChangelog: string;

  // Export/Import
  exportData: string;
  importData: string;
  exportCSV: string;
  importCSV: string;
  importSuccess: string;
  importError: string;
  importConfirm: string;
  exportFileName: string;
  // Acronyms
  acronymTitle: string;
  acronymSubtitle: string;
  acronymFullName: string;
  acronymChinese: string;
  acronymMemoryTip: string;
  acronymCategory: string;
  acronymEmpty: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "InnoWords",
    appTagline: "A playful vocabulary quest",

    navDaily: "Daily",
    navCards: "Cards",
    navQuiz: "Quiz",
    navMatch: "Match",
    navReview: "Review",

    dailyTitle: "Daily Word Quest",
    dailySubtitle: "Master 5 new words today!",
    dailyComplete: "Mark Today Complete",
    dailyCompleted: "Today's Quest Complete!",
    dailyResetTomorrow: "Come back tomorrow for new words!",
    newWord: "New Word",
    example: "Example",
    pronunciation: "Pronunciation",
    partOfSpeechLabel: "Part of speech",

    flashcardTitle: "Flashcards",
    flashcardSubtitle: "Tap card to flip & learn",
    tapToFlip: "Tap to reveal",
    iKnowIt: "I know it 👍",
    reviewLater: "Review later 🔄",
    flashcardEmpty: "All cards reviewed!",
    startOver: "Start Over",

    quizTitle: "Multiple Choice",
    quizSubtitle: "Pick the right meaning",
    quizQuestion: "What does this word mean?",
    quizCorrect: "Correct! 🎉",
    quizWrong: "Not quite!",
    quizScore: "Score",
    nextQuestion: "Next Question",
    quizComplete: "Quiz Complete!",
    playAgain: "Play Again",

    matchTitle: "Word Match",
    matchSubtitle: "Match words with meanings",
    matchSuccess: "Match!",
    matchProgress: "Matched",
    matchAllDone: "All Matched! 🎊",
    newRound: "New Round",

    fillTitle: "Fill the Blank",
    fillSubtitle: "Complete the sentence",
    fillHint: "Show hint",
    fillCheck: "Check Answer",
    fillNext: "Next Sentence",

    reviewTitle: "Review List",
    reviewSubtitle: "Words to review later",
    reviewEmpty: "No words to review!",
    reviewEmptyHint: "Words you mark for later will appear here.",
    removeFromReview: "Remove",

    streak: "Streak",
    streakDays: "days",
    xp: "XP",
    level: "Level",
    progress: "Progress",

    settings: "Settings",
    darkMode: "Dark Mode",
    language: "Language",
    resetProgress: "Reset Progress",
    resetConfirm: "Are you sure? This will erase all progress.",
    cancel: "Cancel",
    confirm: "Reset",

    encouragement: [
      "You're doing great! 🌟",
      "Keep up the awesome work!",
      "Every word counts! 💪",
      "Look at you go! 🚀",
      "Brilliant progress!",
      "You're on fire! 🔥",
      "Wonderful effort!",
      "One word at a time! 🌱"
    ],

    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",

    back: "Back",
    next: "Next",
    close: "Close",
    yes: "Yes",
    no: "No",
    awesome: "Awesome!",
    greatJob: "Great Job!",
    keepGoing: "Keep going!",

    version: "Version",
    whatsNew: "What's New",
    changelogTitle: "Changelog",
    changelogEmpty: "No changelog entries yet.",
    closeChangelog: "Close",

    exportData: "Export Data",
    importData: "Import Data",
    exportCSV: "Export as CSV",
    importCSV: "Import from CSV",
    importSuccess: "Import successful!",
    importError: "Import failed. Invalid file format.",
    importConfirm: "This will overwrite your current progress. Continue?",
    exportFileName: "innowords-progress.csv",

    acronymTitle: "Acronyms",
    acronymSubtitle: "Common English abbreviations for innoblue",
    acronymFullName: "Full Name",
    acronymChinese: "Chinese Meaning",
    acronymMemoryTip: "Memory Tip",
    acronymCategory: "Category",
    acronymEmpty: "No acronyms available."
  },
  zh: {
    appName: "InnoWords",
    appTagline: "innoblue 專屬的單字冒險",

    navDaily: "每日",
    navCards: "卡片",
    navQuiz: "問答",
    navMatch: "配對",
    navReview: "複習",

    dailyTitle: "每日單字任務",
    dailySubtitle: "今天征服 5 個新單字！",
    dailyComplete: "完成今日任務",
    dailyCompleted: "今日任務完成！",
    dailyResetTomorrow: "明天再來解鎖新單字！",
    newWord: "新單字",
    example: "例句",
    pronunciation: "發音",
    partOfSpeechLabel: "詞性",

    flashcardTitle: "單字卡",
    flashcardSubtitle: "點卡片翻面學習",
    tapToFlip: "點擊翻面",
    iKnowIt: "我會這個 👍",
    reviewLater: "之後複習 🔄",
    flashcardEmpty: "所有卡片都看完了！",
    startOver: "重新開始",

    quizTitle: "選擇題",
    quizSubtitle: "選出正確意思",
    quizQuestion: "這個單字是什麼意思？",
    quizCorrect: "答對了！🎉",
    quizWrong: "差一點點！",
    quizScore: "得分",
    nextQuestion: "下一題",
    quizComplete: "測驗完成！",
    playAgain: "再玩一次",

    matchTitle: "單字配對",
    matchSubtitle: "把單字和意思配在一起",
    matchSuccess: "配對成功！",
    matchProgress: "已配對",
    matchAllDone: "全部配對完成！🎊",
    newRound: "新的一輪",

    fillTitle: "填空挑戰",
    fillSubtitle: "完成這個句子",
    fillHint: "顯示提示",
    fillCheck: "檢查答案",
    fillNext: "下一句",

    reviewTitle: "複習清單",
    reviewSubtitle: "待複習的單字",
    reviewEmpty: "沒有需要複習的單字！",
    reviewEmptyHint: "你標記為「之後複習」的單字會顯示在這裡。",
    removeFromReview: "移除",

    streak: "連續",
    streakDays: "天",
    xp: "經驗",
    level: "等級",
    progress: "進度",

    settings: "設定",
    darkMode: "暗黑模式",
    language: "語言",
    resetProgress: "重置進度",
    resetConfirm: "確定要重置嗎？所有進度將會被清除。",
    cancel: "取消",
    confirm: "確定重置",

    encouragement: [
      "你做得超棒！🌟",
      "繼續加油！",
      "每個單字都算數！💪",
      "看看你多厲害！🚀",
      "進步神速！",
      "你正燃燒中！🔥",
      "好棒的努力！",
      "一個一個來！🌱"
    ],

    difficulty: "難度",
    easy: "簡單",
    medium: "中等",
    hard: "困難",

    back: "返回",
    next: "下一個",
    close: "關閉",
    yes: "是",
    no: "否",
    awesome: "太棒了！",
    greatJob: "做得好！",
    keepGoing: "繼續前進！",

    version: "版本",
    whatsNew: "新增內容",
    changelogTitle: "更新日誌",
    changelogEmpty: "暫無更新記錄。",
    closeChangelog: "關閉",

    exportData: "匯出資料",
    importData: "匯入資料",
    exportCSV: "匯出為 CSV",
    importCSV: "從 CSV 匯入",
    importSuccess: "匯入成功！",
    importError: "匯入失敗，檔案格式不正確。",
    importConfirm: "這會覆蓋你目前的進度，確定要繼續嗎？",
    exportFileName: "innowords-progress.csv",

    acronymTitle: "縮寫學習",
    acronymSubtitle: "innoblue 主人分享的英文縮寫",
    acronymFullName: "英文全名",
    acronymChinese: "中文意思",
    acronymMemoryTip: "簡單記法",
    acronymCategory: "分類",
    acronymEmpty: "暫無縮寫資料。"
  }
};

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.en;
}
