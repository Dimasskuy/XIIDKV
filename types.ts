export interface Memory {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  description: string; // Static description
}

export interface QuoteState {
  text: string;
  isLoading: boolean;
  error: string | null;
}