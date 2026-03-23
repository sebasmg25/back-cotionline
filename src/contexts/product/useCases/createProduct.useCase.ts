import { Product } from '../domain/models/product.model';
import { ProductRepository } from '../domain/repositories/product.repository';
import {
  CreateProductRequest,
  ProductResponse,
} from '../interfaces/dtos/product.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    data: CreateProductRequest,
    userSessionId: string,
  ): Promise<ProductResponse> {

    const quotationRequest = await this.quotationRequestRepository.findById(
      data.quotationRequestId,
    );

    if (!quotationRequest) {
      throw new Error('La solicitud de cotización especificada no existe.');
    }


    if (quotationRequest.userId !== userSessionId) {
      throw new Error(
        'No tienes permiso para agregar productos a esta solicitud.',
      );
    }


    const newProduct = new Product(
      data.name,
      data.amount,
      data.unitOfMeasurement,
      data.description,
      data.quotationRequestId,
    );

    const savedProduct = await this.productRepository.save(newProduct);

    return {
      id: savedProduct.id!,
      name: savedProduct.name,
      amount: savedProduct.amount,
      unitOfMeasurement: savedProduct.unitOfMeasurement,
      description: savedProduct.description,
      quotationRequestId: savedProduct.quotationRequestId,
    };
  }
}
