import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductResponse } from '../interfaces/dtos/product.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class GetProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    productId: string,
    userIdSession: string,
  ): Promise<ProductResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Producto no encontrado.');
    }

    const quotationRequest = await this.quotationRequestRepository.findById(
      product.quotationRequestId,
    );

    if (!quotationRequest || quotationRequest.userId !== userIdSession) {
      throw new Error('No tienes permiso para ver este producto.');
    }

    return {
      id: product.id!,
      name: product.name,
      amount: product.amount,
      unitOfMeasurement: product.unitOfMeasurement,
      description: product.description,
      quotationRequestId: product.quotationRequestId,
    };
  }
}
