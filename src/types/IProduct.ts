export interface IProduct {
  id?: number;
  name: string;
  price: number;
  categoryId: number;
  description?: string;
  stock?: number;
  active?: boolean;
  imageUrl?: string;
}
