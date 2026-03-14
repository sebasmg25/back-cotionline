import { RegisterQuotationRequestUseCase } from '../../../src/contexts/quotationRequest/useCases/registerQuotationRequest.useCase';
import { QuotationRequestStatus, QuotationRequest } from '../../../src/contexts/quotationRequest/domain/models/quotationRequest.model';
import { User, UserRole } from '../../../src/contexts/user/domain/models/user.model';

describe('RegisterQuotationRequestUseCase', () => {
  let useCase: RegisterQuotationRequestUseCase;
  let mockQuotationRequestRepository: any;
  let mockUserRepository: any;
  let mockPlanRepository: any;

  beforeEach(() => {
    mockQuotationRequestRepository = {
      countSince: jest.fn(),
      save: jest.fn()
    };
    mockUserRepository = {
      findById: jest.fn()
    };
    mockPlanRepository = {
      findById: jest.fn()
    };

    useCase = new RegisterQuotationRequestUseCase(
      mockQuotationRequestRepository,
      mockUserRepository,
      mockPlanRepository
    );
  });

  const validSession = { id: 'owner-id', role: UserRole.OWNER };
  const validDto = {
    title: 'Nueva Cotización Test',
    description: 'Descripción test',
    responseDeadline: new Date('2026-12-31T23:59:59'),
    status: QuotationRequestStatus.PENDING,
    branch: 'Sede Principal'
  };

  it('should throw an error if the user or user plan is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(validDto as any, validSession))
      .rejects.toThrow('Usuario o plan no encontrado');
  });

  it('should throw an error if the plan limits cannot be determined', async () => {
    const user = new User('123', 'John', 'Doe', 'j@m.com', 'h', 'D', 'C', 'owner-id', 'plan-id');
    mockUserRepository.findById.mockResolvedValue(user);
    mockPlanRepository.findById.mockResolvedValue(null); // Plan no existe en BD

    await expect(useCase.execute(validDto as any, validSession))
      .rejects.toThrow('No se pudo determinar los límites del plan');
  });

  it('should throw an error if the user has reached their plan request limit', async () => {
    const user = new User('123', 'John', 'Doe', 'j@m.com', 'h', 'D', 'C', 'owner-id', 'plan-id');
    mockUserRepository.findById.mockResolvedValue(user);
    mockPlanRepository.findById.mockResolvedValue({ id: 'plan-id', requestLimit: 3 }); // Límite 3
    mockQuotationRequestRepository.countSince.mockResolvedValue(3); // Ya tiene 3

    await expect(useCase.execute(validDto as any, validSession))
      .rejects.toThrow('Has alcanzado el límite de solicitudes para tu plan.');
  });

  it('should successfully save a QuotationRequest if below limits', async () => {
    const user = new User('123', 'John', 'Doe', 'j@m.com', 'h', 'D', 'C', 'owner-id', 'plan-id');
    mockUserRepository.findById.mockResolvedValue(user);
    mockPlanRepository.findById.mockResolvedValue({ id: 'plan-id', requestLimit: 3 });
    mockQuotationRequestRepository.countSince.mockResolvedValue(1); // Solamente tiene 1

    const returningSaved = new QuotationRequest(
      validDto.title, validDto.description, validDto.responseDeadline, validDto.status, validDto.branch, 'owner-id'
    );
    // Simular que la base de datos devuelve el objeto con un ID autogenerado y array vacío de productos
    Object.assign(returningSaved, { id: 'qr-id-123', products: [] });

    mockQuotationRequestRepository.save.mockResolvedValue(returningSaved);

    const result = await useCase.execute(validDto as any, validSession);

    expect(mockQuotationRequestRepository.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('qr-id-123');
    expect(result.status).toBe(QuotationRequestStatus.PENDING);
    expect(result.title).toBe('Nueva Cotización Test');
  });

  it('should assign the correct effectiveOwnerId if a collaborator makes the request', async () => {
    const collabSession = { id: 'collab-id', role: UserRole.COLLABORATOR, ownerId: 'boss-owner-id' };
    
    const bossUser = new User('123', 'Boss', 'Admin', 'b@m.com', 'h', 'D', 'C', 'boss-owner-id', 'plan-id');
    mockUserRepository.findById.mockResolvedValue(bossUser);
    mockPlanRepository.findById.mockResolvedValue({ id: 'plan-id', requestLimit: 50 });
    mockQuotationRequestRepository.countSince.mockResolvedValue(10); 
    
    const returningSaved = new QuotationRequest(
      validDto.title, validDto.description, validDto.responseDeadline, validDto.status, validDto.branch, 'boss-owner-id'
    );
    Object.assign(returningSaved, { id: 'qr-collab-123', products: [] });
    mockQuotationRequestRepository.save.mockResolvedValue(returningSaved);

    const result = await useCase.execute(validDto as any, collabSession);

    // Verify the effectiveOwnerId calculations
    expect(mockUserRepository.findById).toHaveBeenCalledWith('boss-owner-id');
    expect(mockQuotationRequestRepository.countSince).toHaveBeenCalledWith('boss-owner-id', expect.any(Date));

    // Verify the returned structure
    expect(result.userId).toBe('boss-owner-id'); // Saved under the boss ID
    expect(result.id).toBe('qr-collab-123');
  });
});
