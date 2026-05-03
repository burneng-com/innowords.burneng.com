export interface VocabularyItem {
  id: number;
  word: string;
  partOfSpeech: string;
  chineseMeaning: string;
  englishMeaning: string;
  exampleSentence: string;
  pronunciationHint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const vocabularyList: VocabularyItem[] = [
  {
    id: 1,
    word: "improve",
    partOfSpeech: "verb",
    chineseMeaning: "改善；進步",
    englishMeaning: "to make something better",
    exampleSentence: "I want to improve my English vocabulary every day.",
    pronunciationHint: "im-PROOV",
    difficulty: "easy"
  },
  {
    id: 2,
    word: "achieve",
    partOfSpeech: "verb",
    chineseMeaning: "達成；實現",
    englishMeaning: "to successfully complete a goal",
    exampleSentence: "With hard work, you can achieve anything you set your mind to.",
    pronunciationHint: "uh-CHEEV",
    difficulty: "easy"
  },
  {
    id: 3,
    word: "challenge",
    partOfSpeech: "noun",
    chineseMeaning: "挑戰",
    englishMeaning: "something difficult that tests your ability",
    exampleSentence: "Learning a new language is a fun challenge.",
    pronunciationHint: "CHAL-linj",
    difficulty: "easy"
  },
  {
    id: 4,
    word: "confident",
    partOfSpeech: "adjective",
    chineseMeaning: "有信心的",
    englishMeaning: "feeling sure about your abilities",
    exampleSentence: "She felt confident after practicing her presentation.",
    pronunciationHint: "KON-fi-dent",
    difficulty: "easy"
  },
  {
    id: 5,
    word: "determined",
    partOfSpeech: "adjective",
    chineseMeaning: "堅定的；下定決心的",
    englishMeaning: "having made a firm decision and not willing to change it",
    exampleSentence: "He was determined to finish the marathon.",
    pronunciationHint: "di-TER-mind",
    difficulty: "easy"
  },
  {
    id: 6,
    word: "encourage",
    partOfSpeech: "verb",
    chineseMeaning: "鼓勵",
    englishMeaning: "to give support, confidence, or hope to someone",
    exampleSentence: "My teacher always encourages me to speak more English.",
    pronunciationHint: "in-KUR-ij",
    difficulty: "easy"
  },
  {
    id: 7,
    word: "experience",
    partOfSpeech: "noun",
    chineseMeaning: "經驗；經歷",
    englishMeaning: "knowledge or skill gained over time",
    exampleSentence: "Traveling abroad was an amazing experience.",
    pronunciationHint: "ik-SPEER-ee-uns",
    difficulty: "easy"
  },
  {
    id: 8,
    word: "opportunity",
    partOfSpeech: "noun",
    chineseMeaning: "機會",
    englishMeaning: "a chance to do something",
    exampleSentence: "This job is a great opportunity for my career.",
    pronunciationHint: "op-er-TOO-ni-tee",
    difficulty: "medium"
  },
  {
    id: 9,
    word: "practice",
    partOfSpeech: "verb",
    chineseMeaning: "練習",
    englishMeaning: "to do something repeatedly to get better at it",
    exampleSentence: "Practice makes perfect!",
    pronunciationHint: "PRAK-tis",
    difficulty: "easy"
  },
  {
    id: 10,
    word: "progress",
    partOfSpeech: "noun",
    chineseMeaning: "進步",
    englishMeaning: "forward movement toward a goal",
    exampleSentence: "I can see your progress in English!",
    pronunciationHint: "PROH-gres",
    difficulty: "easy"
  },
  {
    id: 11,
    word: "remarkable",
    partOfSpeech: "adjective",
    chineseMeaning: "非凡的；顯著的",
    englishMeaning: "worthy of attention; impressive",
    exampleSentence: "Her progress in English is truly remarkable.",
    pronunciationHint: "ri-MAR-kuh-bul",
    difficulty: "medium"
  },
  {
    id: 12,
    word: "struggle",
    partOfSpeech: "verb",
    chineseMeaning: "掙扎；努力",
    englishMeaning: "to try very hard to do something difficult",
    exampleSentence: "Don't worry if you struggle at first; keep trying!",
    pronunciationHint: "STRUG-ul",
    difficulty: "easy"
  },
  {
    id: 13,
    word: "accomplish",
    partOfSpeech: "verb",
    chineseMeaning: "完成；達成",
    englishMeaning: "to succeed in doing something",
    exampleSentence: "I feel great when I accomplish my daily goals.",
    pronunciationHint: "uh-KOM-plish",
    difficulty: "medium"
  },
  {
    id: 14,
    word: "ambitious",
    partOfSpeech: "adjective",
    chineseMeaning: "有野心的；雄心勃勃的",
    englishMeaning: "having a strong desire to be successful",
    exampleSentence: "She has ambitious plans for her future.",
    pronunciationHint: "am-BISH-us",
    difficulty: "medium"
  },
  {
    id: 15,
    word: "benefit",
    partOfSpeech: "noun",
    chineseMeaning: "好處；益處",
    englishMeaning: "an advantage or good result from something",
    exampleSentence: "Reading every day has many benefits for your brain.",
    pronunciationHint: "BEN-e-fit",
    difficulty: "easy"
  },
  {
    id: 16,
    word: "commitment",
    partOfSpeech: "noun",
    chineseMeaning: "承諾；投入",
    englishMeaning: "a promise to do something or stay dedicated",
    exampleSentence: "Learning a language requires daily commitment.",
    pronunciationHint: "kuh-MIT-ment",
    difficulty: "medium"
  },
  {
    id: 17,
    word: "curious",
    partOfSpeech: "adjective",
    chineseMeaning: "好奇的",
    englishMeaning: "wanting to know or learn about something",
    exampleSentence: "I'm curious about how native speakers use this word.",
    pronunciationHint: "KYOOR-ee-us",
    difficulty: "easy"
  },
  {
    id: 18,
    word: "discipline",
    partOfSpeech: "noun",
    chineseMeaning: "紀律；自律",
    englishMeaning: "the ability to control yourself and work hard",
    exampleSentence: "Discipline is key to mastering any skill.",
    pronunciationHint: "DIS-uh-plin",
    difficulty: "medium"
  },
  {
    id: 19,
    word: "efficient",
    partOfSpeech: "adjective",
    chineseMeaning: "有效率的",
    englishMeaning: "working well without wasting time or energy",
    exampleSentence: "Using flashcards is an efficient way to learn vocabulary.",
    pronunciationHint: "i-FISH-ent",
    difficulty: "medium"
  },
  {
    id: 20,
    word: "focus",
    partOfSpeech: "verb",
    chineseMeaning: "專注",
    englishMeaning: "to direct your attention to one thing",
    exampleSentence: "Focus on one task at a time for better results.",
    pronunciationHint: "FOH-kus",
    difficulty: "easy"
  },
  {
    id: 21,
    word: "grateful",
    partOfSpeech: "adjective",
    chineseMeaning: "感激的",
    englishMeaning: "feeling thankful for something",
    exampleSentence: "I'm grateful for the opportunity to learn English.",
    pronunciationHint: "GRAYT-ful",
    difficulty: "easy"
  },
  {
    id: 22,
    word: "habit",
    partOfSpeech: "noun",
    chineseMeaning: "習慣",
    englishMeaning: "something you do regularly, often without thinking",
    exampleSentence: "Studying for 15 minutes daily is a great habit.",
    pronunciationHint: "HAB-it",
    difficulty: "easy"
  },
  {
    id: 23,
    word: "inspire",
    partOfSpeech: "verb",
    chineseMeaning: "啟發；激勵",
    englishMeaning: "to make someone want to do something creative",
    exampleSentence: "Her story inspired me to never give up.",
    pronunciationHint: "in-SPYER",
    difficulty: "medium"
  },
  {
    id: 24,
    word: "journey",
    partOfSpeech: "noun",
    chineseMeaning: "旅程",
    englishMeaning: "a long process of personal change and development",
    exampleSentence: "Learning English is a journey, not a race.",
    pronunciationHint: "JUR-nee",
    difficulty: "easy"
  },
  {
    id: 25,
    word: "knowledge",
    partOfSpeech: "noun",
    chineseMeaning: "知識",
    englishMeaning: "information and understanding gained through experience",
    exampleSentence: "Reading books expands your knowledge.",
    pronunciationHint: "NOL-ij",
    difficulty: "easy"
  },
  {
    id: 26,
    word: "motivate",
    partOfSpeech: "verb",
    chineseMeaning: "激勵；促使",
    englishMeaning: "to give someone a reason to do something",
    exampleSentence: "Setting small goals helps motivate me to keep learning.",
    pronunciationHint: "MOH-tuh-vayt",
    difficulty: "medium"
  },
  {
    id: 27,
    word: "overcome",
    partOfSpeech: "verb",
    chineseMeaning: "克服",
    englishMeaning: "to successfully deal with a problem or difficulty",
    exampleSentence: "You can overcome any challenge with persistence.",
    pronunciationHint: "oh-ver-KUM",
    difficulty: "easy"
  },
  {
    id: 28,
    word: "patient",
    partOfSpeech: "adjective",
    chineseMeaning: "有耐心的",
    englishMeaning: "able to wait calmly without getting annoyed",
    exampleSentence: "Be patient with yourself while learning.",
    pronunciationHint: "PAY-shunt",
    difficulty: "easy"
  },
  {
    id: 29,
    word: "quality",
    partOfSpeech: "noun",
    chineseMeaning: "品質",
    englishMeaning: "how good or bad something is",
    exampleSentence: "Focus on quality over quantity when studying.",
    pronunciationHint: "KWOL-i-tee",
    difficulty: "easy"
  },
  {
    id: 30,
    word: "resilient",
    partOfSpeech: "adjective",
    chineseMeaning: "有韌性的；能恢復的",
    englishMeaning: "able to recover quickly from difficulties",
    exampleSentence: "Resilient learners never give up after mistakes.",
    pronunciationHint: "ri-ZIL-yunt",
    difficulty: "hard"
  },
  {
    id: 31,
    word: "strategy",
    partOfSpeech: "noun",
    chineseMeaning: "策略",
    englishMeaning: "a plan for achieving a goal",
    exampleSentence: "Having a study strategy makes learning more effective.",
    pronunciationHint: "STRAT-uh-jee",
    difficulty: "medium"
  },
  {
    id: 32,
    word: "transform",
    partOfSpeech: "verb",
    chineseMeaning: "轉變；改變",
    englishMeaning: "to change something completely",
    exampleSentence: "Daily practice can transform your English skills.",
    pronunciationHint: "trans-FORM",
    difficulty: "medium"
  },
  {
    id: 33,
    word: "unique",
    partOfSpeech: "adjective",
    chineseMeaning: "獨特的",
    englishMeaning: "being the only one of its kind; special",
    exampleSentence: "Everyone has a unique way of learning.",
    pronunciationHint: "yoo-NEEK",
    difficulty: "easy"
  },
  {
    id: 34,
    word: "value",
    partOfSpeech: "verb",
    chineseMeaning: "重視；珍視",
    englishMeaning: "to consider something important",
    exampleSentence: "I value every opportunity to practice speaking.",
    pronunciationHint: "VAL-yoo",
    difficulty: "easy"
  },
  {
    id: 35,
    word: "willing",
    partOfSpeech: "adjective",
    chineseMeaning: "願意的",
    englishMeaning: "ready to do something; not forced",
    exampleSentence: "Are you willing to try speaking in public?",
    pronunciationHint: "WIL-ing",
    difficulty: "easy"
  },
  {
    id: 36,
    word: "adapt",
    partOfSpeech: "verb",
    chineseMeaning: "適應；調整",
    englishMeaning: "to change to suit a new situation",
    exampleSentence: "You need to adapt your study methods over time.",
    pronunciationHint: "uh-DAPT",
    difficulty: "easy"
  },
  {
    id: 37,
    word: "brilliant",
    partOfSpeech: "adjective",
    chineseMeaning: "傑出的；極好的",
    englishMeaning: "extremely clever or excellent",
    exampleSentence: "That's a brilliant idea for learning vocabulary!",
    pronunciationHint: "BRIL-yunt",
    difficulty: "easy"
  },
  {
    id: 38,
    word: "capable",
    partOfSpeech: "adjective",
    chineseMeaning: "有能力的",
    englishMeaning: "having the ability to do something",
    exampleSentence: "You are capable of learning any language.",
    pronunciationHint: "KAY-puh-bul",
    difficulty: "easy"
  },
  {
    id: 39,
    word: "dedicated",
    partOfSpeech: "adjective",
    chineseMeaning: "專注的；投入的",
    englishMeaning: "giving a lot of time and effort to something",
    exampleSentence: "She is dedicated to improving her English.",
    pronunciationHint: "DED-i-kay-tid",
    difficulty: "medium"
  },
  {
    id: 40,
    word: "eager",
    partOfSpeech: "adjective",
    chineseMeaning: "渴望的；熱切的",
    englishMeaning: "wanting very much to do something",
    exampleSentence: "I'm eager to learn new words today!",
    pronunciationHint: "EE-ger",
    difficulty: "easy"
  },
  {
    id: 41,
    word: "fascinating",
    partOfSpeech: "adjective",
    chineseMeaning: "迷人的；極有趣的",
    englishMeaning: "extremely interesting",
    exampleSentence: "The history of English is fascinating.",
    pronunciationHint: "FAS-i-ney-ting",
    difficulty: "medium"
  },
  {
    id: 42,
    word: "genuine",
    partOfSpeech: "adjective",
    chineseMeaning: "真誠的；真正的",
    englishMeaning: "real and sincere, not fake",
    exampleSentence: "She has a genuine interest in learning languages.",
    pronunciationHint: "JEN-yoo-in",
    difficulty: "medium"
  },
  {
    id: 43,
    word: "harmony",
    partOfSpeech: "noun",
    chineseMeaning: "和諧；融洽",
    englishMeaning: "a state of agreement and peaceful coexistence",
    exampleSentence: "Finding harmony between study and rest is important.",
    pronunciationHint: "HAR-muh-nee",
    difficulty: "medium"
  },
  {
    id: 44,
    word: "illuminate",
    partOfSpeech: "verb",
    chineseMeaning: "照亮；闡明",
    englishMeaning: "to make something clear or easy to understand",
    exampleSentence: "Good examples can illuminate complex grammar rules.",
    pronunciationHint: "i-LOO-mi-neyt",
    difficulty: "hard"
  },
  {
    id: 45,
    word: "jubilant",
    partOfSpeech: "adjective",
    chineseMeaning: "歡欣的；喜氣洋洋的",
    englishMeaning: "feeling or expressing great happiness",
    exampleSentence: "She felt jubilant after passing her English exam.",
    pronunciationHint: "JOO-bi-lunt",
    difficulty: "hard"
  },
  {
    id: 46,
    word: "keen",
    partOfSpeech: "adjective",
    chineseMeaning: "敏銳的；熱衷的",
    englishMeaning: "having a strong interest or sharp ability",
    exampleSentence: "He has a keen eye for detail in writing.",
    pronunciationHint: "KEEN",
    difficulty: "easy"
  },
  {
    id: 47,
    word: "leap",
    partOfSpeech: "verb",
    chineseMeaning: "跳躍；飛躍",
    englishMeaning: "to jump or make a sudden big improvement",
    exampleSentence: "Her English took a big leap after six months of practice.",
    pronunciationHint: "LEEP",
    difficulty: "easy"
  },
  {
    id: 48,
    word: "milestone",
    partOfSpeech: "noun",
    chineseMeaning: "里程碑",
    englishMeaning: "an important event or achievement",
    exampleSentence: "Learning 1000 words is a major milestone.",
    pronunciationHint: "MYL-stohn",
    difficulty: "medium"
  },
  {
    id: 49,
    word: "nurture",
    partOfSpeech: "verb",
    chineseMeaning: "培養；滋養",
    englishMeaning: "to care for and help something grow",
    exampleSentence: "Nurture your language skills with daily practice.",
    pronunciationHint: "NUR-cher",
    difficulty: "medium"
  },
  {
    id: 50,
    word: "obstacle",
    partOfSpeech: "noun",
    chineseMeaning: "障礙",
    englishMeaning: "something that blocks your way or makes progress difficult",
    exampleSentence: "Don't see mistakes as obstacles; see them as lessons.",
    pronunciationHint: "OB-stuh-kul",
    difficulty: "medium"
  },
  {
    id: 51,
    word: "persevere",
    partOfSpeech: "verb",
    chineseMeaning: "堅持不懈",
    englishMeaning: "to keep trying despite difficulties",
    exampleSentence: "If you persevere, you will master English eventually.",
    pronunciationHint: "per-se-VEER",
    difficulty: "hard"
  },
  {
    id: 52,
    word: "quest",
    partOfSpeech: "noun",
    chineseMeaning: "追求；探索",
    englishMeaning: "a long search for something important",
    exampleSentence: "Learning English is a lifelong quest for knowledge.",
    pronunciationHint: "KWEST",
    difficulty: "easy"
  },
  {
    id: 53,
    word: "rewarding",
    partOfSpeech: "adjective",
    chineseMeaning: "有回報的；值得的",
    englishMeaning: "giving satisfaction or pleasure",
    exampleSentence: "Learning a language is challenging but very rewarding.",
    pronunciationHint: "ri-WOR-ding",
    difficulty: "medium"
  },
  {
    id: 54,
    word: "steadfast",
    partOfSpeech: "adjective",
    chineseMeaning: "堅定不移的",
    englishMeaning: "firmly loyal and unwavering",
    exampleSentence: "Stay steadfast in your learning journey.",
    pronunciationHint: "STED-fast",
    difficulty: "hard"
  },
  {
    id: 55,
    word: "thrive",
    partOfSpeech: "verb",
    chineseMeaning: "茁壯成長；蓬勃發展",
    englishMeaning: "to grow and develop successfully",
    exampleSentence: "With good habits, your skills will thrive.",
    pronunciationHint: "THRYV",
    difficulty: "medium"
  },
  {
    id: 56,
    word: "uphold",
    partOfSpeech: "verb",
    chineseMeaning: "維護；支持",
    englishMeaning: "to maintain or support a principle",
    exampleSentence: "Uphold your commitment to daily practice.",
    pronunciationHint: "up-HOHLD",
    difficulty: "hard"
  },
  {
    id: 57,
    word: "vivid",
    partOfSpeech: "adjective",
    chineseMeaning: "鮮明的；生動的",
    englishMeaning: "bright and clear; producing strong images in the mind",
    exampleSentence: "Vivid stories are easier to remember.",
    pronunciationHint: "VIV-id",
    difficulty: "medium"
  },
  {
    id: 58,
    word: "wander",
    partOfSpeech: "verb",
    chineseMeaning: "漫步；遊蕩",
    englishMeaning: "to walk around without a fixed destination",
    exampleSentence: "Let your mind wander while you learn new words.",
    pronunciationHint: "WAN-der",
    difficulty: "easy"
  },
  {
    id: 59,
    word: "yield",
    partOfSpeech: "verb",
    chineseMeaning: "產生；讓步",
    englishMeaning: "to produce a result or give way",
    exampleSentence: "Hard work will yield great results over time.",
    pronunciationHint: "YEELD",
    difficulty: "medium"
  },
  {
    id: 60,
    word: "zeal",
    partOfSpeech: "noun",
    chineseMeaning: "熱情；熱忱",
    englishMeaning: "great energy and enthusiasm for something",
    exampleSentence: "Approach your studies with zeal and curiosity.",
    pronunciationHint: "ZEEL",
    difficulty: "hard"
  }
];

export function getRandomWords(count: number, excludeIds: number[] = []): VocabularyItem[] {
  const available = vocabularyList.filter(w => !excludeIds.includes(w.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getDailyWords(date: Date = new Date()): VocabularyItem[] {
  // Deterministic daily words based on date
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const shuffled = [...vocabularyList].sort((a, b) => {
    const hashA = ((a.id * 9301 + seed) % 49297) / 49297;
    const hashB = ((b.id * 9301 + seed) % 49297) / 49297;
    return hashA - hashB;
  });
  return shuffled.slice(0, 5);
}

export function getWordsForDifficulty(difficulty: string): VocabularyItem[] {
  return vocabularyList.filter(w => w.difficulty === difficulty);
}

export function getWordById(id: number): VocabularyItem | undefined {
  return vocabularyList.find(w => w.id === id);
}
