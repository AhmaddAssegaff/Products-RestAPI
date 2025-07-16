export interface InterfaceProduct {
  id: string;
  name: string;
  price: number;
  created_at: Date;
}

export interface InterfaceCreateProductInput {
  name: string;
  price: number;
}
