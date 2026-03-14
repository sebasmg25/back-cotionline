import { Branch } from '../domain/models/branch.model';
import {
  BranchRepository,
  BranchUpdateFields,
} from '../domain/repositories/branch.repository';
import { BusinessRepository } from '../../business/domain/repositories/business.repository';
import {
  UpdateBranchRequest,
  BranchResponse,
} from '../interfaces/dtos/branch.dto';
// Importamos la data oficial
import { COLOMBIAN_DATA } from '../../../contexts/shared/domain/constants/cities.data';

export class UpdateBranchUseCase {
  constructor(
    private branchRepository: BranchRepository,
    private businessRepository: BusinessRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateBranchRequest,
    userIdSession: string,
  ): Promise<BranchResponse> {
    // 1. Verificar si la sede existe
    const existBranch = await this.branchRepository.findById(id);
    if (!existBranch) {
      throw new Error('La sede que intentas actualizar no existe');
    }

    // 2. Verificar propiedad (Seguridad de Autorización - ¡Esto ya lo tienes bien!)
    const business = await this.businessRepository.findById(
      existBranch.businessId,
    );
    if (!business || business.userId !== userIdSession) {
      throw new Error('No tienes permiso para modificar esta sede.');
    }

    // 3. VALIDACIÓN DE INTEGRIDAD: ¿La ciudad es válida en Colombia?
    if (data.city && data.city !== existBranch.city) {
      // Verificamos si la ciudad existe en CUALQUIER departamento de nuestra lista
      const allCities = Object.values(COLOMBIAN_DATA).flat();
      const isCityValid = allCities.includes(data.city);

      if (!isCityValid) {
        throw new Error(
          'La ciudad proporcionada no es válida en nuestro registro oficial.',
        );
      }
    }

    // 4. Identificar cambios reales
    const updateFields: BranchUpdateFields = {};
    if (data.name && data.name !== existBranch.name)
      updateFields.name = data.name;
    if (data.address && data.address !== existBranch.address)
      updateFields.address = data.address;
    if (data.city && data.city !== existBranch.city)
      updateFields.city = data.city;

    // 5. Validar si hay algo que actualizar
    if (Object.keys(updateFields).length === 0) {
      return {
        id: existBranch.id!,
        name: existBranch.name,
        address: existBranch.address,
        city: existBranch.city,
        businessId: existBranch.businessId,
      };
    }

    // 6. Ejecutar actualización
    const updated = await this.branchRepository.update(id, updateFields);
    if (!updated) {
      throw new Error('Error al actualizar');
    }

    return {
      id: updated.id!,
      name: updated.name,
      address: updated.address,
      city: updated.city,
      businessId: updated.businessId,
    };
  }
}
