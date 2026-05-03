export interface AcronymItem {
  id: number;
  acronym: string;
  fullName: string;
  chineseMeaning: string;
  memoryTip: string;
  category: string;
}

export const acronymsList: AcronymItem[] = [
  {
    id: 101,
    acronym: "POC",
    fullName: "Proof of Concept",
    chineseMeaning: "概念驗證",
    memoryTip: "先驗證「做不做得出來」",
    category: "產品開發"
  },
  {
    id: 102,
    acronym: "MVP",
    fullName: "Minimum Viable Product",
    chineseMeaning: "最小可行產品",
    memoryTip: "先做一個「最小但可用的產品」",
    category: "產品開發"
  },
  {
    id: 103,
    acronym: "FRS",
    fullName: "Functional Requirements Specification",
    chineseMeaning: "功能需求規格書",
    memoryTip: "說明「系統功能要怎麼做、有哪些規則」",
    category: "產品開發"
  },
  {
    id: 104,
    acronym: "PRD",
    fullName: "Product Requirements Document",
    chineseMeaning: "產品需求文件／產品需求規格書",
    memoryTip: "說明「產品為什麼做、給誰用、要達成什麼」",
    category: "產品開發"
  },
  {
    id: 105,
    acronym: "POI",
    fullName: "Point of Interest",
    chineseMeaning: "興趣點／關注地點／重要地標",
    memoryTip: "地圖或選址分析中，代表「值得關注的地點」，例如學校、車站、商圈、便利商店、競爭店家、住宅區等",
    category: "商業分析"
  }
];

export function getAcronymsByCategory(category?: string): AcronymItem[] {
  if (!category) return [...acronymsList];
  return acronymsList.filter(a => a.category === category);
}

export function getAcronymById(id: number): AcronymItem | undefined {
  return acronymsList.find(a => a.id === id);
}

export function getRandomAcronyms(count: number): AcronymItem[] {
  const shuffled = [...acronymsList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const acronymCategories: string[] = [...new Set(acronymsList.map(a => a.category))];
