import {
  ProductRepository,
  ProductUpdateFields,
} from '../domain/repositories/product.repository';
import {
  UpdateProductRequest,
  ProductResponse,
} from '../interfaces/dtos/product.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class UpdateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    id: string,
    userIdSession: string,
    data: UpdateProductRequest,
  ): Promise<ProductResponse> {
    const existProduct = await this.productRepository.findById(id);
    if (!existProduct) {
      throw new Error('El producto que intentas actualizar no existe');
    }

    // Blindaje: Validar propiedad
    const quotationRequest = await this.quotationRequestRepository.findById(
      existProduct.quotationRequestId,
    );
    if (!quotationRequest || quotationRequest.userId !== userIdSession) {
      throw new Error('No tienes permiso para modificar este producto.');
    }

    const updateFields: ProductUpdateFields = {};
    let hasChanges = false;

    if (data.name !== undefined && data.name !== existProduct.name) {
      updateFields.name = data.name;
      hasChanges = true;
    }
    if (data.amount !== undefined && data.amount !== existProduct.amount) {
      updateFields.amount = data.amount;
      hasChanges = true;
    }
    if (
      data.unitOfMeasurement !== undefined &&
      data.unitOfMeasurement !== existProduct.unitOfMeasurement
    ) {
      updateFields.unitOfMeasurement = data.unitOfMeasurement;
      hasChanges = true;
    }
    if (
      data.description !== undefined &&
      data.description !== existProduct.description
    ) {
      updateFields.description = data.description;
      hasChanges = true;
    }

    if (!hasChanges) {
      throw new Error('No se detectaron cambios en los campos enviados.');
    }

    const updated = await this.productRepository.update(id, updateFields);
    if (!updated) throw new Error('Error al actualizar el producto.');

    return {
      id: updated.id!,
      name: updated.name,
      amount: updated.amount,
      unitOfMeasurement: updated.unitOfMeasurement,
      description: updated.description,
      quotationRequestId: updated.quotationRequestId,
    };
  }
}
