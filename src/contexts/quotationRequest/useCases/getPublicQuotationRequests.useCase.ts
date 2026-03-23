import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';
import { QuotationRequestResponse } from '../interfaces/dtos/quotationRequest.dto';
import { BranchRepository } from '../../branch/domain/repositories/branch.repository';
import { BusinessRepository } from '../../business/domain/repositories/business.repository';
import { UserRepository } from '../../user/domain/repositories/user.repository';

export class GetPublicQuotationRequestsUseCase {
  constructor(
    private quotationRequestRepository: QuotationRequestRepository,
    private branchRepository: BranchRepository,
    private businessRepository: BusinessRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(
    userSession: { id: string; role: string; ownerId?: string },
    filters?: { department?: string; city?: string },
  ): Promise<QuotationRequestResponse[]> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;

    await this.quotationRequestRepository.updateExpiredStatus({});

    const publicRequests =
      await this.quotationRequestRepository.findActiveQuotationRequests(
        effectiveOwnerId,
        filters,
      );

    return Promise.all(
      (publicRequests || []).map(async (req) => {
        let branchName = req.branch;

        if (req.branch === 'principal' || req.branch === 'sede-principal-automatica') {
          const business = await this.businessRepository.findByUserId(req.userId);
          const user = await this.userRepository.findById(req.userId);
          if (business && user) {
            branchName = `Sede principal (${user.department}, ${user.city} - ${business.address || 'Sin dirección'})`;
          } else {
            branchName = 'Sede Principal (Negocio)';
          }
        } else if (
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            req.branch,
          )
        ) {
          const branch = await this.branchRepository.findById(req.branch);
          const user = await this.userRepository.findById(req.userId);
          if (branch && user) {
            branchName = `${branch.name} (${user.department}, ${branch.city} - ${branch.address || 'Sin dirección'})`;
          } else if (branch) {
            branchName = branch.name;
          }
        }

        return {
          id: req.id!,
          title: req.title,
          description: req.description,
          createdAt: req.createdAt,
          responseDeadline: req.responseDeadline,
          status: req.status,
          branch: req.branch,
          branchName,
          userId: req.userId,
          products: req.products?.map((p) => ({
            id: p.id!,
            name: p.name,
            amount: p.amount,
            unitOfMeasurement: p.unitOfMeasurement,
            description: p.description,
            quotationRequestId: p.quotationRequestId,
          })),
        };
      }),
    );
  }
}
