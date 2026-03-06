export interface Memory {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  description: string;
  width: number;
  height: number;
}

export interface QuoteState {
  text: string;
  isLoading: boolean;
  error: string | null;
}
