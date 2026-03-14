export interface CreateProductRequest {
  name: string;
  amount: number;
  unitOfMeasurement: string;
  description: string;
  quotationRequestId: string;
}

export interface UpdateProductRequest {
  name?: string;
  amount?: number;
  unitOfMeasurement?: string;
  description?: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  amount: number;
  unitOfMeasurement: string;
  description: string;
  quotationRequestId: string;
}
