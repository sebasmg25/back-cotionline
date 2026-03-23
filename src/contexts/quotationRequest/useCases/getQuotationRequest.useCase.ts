import { QuotationRequest, QuotationRequestStatus } from '../domain/models/quotationRequest.model';
import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';
import { QuotationRequestResponse } from '../interfaces/dtos/quotationRequest.dto';
import { QuotationRepository } from '../../quotation/domain/repositories/quotation.repository';

import { BranchRepository } from '../../branch/domain/repositories/branch.repository';
import { BusinessRepository } from '../../business/domain/repositories/business.repository';
import { UserRepository } from '../../user/domain/repositories/user.repository';

export class GetQuotationRequestUseCase {
  constructor(
    private quotationRequestRepository: QuotationRequestRepository,
    private quotationRepository: QuotationRepository,
    private branchRepository: BranchRepository,
    private businessRepository: BusinessRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(
    quotationRequestId: string,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<QuotationRequestResponse> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;


    await this.quotationRequestRepository.updateExpiredStatus({
      id: quotationRequestId,
      userId: effectiveOwnerId,
    });


    const request =
      await this.quotationRequestRepository.findById(quotationRequestId);

    if (!request) {
      throw new Error('Solicitud de Cotización no encontrada.');
    }

    const isOwner = request.userId === effectiveOwnerId;
    const isPublic =
      request.status === QuotationRequestStatus.PENDING ||
      request.status === QuotationRequestStatus.QUOTED;
    let isProviderForThisRequest = false;

    if (!isOwner && !isPublic) {
      const userQuotation =
        await this.quotationRepository.findByUserAndQuotationRequest(
          effectiveOwnerId,
          quotationRequestId,
        );
      if (userQuotation) {
        isProviderForThisRequest = true;
      }
    }

    if (!isOwner && !isPublic && !isProviderForThisRequest) {
      throw new Error('No tienes permiso para ver esta solicitud.');
    }

    return this.mapToResponse(request);
  }

  private async mapToResponse(
    model: QuotationRequest,
  ): Promise<QuotationRequestResponse> {
    let branchName = model.branch;

    if (model.branch === 'principal' || model.branch === 'sede-principal-automatica') {
      const business = await this.businessRepository.findByUserId(model.userId);
      const user = await this.userRepository.findById(model.userId);
      if (business && user) {
        branchName = `Sede principal (${user.department}, ${user.city} - ${business.address || 'Sin dirección'})`;
      } else {
        branchName = 'Sede Principal (Negocio)';
      }
    } else if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        model.branch,
      )
    ) {
      const branch = await this.branchRepository.findById(model.branch);
      const user = await this.userRepository.findById(model.userId);
      if (branch && user) {
        branchName = `${branch.name} (${user.department}, ${branch.city} - ${branch.address || 'Sin dirección'})`;
      } else if (branch) {
        branchName = branch.name;
      }
    }

    return {
      id: model.id!,
      title: model.title,
      description: model.description,
      createdAt: model.createdAt,
      responseDeadline: model.responseDeadline,
      status: model.status,
      branch: model.branch,
      branchName,
      userId: model.userId,
      products: model.products?.map((p) => ({
        id: p.id!,
        name: p.name,
        amount: p.amount,
        unitOfMeasurement: p.unitOfMeasurement,
        description: p.description,
        quotationRequestId: p.quotationRequestId,
      })),
    };
  }
}
