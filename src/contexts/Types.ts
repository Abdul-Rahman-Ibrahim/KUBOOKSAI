export interface BookType {
  id: string;
  volumeInfo: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publishedDate?: string;
    categories?: string[];
    pageCount?: number;
    imageLinks?: {
      thumbnail: string;
    };
    description?: string;
    previewLink?: string;
  };
  quantity?: number;
}
