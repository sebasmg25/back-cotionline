import { Product } from '../models/product.model';

export interface ProductUpdateFields {
  name?: string;
  amount?: number;
  unitOfMeasurement?: string;
  description?: string;
}

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findByName(name: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  update(
    id: string,
    productUpdateFields: ProductUpdateFields,
  ): Promise<Product | null>;
  delete(id: string): Promise<Product | null>;
  findProductsByQuotationRequestId(
    quotationRequestId: string,
  ): Promise<Product[]>;
}
