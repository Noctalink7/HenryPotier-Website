export interface BooksInfo {
    isbn: string;
    title: string;
    price: number;
    cover: string;
    quantity: number;
    synopsis: string[];
  }
  

export interface offer {
  type: string;
  sliceValue: number;
  value: number;
}

export interface Reduction {
  offers: offer;
}