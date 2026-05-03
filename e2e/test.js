/**
 * InnoWords E2E Test Suite
 * Run with: node e2e/test.js
 */

// Mock localStorage for Node.js
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; },
};

const results = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    results.push({ name, status: 'PASS' });
    passed++;
  } catch (e) {
    results.push({ name, status: 'FAIL', error: e.message });
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// Test 1: Build output exists
function testBuildOutput() {
  const fs = require('fs');
  const path = require('path');
  const distPath = path.join(__dirname, '..', 'dist');

  assert(fs.existsSync(distPath), 'dist/ directory should exist');
  assert(fs.existsSync(path.join(distPath, 'index.html')), 'dist/index.html should exist');

  const html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
  assert(html.includes('InnoWords'), 'HTML should contain "InnoWords"');
  assert(html.includes('app-header'), 'HTML should contain app-header');
  assert(html.includes('main-content'), 'HTML should contain main-content');
  assert(html.includes('bottom-nav'), 'HTML should contain bottom-nav');
  assert(html.includes('settings-modal'), 'HTML should contain settings-modal');
  assert(html.includes('_astro/'), 'HTML should reference bundled JS');
}

// Test 2: Vocabulary data integrity
function testVocabularyData() {
  const { vocabularyList } = require('../src/data/vocabulary');
  assert(vocabularyList.length >= 50, `Should have at least 50 words, got ${vocabularyList.length}`);

  vocabularyList.forEach((w, i) => {
    assert(w.id, `Word ${i} missing id`);
    assert(w.word, `Word ${i} missing word`);
    assert(w.chineseMeaning, `Word ${i} missing chineseMeaning`);
    assert(w.englishMeaning, `Word ${i} missing englishMeaning`);
    assert(w.exampleSentence, `Word ${i} missing exampleSentence`);
    assert(w.pronunciationHint, `Word ${i} missing pronunciationHint`);
    assert(['easy', 'medium', 'hard'].includes(w.difficulty), `Word ${i} has invalid difficulty`);
  });
}

// Test 3: i18n translations completeness
function testI18nCompleteness() {
  const { translations } = require('../src/data/i18n');
  const en = translations.en;
  const zh = translations.zh;

  const enKeys = Object.keys(en).filter(k => typeof en[k] === 'string');
  const zhKeys = Object.keys(zh).filter(k => typeof zh[k] === 'string');

  enKeys.forEach(key => {
    assert(zh[key] !== undefined, `Missing zh translation for: ${key}`);
  });

  zhKeys.forEach(key => {
    assert(en[key] !== undefined, `Missing en translation for: ${key}`);
  });
}

// Test 4: Daily words determinism
function testDailyWordsDeterminism() {
  const { getDailyWords } = require('../src/data/vocabulary');
  const d1 = new Date(2026, 4, 3);
  const words1 = getDailyWords(d1);
  const words2 = getDailyWords(d1);

  assert(words1.length === 5, 'Daily words should return 5 words');
  assert(words1.map(w => w.id).join(',') === words2.map(w => w.id).join(','), 'Daily words should be deterministic for same date');
}

// Test 5: Changelog data
function testChangelog() {
  const { changelog } = require('../src/data/changelog');
  assert(changelog.length > 0, 'Changelog should have at least one entry');

  changelog.forEach((entry, i) => {
    assert(entry.version, `Changelog entry ${i} missing version`);
    assert(entry.date, `Changelog entry ${i} missing date`);
    assert(entry.changes.en.length > 0, `Changelog entry ${i} missing en changes`);
    assert(entry.changes.zh.length > 0, `Changelog entry ${i} missing zh changes`);
  });
}

// Test 6: Version utilities
function testVersionUtilities() {
  const { bumpVersion, getCurrentVersion } = require('../src/data/changelog');
  const original = localStorage.getItem('innowords_version');

  localStorage.removeItem('innowords_version');
  const v1 = getCurrentVersion();
  assert(v1.startsWith('v'), `Version should start with v, got ${v1}`);

  const v2 = bumpVersion();
  assert(v2.startsWith('v'), `Bumped version should start with v, got ${v2}`);

  if (original) localStorage.setItem('innowords_version', original);
}

// Test 7: CSV export/import
function testCSVExportImport() {
  const { exportToCSV, importFromCSV } = require('../src/data/export-import');

  const mockState = {
    xp: 100,
    level: 3,
    streak: 5,
    lastActiveDate: '2026-05-03',
    lastDailyDate: '2026-05-03',
    reviewLaterIds: [1, 2, 3],
    knownIds: [4, 5],
    quizHighScore: 4,
    totalSessions: 10
  };

  const csv = exportToCSV(mockState);
  assert(csv.includes('XP,100'), 'CSV should contain XP');
  assert(csv.includes('Level,3'), 'CSV should contain Level');

  const imported = importFromCSV(csv);
  assert(imported, 'Import should return data');
  assert(imported.xp === 100, `Imported XP should be 100, got ${imported.xp}`);
  assert(imported.level === 3, `Imported Level should be 3, got ${imported.level}`);
}

// Run tests
console.log('\n🧪 InnoWords E2E Test Suite\n');

test('Build output exists and contains expected elements', testBuildOutput);
test('Vocabulary data has 50+ words with all required fields', testVocabularyData);
test('i18n translations are complete (en ↔ zh)', testI18nCompleteness);
test('Daily words are deterministic for same date', testDailyWordsDeterminism);
test('Changelog has valid entries', testChangelog);
test('Version bump utility works correctly', testVersionUtilities);
test('CSV export/import round-trip works', testCSVExportImport);

console.log('\n' + '─'.repeat(60));
results.forEach(r => {
  const icon = r.status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${r.name}`);
  if (r.error) console.log(`   Error: ${r.error}`);
});
console.log('─'.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${results.length} total\n`);

process.exit(failed > 0 ? 1 : 0);
