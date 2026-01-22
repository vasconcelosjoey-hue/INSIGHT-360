
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
  [dimensionId: string]: number;
}

export interface ProcessedResult {
  dimensionId: string;
  dimensionName: string;
  score: number;
  description: string;
}

export interface UserInfo {
  name: string;
  email: string;
  whatsapp: string;
  testType?: 'individual' | 'corporate';
}

export type QuizState = 
  | 'lead-capture' 
  | 'disclaimer' 
  | 'welcome' 
  | 'intro' 
  | 'test' 
  | 'thank-you'
  | 'final-screen'
  | 'calculating' 
  | 'results' 
  | 'admin';
