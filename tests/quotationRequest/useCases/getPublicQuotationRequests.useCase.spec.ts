import { GetPublicQuotationRequestsUseCase } from '../../../src/contexts/quotationRequest/useCases/getPublicQuotationRequests.useCase';

describe('GetPublicQuotationRequestsUseCase', () => {
  let useCase: GetPublicQuotationRequestsUseCase;
  let mockReqRepo: any, mockBranchRepo: any, mockBusRepo: any, mockUserRepo: any;

  beforeEach(() => {
    mockReqRepo = { updateExpiredStatus: jest.fn(), findActiveQuotationRequests: jest.fn() };
    mockBranchRepo = { findById: jest.fn() };
    mockBusRepo = { findByUserId: jest.fn() };
    mockUserRepo = { findById: jest.fn() };

    useCase = new GetPublicQuotationRequestsUseCase(mockReqRepo, mockBranchRepo, mockBusRepo, mockUserRepo);
  });

  it('should fetch public reqs and safely infer "sede-principal" from business/user', async () => {
    mockReqRepo.updateExpiredStatus.mockResolvedValue();
    mockReqRepo.findActiveQuotationRequests.mockResolvedValue([
      { id: 'req-1', userId: 'owner-1', title: 'T', branch: 'principal' }
    ]);

    mockBusRepo.findByUserId.mockResolvedValue({ address: 'Av 1' });
    mockUserRepo.findById.mockResolvedValue({ department: 'Cundinamarca', city: 'Bogotá' });

    const result = await useCase.execute({ id: 'vendor-1', role: 'PROVIDER' });

    expect(mockReqRepo.updateExpiredStatus).toHaveBeenCalled();
    expect(mockReqRepo.findActiveQuotationRequests).toHaveBeenCalledWith('vendor-1', undefined);
    expect(result[0].branchName).toBe('Sede principal (Cundinamarca, Bogotá - Av 1)');
  });

  it('should fetch public reqs and safely infer distinct branches', async () => {
    const validUuid = '12345678-1234-5678-9012-123456789012';
    mockReqRepo.findActiveQuotationRequests.mockResolvedValue([
      { id: 'req-2', userId: 'owner-2', branch: validUuid }
    ]);

    mockBranchRepo.findById.mockResolvedValue({ name: 'Sede Norte', city: 'Medellín', address: 'Cl 10' });
    mockUserRepo.findById.mockResolvedValue({ department: 'Antioquia' });

    const result = await useCase.execute({ id: 'vendor-1', role: 'PROVIDER' });
    expect(result[0].branchName).toBe('Sede Norte (Antioquia, Medellín - Cl 10)');
  });
});
