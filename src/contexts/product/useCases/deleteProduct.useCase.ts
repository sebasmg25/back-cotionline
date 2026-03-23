import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductResponse } from '../interfaces/dtos/product.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class DeleteProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    productId: string,
    userIdSession: string,
  ): Promise<ProductResponse> {
    const existProduct = await this.productRepository.findById(productId);

    if (!existProduct) {
      throw new Error('Producto no encontrado.');
    }

    const quotationRequest = await this.quotationRequestRepository.findById(
      existProduct.quotationRequestId,
    );
    if (!quotationRequest || quotationRequest.userId !== userIdSession) {
      throw new Error('No tienes permiso para eliminar este producto.');
    }

    const deleted = await this.productRepository.delete(productId);
    if (!deleted) throw new Error('Error al intentar eliminar el producto.');

    return {
      id: existProduct.id!,
      name: existProduct.name,
      amount: existProduct.amount,
      unitOfMeasurement: existProduct.unitOfMeasurement,
      description: existProduct.description,
      quotationRequestId: existProduct.quotationRequestId,
    };
  }
}
