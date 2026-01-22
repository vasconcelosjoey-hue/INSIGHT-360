
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

export interface ProcessedResult {
  dimensionId: string;
  dimensionName: string;
  score: number;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  startDate: string;
  endDate: string;
  createdAt: any;
}

export interface UserInfo {
  name: string;
  email: string;
  whatsapp: string;
  companyId?: string;
  companyName?: string;
  cnpj?: string;
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
  | 'admin'
  | 'company-selection';
