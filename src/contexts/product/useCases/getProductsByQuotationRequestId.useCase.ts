import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductResponse } from '../interfaces/dtos/product.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class GetProductsByQuotationRequestIdUseCase {
  constructor(
    private productRepository: ProductRepository,
    private quotationRequestRepository: QuotationRequestRepository, // Inyección necesaria
  ) {}

  async execute(
    quotationRequestId: string,
    userSessionId: string,
  ): Promise<ProductResponse[]> {
    // 1. Blindaje: Verificar que la cotización existe y es del usuario
    const quotationRequest =
      await this.quotationRequestRepository.findById(quotationRequestId);

    if (!quotationRequest) {
      throw new Error('La solicitud de cotización no existe.');
    }

    if (quotationRequest.userId !== userSessionId) {
      throw new Error(
        'No tienes permiso para ver los productos de esta solicitud.',
      );
    }

    // 2. Si es el dueño, obtenemos los productos
    const products =
      await this.productRepository.findProductsByQuotationRequestId(
        quotationRequestId,
      );

    // 3. Mapeo a DTOs
    return products.map((p) => ({
      id: p.id!,
      name: p.name,
      amount: p.amount,
      unitOfMeasurement: p.unitOfMeasurement,
      description: p.description,
      quotationRequestId: p.quotationRequestId,
    }));
  }
}
