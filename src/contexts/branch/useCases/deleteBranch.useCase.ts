import { BranchRepository } from '../domain/repositories/branch.repository';
import { BusinessRepository } from '../../business/domain/repositories/business.repository';
import { BranchResponse } from '../interfaces/dtos/branch.dto';

import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class DeleteBranchUseCase {
  constructor(
    private branchRepository: BranchRepository,
    private businessRepository: BusinessRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    branchId: string,
    userIdSession: string,
  ): Promise<BranchResponse> {
    const branch = await this.branchRepository.findById(branchId);

    if (!branch) throw new Error('Sede no encontrada.');

    const business = await this.businessRepository.findById(branch.businessId);

    if (!business || business.userId !== userIdSession) {
      throw new Error('No tienes permiso para eliminar esta sede.');
    }

    const activeRequestsCount = await this.quotationRequestRepository.countActiveByBranchId(branchId);
    if (activeRequestsCount > 0) {
      throw new Error('No se puede eliminar esta sede porque tiene solicitudes de cotización activas.');
    }

    const deleted = await this.branchRepository.delete(branchId);
    if (!deleted) throw new Error('Error al eliminar la sede.');

    return {
      id: branch.id!,
      name: branch.name,
      address: branch.address,
      city: branch.city,
      businessId: branch.businessId,
    };
  }
}
