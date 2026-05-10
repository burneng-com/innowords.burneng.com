/* ========================================
   InnoWords - Main Application Logic
   All learning modes + gamification + i18n
   ======================================== */

import { vocabularyList, getDailyWords, getRandomWords, type VocabularyItem, type Difficulty } from '../data/vocabulary';
import { acronymsList, getRandomAcronyms, type AcronymItem } from '../data/acronyms';
import { getTranslation, type Language } from '../data/i18n';
import { changelog, bumpVersion, checkNewVersion, formatVersionDate, type ChangelogEntry } from '../data/changelog';
import { exportToCSV, importFromCSV, downloadFile, readFileAsText } from '../data/export-import';

const STORAGE_KEYS = {
  STATE: 'innowords_state_v1',
  THEME: 'innowords_theme',
  LANG: 'innowords_lang'
};

export interface AppState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  lastDailyDate: string;
  reviewLaterIds: number[];
  knownIds: number[];
  quizHighScore: number;
  totalSessions: number;
}

const defaultState: AppState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  lastDailyDate: '',
  reviewLaterIds: [],
  knownIds: [],
  quizHighScore: 0,
  totalSessions: 0
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATE);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

function saveState(s: AppState): void {
  try { localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(s)); } catch {}
}

function loadTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadLang(): Language {
  const saved = localStorage.getItem(STORAGE_KEYS.LANG);
  if (saved === 'en' || saved === 'zh') return saved;
  return 'zh';
}

