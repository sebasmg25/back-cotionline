import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductResponse } from '../interfaces/dtos/product.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class GetProductsByQuotationRequestIdUseCase {
  constructor(
    private productRepository: ProductRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    quotationRequestId: string,
    userSessionId: string,
  ): Promise<ProductResponse[]> {

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


    const products =
      await this.productRepository.findProductsByQuotationRequestId(
        quotationRequestId,
      );


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
