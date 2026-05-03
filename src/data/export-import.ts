import type { AppState } from '../components/App';

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

export function importFromCSV(csvText: string): Partial<AppState> | null {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return null;
  
  const result: Partial<AppState> = {};
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle quoted values with commas inside
    let field = '';
    let value = '';
    
    if (line.startsWith('"')) {
      const closeQuote = line.indexOf('"', 1);
      if (closeQuote > 0) {
        field = line.slice(1, closeQuote);
        value = line.slice(closeQuote + 2); // skip ",
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
      }
    } else {
      const commaIdx = line.indexOf(',');
      if (commaIdx > 0) {
        field = line.slice(0, commaIdx);
        value = line.slice(commaIdx + 1);
      }
    }
    
    switch (field) {
      case 'XP': result.xp = parseInt(value, 10) || 0; break;
      case 'Level': result.level = parseInt(value, 10) || 1; break;
      case 'Streak': result.streak = parseInt(value, 10) || 0; break;
      case 'LastActiveDate': result.lastActiveDate = value; break;
      case 'LastDailyDate': result.lastDailyDate = value; break;
      case 'QuizHighScore': result.quizHighScore = parseInt(value, 10) || 0; break;
      case 'TotalSessions': result.totalSessions = parseInt(value, 10) || 0; break;
      case 'KnownWords':
        result.knownIds = value ? value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
        break;
      case 'ReviewLater':
        result.reviewLaterIds = value ? value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
        break;
    }
  }
  
  return result;
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
