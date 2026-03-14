import { BranchRepository } from '../domain/repositories/branch.repository';
import { BusinessRepository } from '../../business/domain/repositories/business.repository';
import { BranchResponse } from '../interfaces/dtos/branch.dto';

export class GetBranchesByBusinessIdUseCase {
  constructor(
    private branchRepository: BranchRepository,
    private businessRepository: BusinessRepository,
  ) {}

  async execute(
    businessId: string,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<BranchResponse[]> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;

    // 1. Validar propiedad PRIMERO
    const business = await this.businessRepository.findById(businessId);

    if (!business) {
      throw new Error('El negocio especificado no existe.');
    }

    if (business.userId !== effectiveOwnerId) {
      throw new Error('No tienes permiso para ver las sedes de este negocio.');
    }

    // 2. Buscamos las sedes (esto devuelve un Branch[])
    const branches =
      await this.branchRepository.findBranchesByBusinessId(businessId);

    // 3. Transformar la lista de modelos a una lista de DTOs
    return branches.map((branch) => ({
      id: branch.id!,
      name: branch.name,
      address: branch.address,
      city: branch.city,
      businessId: branch.businessId,
    }));
  }
}
