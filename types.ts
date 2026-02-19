export interface Variation {
  title: string;
  content: string;
  explanation: string;
}

export interface AnalysisResult {
  score: number;
  critique: string;
  variations: Variation[];
}

export interface HistoryItem {
  id: string;
  original: string;
  result: AnalysisResult;
  timestamp: number;
}