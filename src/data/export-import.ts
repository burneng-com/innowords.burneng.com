import type { AppState } from '../components/App';
import { vocabularyList } from './vocabulary';

export interface ExportData {
  version: string;
  exportedAt: string;
  state: AppState;
}

export function exportToCSV(state: AppState): string {
  const rows: string[] = [];
  
  // Header
  rows.push('Field,Value');
  
  // Basic stats
  rows.push(`XP,${state.xp}`);
  rows.push(`Level,${state.level}`);
  rows.push(`Streak,${state.streak}`);
  rows.push(`LastActiveDate,"${state.lastActiveDate}"`);
  rows.push(`LastDailyDate,"${state.lastDailyDate}"`);
  rows.push(`QuizHighScore,${state.quizHighScore}`);
  rows.push(`TotalSessions,${state.totalSessions}`);
  
  // Known words
  rows.push(`KnownWords,"${state.knownIds.join(',')}"`);
  
  // Review later words
  rows.push(`ReviewLater,"${state.reviewLaterIds.join(',')}"`);
  
  return rows.join('\n');
}

function validateInt(value: string, field: string, min: number, errors: string[]): number | null {
  const n = parseInt(value, 10);
  if (isNaN(n) || value.trim() !== String(n)) {
    errors.push(`${field} must be an integer, got "${value}"`);
    return null;
  }
  if (n < min) {
    errors.push(`${field} must be >= ${min}, got ${n}`);
    return null;
  }
  return n;
}

function validateDate(value: string, field: string, errors: string[]): string | null {
  if (!value) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    errors.push(`${field} must be YYYY-MM-DD format, got "${value}"`);
    return null;
  }
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    errors.push(`${field} is not a valid date, got "${value}"`);
    return null;
  }
  return value;
}

function validateIds(value: string, field: string, validIds: Set<number>, errors: string[]): number[] | null {
  if (!value) return [];
  const parts = value.split(',').map(s => s.trim()).filter(s => s !== '');
  const ids: number[] = [];
  for (const part of parts) {
    const n = parseInt(part, 10);
    if (isNaN(n) || part !== String(n) || n <= 0) {
      errors.push(`${field}: invalid id "${part}", must be a positive integer`);
      return null;
    }
    if (!validIds.has(n)) {
      errors.push(`${field}: id ${n} does not exist in vocabulary`);
      return null;
    }
    ids.push(n);
  }
  return ids;
}

export function importFromCSV(csvText: string): { state: Partial<AppState> | null; errors: string[] } {
  const errors: string[] = [];
  const lines = csvText.trim().split('\n');

  if (lines.length < 2) {
    return { state: null, errors: ['CSV is empty'] };
  }

  const validVocabIds = new Set(vocabularyList.map(w => w.id));
  const result: Partial<AppState> = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let field = '';
    let value = '';

    if (line.startsWith('"')) {
      const closeQuote = line.indexOf('"', 1);
      if (closeQuote > 0) {
        field = line.slice(1, closeQuote);
        value = line.slice(closeQuote + 2);
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
      }
    } else {
      const commaIdx = line.indexOf(',');
      if (commaIdx > 0) {
        field = line.slice(0, commaIdx);
        value = line.slice(commaIdx + 1);
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
      }
    }

    switch (field) {
      case 'XP': {
        const v = validateInt(value, 'xp', 0, errors);
        if (v !== null) result.xp = v;
        break;
      }
      case 'Level': {
        const v = validateInt(value, 'level', 1, errors);
        if (v !== null) result.level = v;
        break;
      }
      case 'Streak': {
        const v = validateInt(value, 'streak', 0, errors);
        if (v !== null) result.streak = v;
        break;
      }
      case 'LastActiveDate': {
        const v = validateDate(value, 'lastActiveDate', errors);
        if (v !== null) result.lastActiveDate = v;
        break;
      }
      case 'LastDailyDate': {
        const v = validateDate(value, 'lastDailyDate', errors);
        if (v !== null) result.lastDailyDate = v;
        break;
      }
      case 'QuizHighScore': {
        const v = validateInt(value, 'quizHighScore', 0, errors);
        if (v !== null) result.quizHighScore = v;
        break;
      }
      case 'TotalSessions': {
        const v = validateInt(value, 'totalSessions', 0, errors);
        if (v !== null) result.totalSessions = v;
        break;
      }
      case 'KnownWords': {
        const v = validateIds(value, 'knownIds', validVocabIds, errors);
        if (v !== null) result.knownIds = v;
        break;
      }
      case 'ReviewLater': {
        const v = validateIds(value, 'reviewLaterIds', validVocabIds, errors);
        if (v !== null) result.reviewLaterIds = v;
        break;
      }
    }
  }

  if (errors.length > 0) {
    return { state: null, errors };
  }

  return { state: result, errors: [] };
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