function todayStr(): string {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function yesterdayStr(): string {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function xpForLevel(level: number): number { return level * 50; }

function checkLevelUp(s: AppState): boolean {
  let leveled = false;
  while (s.xp >= xpForLevel(s.level)) { s.xp -= xpForLevel(s.level); s.level += 1; leveled = true; }
  return leveled;
}

function awardXP(s: AppState, amount: number): { leveledUp: boolean } {
  s.xp += amount;
  return { leveledUp: checkLevelUp(s) };
}

function updateStreak(s: AppState): void {
  const today = todayStr();
  if (s.lastActiveDate === today) return;
  if (s.lastActiveDate === yesterdayStr()) s.streak += 1; else s.streak = 1;
  s.lastActiveDate = today;
}

function fireConfetti(): void {
  const colors = ['#FF6B9D', '#FF9F43', '#2ED573', '#1DD1A1', '#FECA57', '#A55EEA', '#4F6DFF'];
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

function showToast(message: string, type: 'success' | 'info' = 'success'): void {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 12px 20px; border-radius: 12px; color: white; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 1000; animation: fadeIn 0.3s ease;';
  toast.style.background = type === 'success' ? 'linear-gradient(135deg, #2ED573, #1DD1A1)' : 'linear-gradient(135deg, #4F6DFF, #A55EEA)';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Safe DOM helpers - avoid innerHTML for security
function el<K extends keyof HTMLElementTagNameMap>(tag: K, opts?: { className?: string; text?: string; html?: string; style?: string; attrs?: Record<string, string>; children?: (HTMLElement | Text | null)[] }): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (opts?.className) e.className = opts.className;
  if (opts?.text !== undefined) e.textContent = opts.text;
  if (opts?.style) e.setAttribute('style', opts.style);
  if (opts?.attrs) Object.entries(opts.attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (opts?.children) opts.children.forEach(c => { if (c) e.appendChild(c); });
  return e;
}

function clearChildren(node: HTMLElement) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function createBadge(type: 'level' | 'streak' | 'xp', value: string): HTMLElement {
  const icons: Record<string, string> = { level: '', streak: '🔥 ', xp: '⚡ ' };
  const classNames: Record<string, string> = { level: 'level-badge', streak: 'streak-badge', xp: 'xp-badge' };
  return el('span', { className: classNames[type], text: icons[type] + value });
}

function createProgressBar(percent: number, style?: string): HTMLElement {
  const bar = el('div', { className: 'progress-bar', style: style || '' });
  bar.appendChild(el('div', { className: 'progress-bar-fill', style: 'width:' + percent + '%' }));
  return bar;
}

function formatPronunciation(word: VocabularyItem): string {
  if (word.kkPronunciation && word.kkPronunciation.trim()) {
    return '[' + word.kkPronunciation + ']';
  }
  return '/' + word.pronunciationHint + '/';
}

function settingsIconSvg(): SVGElement {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '22'); svg.setAttribute('height', '22');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  const c = document.createElementNS(svgNS, 'circle');
  c.setAttribute('cx', '12'); c.setAttribute('cy', '12'); c.setAttribute('r', '3');
  svg.appendChild(c);
  const p = document.createElementNS(svgNS, 'path');
  p.setAttribute('d', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z');
  svg.appendChild(p);
  return svg;
}

function checkIconSvg(): SVGElement {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '20'); svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2.5');
  svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  const p = document.createElementNS(svgNS, 'path');
  p.setAttribute('d', 'M20 6L9 17l-5-5');
  svg.appendChild(p);
  return svg;
}

class InnoWordsApp {
  state: AppState;
  theme: 'light' | 'dark';
  lang: Language;
  currentTab: string = 'daily';

  flashcardIndex: number = 0;
  flashcardDeck: VocabularyItem[] = [];

  quizIndex: number = 0;
  quizDeck: VocabularyItem[] = [];
  quizScore: number = 0;
  quizTotal: number = 5;
  quizAnswered: boolean = false;

  matchPairs: { word: VocabularyItem; matched: boolean }[] = [];
  matchSelectedWord: number | null = null;
  matchSelectedMeaning: number | null = null;
  matchMeaningOrder: number[] = [];

  fillCurrent: VocabularyItem | null = null;
  fillOptions: string[] = [];
  fillAnswered: boolean = false;

  constructor() {
    this.state = loadState();
    this.theme = loadTheme();
    this.lang = loadLang();
    updateStreak(this.state);
    saveState(this.state);
  }

  t() { return getTranslation(this.lang); }

  init(): void {
    bumpVersion();
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.setAttribute('lang', this.lang === 'zh' ? 'zh-Hant' : 'en');
    const t = this.t();
    document.title = t.appName + ' - ' + t.appTagline;
    this.setupNavigation();
    this.setupSettings();
    this.renderHeader();
    this.switchTab('daily');
    this.showWhatsNew();
  }

  setupNavigation(): void {
    document.querySelectorAll<HTMLButtonElement>('.bottom-nav-item').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab!));
    });
    this.updateNavLabels();
  }

  updateNavLabels(): void {
    const t = this.t();
    const labels: Record<string, string> = { daily: t.navDaily, cards: t.navCards, quiz: t.navQuiz, match: t.navMatch, review: t.navReview };
    document.querySelectorAll<HTMLButtonElement>('.bottom-nav-item').forEach(btn => {
      const span = btn.querySelector('.nav-label');
      if (span) span.textContent = labels[btn.dataset.tab!] || '';
    });
  }

  setupSettings(): void {
    const settingsModal = document.getElementById('settings-modal')!;
    const closeBtn = document.getElementById('settings-close')!;
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    const langSelect = document.getElementById('lang-select') as HTMLSelectElement;
    const resetBtn = document.getElementById('reset-progress')!;

    closeBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });

    themeToggle.addEventListener('change', () => {
      this.theme = themeToggle.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.theme);
      localStorage.setItem(STORAGE_KEYS.THEME, this.theme);
    });

    langSelect.addEventListener('change', () => {
      this.lang = langSelect.value as Language;
      localStorage.setItem(STORAGE_KEYS.LANG, this.lang);
      document.documentElement.setAttribute('lang', this.lang === 'zh' ? 'zh-Hant' : 'en');
      const t = this.t();
      document.title = t.appName + ' - ' + t.appTagline;
      this.updateNavLabels();
      this.updateSettingsLabels();
      this.renderHeader();
      this.switchTab(this.currentTab);
    });

    resetBtn.addEventListener('click', () => {
      const t = this.t();
      if (confirm(t.resetConfirm)) {
        this.state = { ...defaultState };
        saveState(this.state);
        this.renderHeader();
        this.switchTab(this.currentTab);
        showToast(t.awesome, 'info');
      }
    });

    // Export button
    const exportBtn = document.getElementById('export-data') as HTMLButtonElement;
    if (exportBtn) exportBtn.addEventListener('click', () => this.handleExport());

    // Import button
    const importBtn = document.getElementById('import-data') as HTMLButtonElement;
    if (importBtn) importBtn.addEventListener('click', () => this.handleImport());

    // Changelog button
    const changelogBtn = document.getElementById('view-changelog') as HTMLButtonElement;
    if (changelogBtn) changelogBtn.addEventListener('click', () => {
      document.getElementById('settings-modal')!.classList.add('hidden');
      this.renderChangelog(document.getElementById('main-content')!);
    });

    this.updateSettingsLabels();
  }

  updateSettingsLabels(): void {
    const t = this.t();
    const setText = (id: string, text: string) => {
      const e = document.getElementById(id);
      if (e) e.textContent = text;
    };
    setText('settings-title', t.settings);
    setText('label-darkmode', t.darkMode);
    setText('label-language', t.language);
    setText('reset-progress', t.resetProgress);
    setText('export-data', t.exportCSV);
    setText('import-data', t.importCSV);
    setText('view-changelog', t.changelogTitle);

    const verEl = document.getElementById('app-version');
    if (verEl) verEl.textContent = t.version + ': ' + this.getVersion();
  }

  openSettings(): void {
    const modal = document.getElementById('settings-modal')!;
    modal.classList.remove('hidden');
    (document.getElementById('theme-toggle') as HTMLInputElement).checked = this.theme === 'dark';
    (document.getElementById('lang-select') as HTMLSelectElement).value = this.lang;
  }

  renderHeader(): void {
    const t = this.t();
    const header = document.getElementById('app-header')!;
    clearChildren(header);
    const levelXpMax = xpForLevel(this.state.level);
    const xpPercent = Math.min(100, (this.state.xp / levelXpMax) * 100);

    const topRow = el('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;' });
    const titleBox = el('div');
    const h1 = el('h1', { text: t.appName, style: 'font-size:1.4rem; background: linear-gradient(135deg, var(--color-primary), var(--color-accent-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;' });
    const tag = el('p', { text: t.appTagline, style: 'font-size:0.8rem; color: var(--color-text-light);' });
    titleBox.appendChild(h1); titleBox.appendChild(tag);

    const settingsBtn = el('button', { className: 'btn btn-ghost', style: 'padding:8px; min-height:auto;', attrs: { 'aria-label': t.settings } });
    settingsBtn.appendChild(settingsIconSvg());
    settingsBtn.addEventListener('click', () => this.openSettings());

    topRow.appendChild(titleBox); topRow.appendChild(settingsBtn);

    const badges = el('div', { style: 'display:flex; gap:8px; flex-wrap:wrap;' });
    badges.appendChild(createBadge('level', 'Lv.' + this.state.level));
    badges.appendChild(createBadge('streak', this.state.streak + ' ' + t.streakDays));
    badges.appendChild(createBadge('xp', this.state.xp + '/' + levelXpMax + ' ' + t.xp));

    const progressBar = createProgressBar(xpPercent, 'margin-top:10px;');

    header.appendChild(topRow);
    header.appendChild(badges);
    header.appendChild(progressBar);
  }

  switchTab(tab: string): void {
    this.currentTab = tab;
    document.querySelectorAll<HTMLButtonElement>('.bottom-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    const main = document.getElementById('main-content')!;
    clearChildren(main);
    main.classList.add('animate-fade-in');
    setTimeout(() => main.classList.remove('animate-fade-in'), 400);

    switch (tab) {
      case 'daily': this.renderDaily(main); break;
      case 'cards': this.renderFlashcards(main); break;
      case 'quiz': this.renderQuiz(main); break;
      case 'match': this.renderMatch(main); break;
      case 'review': this.renderReview(main); break;
    }
  }

  difficultyBg(d: Difficulty): string {
    if (d === 'easy') return 'var(--color-accent-green)';
    if (d === 'medium') return 'var(--color-accent-orange)';
    return 'var(--color-accent-pink)';
  }

  difficultyLabel(d: Difficulty): string {
    const t = this.t();
    if (d === 'easy') return t.easy;
    if (d === 'medium') return t.medium;
    return t.hard;
  }

  // ============== MODE 1: Daily Word Quest ==============
  renderDaily(container: HTMLElement): void {
    const t = this.t();
    const words = getDailyWords();
    const today = todayStr();
    const completed = this.state.lastDailyDate === today;

    const section = el('section', { style: 'padding: 20px;' });
    const titleBox = el('div', { style: 'margin-bottom:20px;' });
    titleBox.appendChild(el('h2', { text: t.dailyTitle }));
    titleBox.appendChild(el('p', { text: t.dailySubtitle }));
    section.appendChild(titleBox);

    this.renderDailyBanner(section, completed);

    const wordsContainer = el('div', { attrs: { id: 'daily-words' }, style: 'display:flex; flex-direction:column; gap:12px;' });
    words.forEach((word, idx) => {
      wordsContainer.appendChild(this.renderDailyWordCard(word, idx));
    });
    section.appendChild(wordsContainer);

    if (!completed) {
      const btn = el('button', { className: 'btn btn-primary w-full', text: '✓ ' + t.dailyComplete, style: 'margin-top:20px;' });
      btn.addEventListener('click', () => {
        this.state.lastDailyDate = today;
        const { leveledUp } = awardXP(this.state, 25);
        this.state.totalSessions += 1;
        saveState(this.state);
        fireConfetti();
        showToast('+25 ' + t.xp + '! ' + (leveledUp ? '🎊 Level Up!' : t.greatJob));
        this.renderHeader();
        setTimeout(() => this.switchTab('daily'), 800);
      });
      section.appendChild(btn);
    }

    container.appendChild(section);
  }

  private renderDailyBanner(container: HTMLElement, completed: boolean): void {
    if (!completed) return;
    const t = this.t();
    const banner = el('div', { className: 'card card-gradient text-center animate-pop-in', style: 'margin-bottom:16px;' });
    banner.appendChild(el('div', { text: '🎉', className: 'animate-float', style: 'font-size:3rem; margin-bottom:8px;' }));
    banner.appendChild(el('h3', { text: t.dailyCompleted }));
    banner.appendChild(el('p', { text: t.dailyResetTomorrow, style: 'color: rgba(255,255,255,0.9); margin-top:8px;' }));
    container.appendChild(banner);
  }

  private renderDailyWordCard(word: VocabularyItem, idx: number): HTMLElement {
    const card = el('div', { className: 'card animate-fade-in', style: 'animation-delay:' + (idx * 0.05) + 's' });
    const top = el('div', { style: 'display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;' });
    const left = el('div');
    left.appendChild(el('h3', { text: word.word, style: 'color: var(--color-primary);' }));
    left.appendChild(el('span', { text: '/' + word.pronunciationHint + '/ • ' + word.partOfSpeech, style: 'font-size:0.8rem; color: var(--color-text-light);' }));
    const diff = el('span', { text: this.difficultyLabel(word.difficulty), style: 'font-size:0.7rem; padding:4px 8px; border-radius:12px; color: white; font-weight:600; background:' + this.difficultyBg(word.difficulty) });
    top.appendChild(left); top.appendChild(diff);
    card.appendChild(top);
    card.appendChild(el('p', { text: word.chineseMeaning, style: 'color: var(--color-text); font-weight:600; margin-bottom:4px;' }));
    card.appendChild(el('p', { text: word.englishMeaning, style: 'font-size:0.9rem; color: var(--color-text-light); margin-bottom:8px;' }));
    card.appendChild(el('div', { text: '💬 ' + word.exampleSentence, style: 'background: rgba(79, 109, 255, 0.06); padding:10px; border-radius:8px; font-size:0.9rem; font-style:italic;' }));
    return card;
  }

  // ============== MODE 2: Flashcards ==============
  renderFlashcards(container: HTMLElement): void {
    const t = this.t();
    if (this.flashcardDeck.length === 0 || this.flashcardIndex >= this.flashcardDeck.length) {
      this.flashcardDeck = getRandomWords(10, this.state.knownIds);
      this.flashcardIndex = 0;
    }

    if (this.flashcardDeck.length === 0) {
      const section = el('section', { style: 'padding:20px;' });
      const card = el('div', { className: 'card text-center', style: 'padding: 40px 20px;' });
      card.appendChild(el('div', { text: '🌟', style: 'font-size:4rem; margin-bottom:16px;' }));
      card.appendChild(el('h2', { text: t.flashcardEmpty }));
      card.appendChild(el('p', { text: t.greatJob, style: 'margin-top:8px;' }));
      const btn = el('button', { className: 'btn btn-primary', text: t.startOver, style: 'margin-top:20px;' });
      btn.addEventListener('click', () => {
        this.state.knownIds = []; saveState(this.state);
        this.flashcardDeck = []; this.switchTab('cards');
      });
      card.appendChild(btn);
      section.appendChild(card);
      container.appendChild(section);
      return;
    }

    const word = this.flashcardDeck[this.flashcardIndex];
    const section = el('section', { style: 'padding:20px;' });
    const titleBox = el('div', { style: 'margin-bottom:16px;' });
    titleBox.appendChild(el('h2', { text: t.flashcardTitle }));
    titleBox.appendChild(el('p', { text: t.flashcardSubtitle }));
    section.appendChild(titleBox);

    const progressLabels = el('div', { style: 'display:flex; justify-content:space-between; font-size:0.85rem; color: var(--color-text-light); margin-bottom:8px;' });
    progressLabels.appendChild(el('span', { text: (this.flashcardIndex + 1) + ' / ' + this.flashcardDeck.length }));
    progressLabels.appendChild(el('span', { text: t.progress + ': ' + Math.round((this.flashcardIndex / this.flashcardDeck.length) * 100) + '%' }));
    section.appendChild(progressLabels);

    section.appendChild(createProgressBar((this.flashcardIndex / this.flashcardDeck.length) * 100, 'margin-bottom:20px;'));

    const flashcard = el('div', { className: 'flashcard', attrs: { id: 'flashcard' } });
    const inner = el('div', { className: 'flashcard-inner' });
    inner.appendChild(this.renderFlashcardFace(word, 'front'));
    inner.appendChild(this.renderFlashcardFace(word, 'back'));
    flashcard.appendChild(inner);
    flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
    section.appendChild(flashcard);

    section.appendChild(this.renderFlashcardControls(word));

    container.appendChild(section);
  }

  private renderFlashcardFace(word: VocabularyItem, side: 'front' | 'back'): HTMLElement {
    if (side === 'front') {
      const t = this.t();
      const front = el('div', { className: 'flashcard-front' });
      front.appendChild(el('span', { text: this.difficultyLabel(word.difficulty), style: 'font-size:0.8rem; padding:4px 12px; border-radius:12px; color: white; font-weight:600; margin-bottom:12px; background:' + this.difficultyBg(word.difficulty) }));
      front.appendChild(el('h2', { text: word.word, style: 'font-size:2rem; color: var(--color-primary); margin-bottom:8px;' }));
      front.appendChild(el('p', { text: formatPronunciation(word), style: 'font-size:0.9rem; color: var(--color-text-light);' }));
      front.appendChild(el('p', { text: word.partOfSpeech, style: 'font-size:0.85rem; color: var(--color-text-light); margin-top:4px;' }));
      front.appendChild(el('div', { text: '👆 ' + t.tapToFlip, style: 'margin-top:24px; font-size:0.85rem; color: var(--color-text-light);' }));
      return front;
    } else {
      const back = el('div', { className: 'flashcard-back' });
      back.appendChild(el('h2', { text: word.chineseMeaning, style: 'font-size:1.4rem; margin-bottom:12px;' }));
      back.appendChild(el('p', { text: word.englishMeaning, style: 'font-size:0.95rem; opacity:0.95; margin-bottom:12px; text-align:center;' }));
      back.appendChild(el('div', { text: '💬 ' + word.exampleSentence, style: 'font-size:0.9rem; font-style:italic; padding: 12px; background: rgba(255,255,255,0.15); border-radius: 8px; text-align:center;' }));
      return back;
    }
  }

  private renderFlashcardControls(word: VocabularyItem): HTMLElement {
    const t = this.t();
    const btnRow = el('div', { style: 'display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:20px;' });
    const knownBtn = el('button', { className: 'btn btn-success', text: t.iKnowIt });
    const reviewBtn = el('button', { className: 'btn btn-outline', text: t.reviewLater });
    knownBtn.addEventListener('click', () => {
      if (!this.state.knownIds.includes(word.id)) this.state.knownIds.push(word.id);
      this.state.reviewLaterIds = this.state.reviewLaterIds.filter(id => id !== word.id);
      const { leveledUp } = awardXP(this.state, 5);
      saveState(this.state);
      if (leveledUp) { fireConfetti(); showToast('Level ' + this.state.level + '! 🎊'); }
      this.flashcardIndex++; this.renderHeader(); this.switchTab('cards');
    });
    reviewBtn.addEventListener('click', () => {
      if (!this.state.reviewLaterIds.includes(word.id)) this.state.reviewLaterIds.push(word.id);
      awardXP(this.state, 2); saveState(this.state);
      this.flashcardIndex++; this.renderHeader(); this.switchTab('cards');
    });
    btnRow.appendChild(knownBtn); btnRow.appendChild(reviewBtn);
    return btnRow;
  }

  // ============== MODE 3: Multiple Choice Quiz ==============
  renderQuiz(container: HTMLElement): void {
    if (this.quizDeck.length === 0 || this.quizIndex >= this.quizTotal) {
      this.quizDeck = getRandomWords(this.quizTotal);
      this.quizIndex = 0; this.quizScore = 0; this.quizAnswered = false;
    }

    if (this.quizIndex >= this.quizTotal) {
      this.renderQuizResult(container);
      return;
    }

    const word = this.quizDeck[this.quizIndex];
    const wrongOptions = vocabularyList.filter(w => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.chineseMeaning);
    const allOptions = [...wrongOptions, word.chineseMeaning].sort(() => Math.random() - 0.5);

    this.renderQuizQuestion(container, word, allOptions);
  }

  private renderQuizQuestion(container: HTMLElement, word: VocabularyItem, allOptions: string[]): void {
    const t = this.t();
    const section = el('section', { style: 'padding:20px;' });
    const titleBox = el('div', { style: 'margin-bottom:16px;' });
    titleBox.appendChild(el('h2', { text: t.quizTitle }));
    titleBox.appendChild(el('p', { text: t.quizSubtitle }));
    section.appendChild(titleBox);

    const progressLabels = el('div', { style: 'display:flex; justify-content:space-between; font-size:0.85rem; color: var(--color-text-light); margin-bottom:8px;' });
    progressLabels.appendChild(el('span', { text: (this.quizIndex + 1) + ' / ' + this.quizTotal }));
    progressLabels.appendChild(el('span', { text: t.quizScore + ': ' + this.quizScore }));
    section.appendChild(progressLabels);

    section.appendChild(createProgressBar((this.quizIndex / this.quizTotal) * 100, 'margin-bottom:20px;'));

    const wordCard = el('div', { className: 'card text-center', style: 'padding: 32px 20px; margin-bottom:20px;' });
    wordCard.appendChild(el('p', { text: t.quizQuestion, style: 'font-size:0.85rem; color: var(--color-text-light); margin-bottom:8px;' }));
    wordCard.appendChild(el('h2', { text: word.word, style: 'font-size:2rem; color: var(--color-primary);' }));
    wordCard.appendChild(el('p', { text: '/' + word.pronunciationHint + '/ • ' + word.partOfSpeech, style: 'font-size:0.85rem; color: var(--color-text-light); margin-top:4px;' }));
    section.appendChild(wordCard);

    const optionsContainer = el('div', { style: 'display:flex; flex-direction:column; gap:10px;' });
    const feedbackEl = el('div', { className: 'hidden', style: 'margin-top:16px; text-align:center; padding:12px; border-radius:8px;' });
    const nextBtn = el('button', { className: 'btn btn-primary w-full hidden', text: t.nextQuestion, style: 'margin-top:16px;' });
    nextBtn.addEventListener('click', () => {
      this.quizIndex++; this.quizAnswered = false; this.switchTab('quiz');
    });

    allOptions.forEach((option) => {
      const btn = el('button', { className: 'choice-btn', text: option });
      btn.addEventListener('click', () => {
        if (this.quizAnswered) return;
        this.quizAnswered = true;
        const correct = option === word.chineseMeaning;

        optionsContainer.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
          if (b.textContent === word.chineseMeaning) b.classList.add('correct');
          else if (b === btn && !correct) b.classList.add('wrong');
        });

        feedbackEl.classList.remove('hidden');
        if (correct) {
          this.quizScore++; awardXP(this.state, 10);
          feedbackEl.style.background = 'var(--color-bg-correct)';
          feedbackEl.style.color = 'var(--color-accent-green)';
          feedbackEl.textContent = '✓ ' + t.quizCorrect;
        } else {
          awardXP(this.state, 1);
          feedbackEl.style.background = 'var(--color-bg-wrong)';
          feedbackEl.style.color = '#E74C3C';
          feedbackEl.textContent = '✗ ' + t.quizWrong + ' ' + word.word + ' = ' + word.chineseMeaning;
          btn.classList.add('animate-shake');
        }
        saveState(this.state);
        this.renderHeader();
        nextBtn.classList.remove('hidden');
      });
      optionsContainer.appendChild(btn);
    });

    section.appendChild(optionsContainer);
    section.appendChild(feedbackEl);
    section.appendChild(nextBtn);
    container.appendChild(section);
  }

  private renderQuizResult(container: HTMLElement): void {
    const t = this.t();
    const isHigh = this.quizScore > this.state.quizHighScore;
    if (isHigh) this.state.quizHighScore = this.quizScore;
    saveState(this.state);

    const section = el('section', { style: 'padding:20px;' });
    const card = el('div', { className: 'card card-gradient text-center animate-pop-in' });
    const emoji = this.quizScore === this.quizTotal ? '🏆' : this.quizScore >= 3 ? '🌟' : '💪';
    card.appendChild(el('div', { text: emoji, className: 'animate-float', style: 'font-size:4rem; margin-bottom:12px;' }));
    card.appendChild(el('h2', { text: t.quizComplete }));
    card.appendChild(el('p', { text: this.quizScore + ' / ' + this.quizTotal, style: 'color: rgba(255,255,255,0.95); font-size:1.4rem; font-weight:700; margin:12px 0;' }));
    if (isHigh) card.appendChild(el('p', { text: '🎉 New high score!', style: 'color: rgba(255,255,255,0.9);' }));
    section.appendChild(card);

    const restartBtn = el('button', { className: 'btn btn-primary w-full', text: t.playAgain, style: 'margin-top:20px;' });
    restartBtn.addEventListener('click', () => { this.quizDeck = []; this.switchTab('quiz'); });
    section.appendChild(restartBtn);

    if (this.quizScore === this.quizTotal) fireConfetti();
    container.appendChild(section);
  }

  // ============== MODE 4: Word Match ==============
  renderMatch(container: HTMLElement): void {
    const t = this.t();

    if (this.matchPairs.length === 0 || this.matchPairs.every(p => p.matched)) {
      const words = getRandomWords(5);
      this.matchPairs = words.map(w => ({ word: w, matched: false }));
      this.matchMeaningOrder = words.map((_, i) => i).sort(() => Math.random() - 0.5);
      this.matchSelectedWord = null; this.matchSelectedMeaning = null;
    }

    const matchedCount = this.matchPairs.filter(p => p.matched).length;

    const section = el('section', { style: 'padding:20px;' });
    const titleBox = el('div', { style: 'margin-bottom:16px;' });
    titleBox.appendChild(el('h2', { text: t.matchTitle }));
    titleBox.appendChild(el('p', { text: t.matchSubtitle }));
    section.appendChild(titleBox);

    section.appendChild(el('div', { style: 'display:flex; justify-content:space-between; font-size:0.85rem; color: var(--color-text-light); margin-bottom:12px;', children: [el('span', { text: t.matchProgress + ': ' + matchedCount + ' / ' + this.matchPairs.length })] }));
    section.appendChild(createProgressBar((matchedCount / this.matchPairs.length) * 100, 'margin-bottom:20px;'));

    const grid = el('div', { style: 'display:grid; grid-template-columns: 1fr 1fr; gap:10px;' });
    const wordsCol = el('div', { style: 'display:flex; flex-direction:column; gap:10px;' });
    const meaningsCol = el('div', { style: 'display:flex; flex-direction:column; gap:10px;' });

    this.matchPairs.forEach((pair, i) => {
      const wordCard = el('div', { className: 'match-card', text: pair.word.word });
      if (pair.matched) wordCard.classList.add('matched');
      else if (this.matchSelectedWord === i) wordCard.classList.add('selected');
      wordCard.addEventListener('click', () => this.handleMatchClick('word', i));
      wordsCol.appendChild(wordCard);
    });

    this.matchMeaningOrder.forEach((origIdx) => {
      const pair = this.matchPairs[origIdx];
      const meaningCard = el('div', { className: 'match-card', text: pair.word.chineseMeaning });
      if (pair.matched) meaningCard.classList.add('matched');
      else if (this.matchSelectedMeaning === origIdx) meaningCard.classList.add('selected');
      meaningCard.addEventListener('click', () => this.handleMatchClick('meaning', origIdx));
      meaningsCol.appendChild(meaningCard);
    });

    grid.appendChild(wordsCol); grid.appendChild(meaningsCol);
    section.appendChild(grid);

    if (matchedCount === this.matchPairs.length) {
      const card = el('div', { className: 'card card-gradient text-center animate-pop-in', style: 'margin-top:20px;' });
      card.appendChild(el('div', { text: '🎊', className: 'animate-float', style: 'font-size:3rem;' }));
      card.appendChild(el('h3', { text: t.matchAllDone }));
      section.appendChild(card);
      const restartBtn = el('button', { className: 'btn btn-primary w-full', text: t.newRound, style: 'margin-top:16px;' });
      restartBtn.addEventListener('click', () => { this.matchPairs = []; this.switchTab('match'); });
      section.appendChild(restartBtn);
      fireConfetti();
    }

    container.appendChild(section);
  }

  handleMatchClick(type: 'word' | 'meaning', idx: number): void {
    if (this.matchPairs[idx].matched) return;

    if (type === 'word') {
      this.matchSelectedWord = this.matchSelectedWord === idx ? null : idx;
    } else {
      this.matchSelectedMeaning = this.matchSelectedMeaning === idx ? null : idx;
    }

    if (this.matchSelectedWord !== null && this.matchSelectedMeaning !== null) {
      const t = this.t();
      if (this.matchSelectedWord === this.matchSelectedMeaning) {
        this.matchPairs[this.matchSelectedWord].matched = true;
        awardXP(this.state, 8); saveState(this.state);
        showToast('✓ ' + t.matchSuccess + ' +8 ' + t.xp);
        this.renderHeader();
      } else {
        const main = document.getElementById('main-content')!;
        main.classList.add('animate-shake');
        setTimeout(() => main.classList.remove('animate-shake'), 500);
      }
      this.matchSelectedWord = null; this.matchSelectedMeaning = null;
      setTimeout(() => this.switchTab('match'), 200);
    } else {
      this.switchTab('match');
    }
  }

  // ============== MODE 5: Review + Fill in Blank ==============
  renderReview(container: HTMLElement): void {
    const t = this.t();
    const reviewWords = vocabularyList.filter(w => this.state.reviewLaterIds.includes(w.id));

    const section = el('section', { style: 'padding:20px;' });
    const titleBox = el('div', { style: 'margin-bottom:16px;' });
    titleBox.appendChild(el('h2', { text: t.reviewTitle }));
    titleBox.appendChild(el('p', { text: reviewWords.length > 0 ? t.reviewSubtitle + ' (' + reviewWords.length + ')' : t.reviewSubtitle }));
    section.appendChild(titleBox);

    if (reviewWords.length === 0) {
      const empty = el('div', { className: 'card text-center', style: 'padding:40px 20px;' });
      empty.appendChild(el('div', { text: '📚', style: 'font-size:4rem; margin-bottom:16px;' }));
      empty.appendChild(el('h3', { text: t.reviewEmpty }));
      empty.appendChild(el('p', { text: t.reviewEmptyHint, style: 'margin-top:8px;' }));
      section.appendChild(empty);
    } else {
      const list = el('div', { style: 'display:flex; flex-direction:column; gap:12px;' });
      reviewWords.forEach((word, idx) => {
        const card = el('div', { className: 'card animate-fade-in', style: 'animation-delay:' + (idx * 0.04) + 's' });
        const row = el('div', { style: 'display:flex; justify-content:space-between; align-items:flex-start;' });
        const left = el('div', { style: 'flex:1;' });
        left.appendChild(el('h3', { text: word.word, style: 'color: var(--color-primary); margin-bottom:4px;' }));
        left.appendChild(el('p', { text: '/' + word.pronunciationHint + '/ • ' + word.partOfSpeech, style: 'font-size:0.8rem; color: var(--color-text-light); margin-bottom:6px;' }));
        left.appendChild(el('p', { text: word.chineseMeaning, style: 'font-weight:600; margin-bottom:4px;' }));
        left.appendChild(el('p', { text: word.englishMeaning, style: 'font-size:0.85rem; color: var(--color-text-light); margin-bottom:8px;' }));
        left.appendChild(el('div', { text: '💬 ' + word.exampleSentence, style: 'background: rgba(79, 109, 255, 0.06); padding:8px 10px; border-radius:6px; font-size:0.85rem; font-style:italic;' }));

        const removeBtn = el('button', { className: 'btn btn-ghost', style: 'padding:6px; min-height:auto; color: var(--color-accent-green);', attrs: { 'aria-label': t.removeFromReview } });
        removeBtn.appendChild(checkIconSvg());
        removeBtn.addEventListener('click', () => {
          this.state.reviewLaterIds = this.state.reviewLaterIds.filter(rid => rid !== word.id);
          if (!this.state.knownIds.includes(word.id)) this.state.knownIds.push(word.id);
          awardXP(this.state, 5); saveState(this.state);
          this.renderHeader(); this.switchTab('review');
        });
        row.appendChild(left); row.appendChild(removeBtn);
        card.appendChild(row);
        list.appendChild(card);
      });
      section.appendChild(list);
    }

    // Fill-in-blank section
    section.appendChild(this.buildFillInBlank());

    // Acronyms section
    this.renderAcronyms(container);

    container.appendChild(section);
  }

  buildFillInBlank(): HTMLElement {
    const t = this.t();
    if (!this.fillCurrent) {
      const candidate = getRandomWords(1)[0];
      this.fillCurrent = candidate;
      const wrongs = vocabularyList.filter(w => w.id !== candidate.id).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
      this.fillOptions = [...wrongs, candidate.word].sort(() => Math.random() - 0.5);
      this.fillAnswered = false;
    }

    const word = this.fillCurrent!;
    const wrap = el('div', { style: 'margin-top:24px;' });
    wrap.appendChild(el('h3', { text: '✍️ ' + t.fillTitle, style: 'margin-bottom:8px;' }));
    wrap.appendChild(el('p', { text: t.fillSubtitle, style: 'font-size:0.85rem; color: var(--color-text-light); margin-bottom:12px;' }));

    const card = el('div', { className: 'card', style: 'margin-bottom:12px;' });
    // Build sentence with blank
    const sentence = el('p', { style: 'font-size:1.05rem; line-height:1.8; margin-bottom:12px;' });
    const re = new RegExp('\\b' + word.word + '\\b', 'i');
    const match = word.exampleSentence.match(re);
    if (match) {
      const before = word.exampleSentence.slice(0, match.index!);
      const after = word.exampleSentence.slice(match.index! + match[0].length);
      sentence.appendChild(document.createTextNode(before));
      const blank = el('span', { text: '_____', style: 'display:inline-block; min-width: 80px; border-bottom: 2px dashed var(--color-primary); padding: 0 8px; color: var(--color-primary); font-weight: 700;' });
      blank.id = 'fill-blank';
      sentence.appendChild(blank);
      sentence.appendChild(document.createTextNode(after));
    } else {
      sentence.textContent = word.exampleSentence;
    }
    card.appendChild(sentence);

    const hint = el('p', { className: 'hidden', text: '💡 ' + word.chineseMeaning + ' (/' + word.pronunciationHint + '/)', style: 'font-size:0.85rem; color: var(--color-text-light); font-style: italic;', attrs: { id: 'fill-hint' } });
    card.appendChild(hint);
    wrap.appendChild(card);

    const optionsContainer = el('div', { style: 'display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:10px;' });
    this.fillOptions.forEach(option => {
      const btn = el('button', { className: 'choice-btn', text: option, style: 'text-align:center;' });
      btn.addEventListener('click', () => {
        if (this.fillAnswered) return;
        this.fillAnswered = true;
        const correct = option.toLowerCase() === word.word.toLowerCase();
        const blank = wrap.querySelector('#fill-blank') as HTMLElement | null;

        optionsContainer.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
          if (b.textContent && b.textContent.toLowerCase() === word.word.toLowerCase()) b.classList.add('correct');
          else if (b === btn && !correct) b.classList.add('wrong');
        });

        if (blank) {
          blank.textContent = word.word;
          if (correct) {
            blank.style.borderBottom = '2px solid var(--color-accent-green)';
            blank.style.color = 'var(--color-accent-green)';
          } else {
            blank.style.color = 'var(--color-accent-pink)';
          }
        }

        if (correct) { awardXP(this.state, 8); showToast('✓ ' + t.quizCorrect + ' +8 ' + t.xp); }
        else { awardXP(this.state, 1); btn.classList.add('animate-shake'); }
        saveState(this.state); this.renderHeader();
      });
      optionsContainer.appendChild(btn);
    });
    wrap.appendChild(optionsContainer);

    const btnRow = el('div', { style: 'display:flex; gap:8px;' });
    const hintBtn = el('button', { className: 'btn btn-outline', text: '💡 ' + t.fillHint, style: 'flex:1;' });
    hintBtn.addEventListener('click', () => hint.classList.toggle('hidden'));
    const nextBtn = el('button', { className: 'btn btn-primary', text: t.fillNext, style: 'flex:1;' });
    nextBtn.addEventListener('click', () => { this.fillCurrent = null; this.switchTab(this.currentTab); });
    btnRow.appendChild(hintBtn); btnRow.appendChild(nextBtn);
    wrap.appendChild(btnRow);

    return wrap;
  }

  // ============== Version System ==============
  getVersion(): string {
    const saved = localStorage.getItem('innowords_version');
    return saved || changelog[0].version;
  }

  showVersionBadge(): HTMLElement {
    const version = this.getVersion();
    return el('div', {
      text: this.t().version + ': ' + version,
      style: 'font-size:0.75rem; color: var(--color-text-light); text-align:center; margin-top:12px; padding-top:12px; border-top:1px solid var(--color-border);'
    });
  }

  showWhatsNew(): void {
    const check = checkNewVersion();
    if (!check.isNew) return;
    const t = this.t();
    const modal = document.getElementById('settings-modal')!;
    modal.classList.remove('hidden');
    setTimeout(() => this.renderChangelog(document.getElementById('main-content')!), 100);
  }

  // ============== Export / Import ==============
  handleExport(): void {
    const t = this.t();
    const csv = exportToCSV(this.state);
    const filename = t.exportFileName;
    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
    showToast(t.exportCSV + ' ✓', 'info');
  }

  handleImport(): void {
    const t = this.t();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await readFileAsText(file);
        const { state, errors } = importFromCSV(text);
        if (!state) {
          showToast(t.importError + ': ' + errors.join(', '), 'info');
          return;
        }
        if (confirm(t.importConfirm)) {
          this.state = { ...this.state, ...state };
          saveState(this.state);
          this.renderHeader();
          this.switchTab(this.currentTab);
          showToast(t.importSuccess, 'success');
        }
      } catch {
        showToast(t.importError, 'info');
      }
    });
    input.click();
  }


  // ============== Acronym Learning ==============
  renderAcronyms(container: HTMLElement): void {
    const t = this.t();
    const acronyms = getRandomAcronyms(acronymsList.length);

    const section = el('section', { style: 'padding:20px;' });
    const titleBox = el('div', { style: 'margin-bottom:16px;' });
    titleBox.appendChild(el('h2', { text: '📌 ' + t.acronymTitle }));
    titleBox.appendChild(el('p', { text: t.acronymSubtitle, style: 'font-size:0.9rem; color: var(--color-text-light);' }));
    section.appendChild(titleBox);

    if (acronyms.length === 0) {
      section.appendChild(el('p', { text: t.acronymEmpty, style: 'text-align:center; color: var(--color-text-light); padding:40px;' }));
    } else {
      acronyms.forEach((a, idx) => {
        const card = el('div', { className: 'card animate-fade-in', style: 'margin-bottom:12px; animation-delay:' + (idx * 0.05) + 's;' });

        const top = el('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;' });
        top.appendChild(el('span', { text: a.acronym, style: 'font-size:1.4rem; font-weight:800; color: var(--color-primary);' }));
        top.appendChild(el('span', { text: a.category, style: 'font-size:0.7rem; padding:3px 10px; border-radius:12px; background: var(--color-accent-teal); color: white; font-weight:600;' }));
        card.appendChild(top);

        card.appendChild(el('p', { text: a.fullName, style: 'font-weight:600; font-size:1rem; margin-bottom:4px;' }));
        card.appendChild(el('p', { text: a.chineseMeaning, style: 'color: var(--color-text); font-weight:600; margin-bottom:8px;' }));

        const tipBox = el('div', { style: 'background: rgba(79, 109, 255, 0.06); padding:10px; border-radius:8px; font-size:0.9rem; color: var(--color-text-light);' });
        tipBox.appendChild(el('span', { text: '💡 ' + t.acronymMemoryTip + ': ', style: 'font-weight:600; color: var(--color-primary);' }));
        tipBox.appendChild(document.createTextNode(a.memoryTip));
        card.appendChild(tipBox);

        section.appendChild(card);
      });
    }

    container.appendChild(section);
  }

  // ============== Changelog ==============
  renderChangelog(container: HTMLElement): void {
    const t = this.t();
    const version = this.getVersion();

    container.innerHTML = '';
    const section = el('section', { style: 'padding:20px;' });

    const header = el('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;' });
    header.appendChild(el('h2', { text: t.changelogTitle }));
    const closeBtn = el('button', { className: 'btn btn-ghost', style: 'padding:4px; min-height:auto;', text: '✕' });
    closeBtn.addEventListener('click', () => this.switchTab(this.currentTab));
    header.appendChild(closeBtn);
    section.appendChild(header);

    if (changelog.length === 0) {
      section.appendChild(el('p', { text: t.changelogEmpty, style: 'text-align:center; color: var(--color-text-light); padding:40px;' }));
    } else {
      changelog.forEach((entry, idx) => {
        const isCurrent = entry.version === version;
        const card = el('div', {
          className: 'card animate-fade-in',
          style: 'margin-bottom:12px; ' + (isCurrent ? 'border: 2px solid var(--color-primary);' : '')
        });
        card.style.animationDelay = (idx * 0.05) + 's';

        const top = el('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;' });
        top.appendChild(el('span', {
          text: entry.version,
          style: 'font-weight:700; color: var(--color-primary); font-size:0.95rem;'
        }));
        top.appendChild(el('span', {
          text: formatVersionDate(entry.date),
          style: 'font-size:0.8rem; color: var(--color-text-light);'
        }));
        if (isCurrent) {
          top.appendChild(el('span', {
            text: t.whatsNew,
            style: 'font-size:0.7rem; padding:2px 8px; border-radius:10px; background: var(--color-primary); color: white; font-weight:600;'
          }));
        }
        card.appendChild(top);

        const changes = this.lang === 'zh' ? entry.changes.zh : entry.changes.en;
        const ul = el('ul', { style: 'padding-left:16px; font-size:0.9rem; color: var(--color-text-light);' });
        changes.forEach(c => {
          const li = el('li', { text: c, style: 'margin-bottom:4px;' });
          ul.appendChild(li);
        });
        card.appendChild(ul);
        section.appendChild(card);
      });
    }

    container.appendChild(section);
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const app = new InnoWordsApp();
  app.init();
  (window as any).innoApp = app;
});
