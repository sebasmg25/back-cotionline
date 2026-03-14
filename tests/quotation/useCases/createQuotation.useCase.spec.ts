import { CreateQuotationUseCase } from '../../../src/contexts/quotation/useCases/createQuotation.useCase';
import { QuotationRequestStatus } from '../../../src/contexts/quotationRequest/domain/models/quotationRequest.model';
import { Quotation, QuotationStatus } from '../../../src/contexts/quotation/domain/models/quotation.model';
import { NotificationType } from '../../../src/contexts/notification/domain/models/notification.model';
import { UserRole } from '../../../src/contexts/user/domain/models/user.model';

describe('CreateQuotationUseCase', () => {
  let useCase: CreateQuotationUseCase;
  let mockQuotationRepository: any;
  let mockQuotationRequestRepository: any;
  let mockSendNotificationUseCase: any;
  let mockUserRepository: any;
  let mockPlanRepository: any;

  beforeEach(() => {
    mockQuotationRepository = {
      countSince: jest.fn(),
      findByUserAndQuotationRequest: jest.fn(),
      save: jest.fn()
    };
    mockQuotationRequestRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    mockSendNotificationUseCase = {
      execute: jest.fn()
    };
    mockUserRepository = {
      findById: jest.fn()
    };
    mockPlanRepository = {
      findById: jest.fn()
    };

    useCase = new CreateQuotationUseCase(
      mockQuotationRepository,
      mockQuotationRequestRepository,
      mockSendNotificationUseCase,
      mockUserRepository,
      mockPlanRepository
    );
  });

  const validSession = { id: 'provider-1', role: UserRole.OWNER };
  const validData = {
    quotationRequestId: 'req-1',
    price: 1500,
    deliveryTime: new Date('2026-12-31'),
    responseDeadline: new Date('2026-12-30')
  };

  it('should throw an error if user or plan is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(validData as any, validSession))
      .rejects.toThrow('Usuario o plan no encontrado');
  });

  it('should throw an error if the plan limits cannot be determined', async () => {
    mockUserRepository.findById.mockResolvedValue({ planId: 'plan-1' });
    mockPlanRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(validData as any, validSession))
      .rejects.toThrow('No se pudo determinar los límites del plan');
  });

  it('should throw an error if the provider has reached the quotation limit', async () => {
    mockUserRepository.findById.mockResolvedValue({ planId: 'plan-1' });
    mockPlanRepository.findById.mockResolvedValue({ quotationLimit: 5 });
    mockQuotationRepository.countSince.mockResolvedValue(5); // At limit
    
    await expect(useCase.execute(validData as any, validSession))
      .rejects.toThrow('Has alcanzado el límite de cotizaciones para tu plan');
  });

  it('should throw an error if the quotation request does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue({ planId: 'plan-1' });
    mockPlanRepository.findById.mockResolvedValue({ quotationLimit: 5 });
    mockQuotationRepository.countSince.mockResolvedValue(1); 
    mockQuotationRequestRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(validData as any, validSession))
      .rejects.toThrow('La solicitud de cotización no existe');
  });

  it('should throw an error if the provider already quoted this request', async () => {
    mockUserRepository.findById.mockResolvedValue({ planId: 'plan-1' });
    mockPlanRepository.findById.mockResolvedValue({ quotationLimit: 5 });
    mockQuotationRepository.countSince.mockResolvedValue(1); 
    mockQuotationRequestRepository.findById.mockResolvedValue({ id: 'req-1' });
    mockQuotationRepository.findByUserAndQuotationRequest.mockResolvedValue({ id: 'existing-quote' });

    await expect(useCase.execute(validData as any, validSession))
      .rejects.toThrow('Usted ya ha enviado una cotización para esta solicitud.');
  });

  it('should successfully save the quotation and alter request status if PENDING', async () => {
    mockUserRepository.findById.mockResolvedValue({ planId: 'plan-1' });
    mockPlanRepository.findById.mockResolvedValue({ quotationLimit: 5 });
    mockQuotationRepository.countSince.mockResolvedValue(1); 
    mockQuotationRequestRepository.findById.mockResolvedValue({ id: 'req-1', status: 'PENDING', userId: 'buyer-1' });
    mockQuotationRepository.findByUserAndQuotationRequest.mockResolvedValue(null);
    
    const savedQuote = new Quotation(validData.responseDeadline, validData.quotationRequestId, 'provider-1', validData.price, validData.deliveryTime, QuotationStatus.DRAFT);
    Object.assign(savedQuote, { id: 'new-quote-id' });
    mockQuotationRepository.save.mockResolvedValue(savedQuote);

    const result = await useCase.execute(validData as any, validSession);

    // Assert update on request status
    expect(mockQuotationRequestRepository.update).toHaveBeenCalledWith('req-1', { status: QuotationRequestStatus.QUOTED });
    
    // Assert notification sent
    expect(mockSendNotificationUseCase.execute).toHaveBeenCalledWith(
       NotificationType.TRANSACTIONAL,
       expect.any(String),
       expect.any(String),
       '/dashboard/quotations/detail/req-1',
       'buyer-1'
    );

    expect(result.id).toBe('new-quote-id');
  });
});
