
export interface Dimension {
  id: string;
  name: string;
  description: string;
}

export interface Question {
  id: number;
  dimensionId: string;
  text: string;
}

export interface UserScore {
  [dimensionId: string]: number; // Raw sum
}

export interface ProcessedResult {
  dimensionId: string;
  dimensionName: string;
  score: number; // 0 to 100
  description: string;
}

export interface UserInfo {
  name: string;
  email: string;
  whatsapp: string;
}

export type QuizState = 'lead-capture' | 'disclaimer' | 'welcome' | 'intro' | 'test' | 'manual_input' | 'calculating' | 'results';
