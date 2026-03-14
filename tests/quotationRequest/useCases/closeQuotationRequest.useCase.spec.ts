import { CloseQuotationRequestUseCase } from '../../../src/contexts/quotationRequest/useCases/closeQuotationRequest.useCase';
import { QuotationRequestStatus } from '../../../src/contexts/quotationRequest/domain/models/quotationRequest.model';
import { QuotationStatus } from '../../../src/contexts/quotation/domain/models/quotation.model';
import { NotificationType } from '../../../src/contexts/notification/domain/models/notification.model';

describe('CloseQuotationRequestUseCase', () => {
  let useCase: CloseQuotationRequestUseCase;
  let mockQuotationRequestRepository: any;
  let mockQuotationRepository: any;
  let mockSendNotificationUseCase: any;

  beforeEach(() => {
    mockQuotationRequestRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    mockQuotationRepository = {
      findById: jest.fn(),
      findByQuotationRequestId: jest.fn(),
      update: jest.fn()
    };
    mockSendNotificationUseCase = {
      execute: jest.fn()
    };

    useCase = new CloseQuotationRequestUseCase(
      mockQuotationRequestRepository,
      mockQuotationRepository,
      mockSendNotificationUseCase
    );
  });

  it('should throw an error if the request doesn\'t exist or doesn\'t belong to the user', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('req-1', 'user-1', 'offer-1'))
      .rejects.toThrow('No tienes permiso para cerrar esta solicitud o no existe.');

    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'other-user' });

    await expect(useCase.execute('req-1', 'user-1', 'offer-1'))
      .rejects.toThrow('No tienes permiso para cerrar esta solicitud o no existe.');
  });

  it('should throw an error if the request is already EXPIRED', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ 
      userId: 'user-1', status: QuotationRequestStatus.EXPIRED 
    });

    await expect(useCase.execute('req-1', 'user-1', 'offer-1'))
      .rejects.toThrow('No puedes cerrar una solicitud que ya ha expirado.');
  });

  it('should throw an error if the request is already CLOSED', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ 
      userId: 'user-1', status: QuotationRequestStatus.CLOSED 
    });

    await expect(useCase.execute('req-1', 'user-1', 'offer-1'))
      .rejects.toThrow('Esta solicitud ya se encuentra cerrada.');
  });

  it('should throw an error if the selected quotation does not exist', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ 
      userId: 'user-1', status: QuotationRequestStatus.PENDING 
    });
    mockQuotationRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('req-1', 'user-1', 'offer-1'))
      .rejects.toThrow('La cotización seleccionada no existe.');
  });

  it('should throw an error if the selected quotation belongs to a different request', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ 
      id: 'req-1', userId: 'user-1', status: QuotationRequestStatus.PENDING 
    });
    mockQuotationRepository.findById.mockResolvedValue({ 
      id: 'offer-1', quotationRequestId: 'different-req' 
    });

    await expect(useCase.execute('req-1', 'user-1', 'offer-1'))
      .rejects.toThrow('La cotización seleccionada no pertenece a esta solicitud.');
  });

  it('should successfully close the request, accept the winner, and expire losers', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ 
      id: 'req-1', title: 'Need Apples', userId: 'buyer-user-1', status: QuotationRequestStatus.QUOTED 
    });
    
    mockQuotationRepository.findById.mockResolvedValue({ 
      id: 'offer-winner', quotationRequestId: 'req-1', userId: 'provider-1' 
    });
    
    const allOffers = [
      { id: 'offer-winner', quotationRequestId: 'req-1', userId: 'provider-1' },
      { id: 'offer-loser-2', quotationRequestId: 'req-1', userId: 'provider-2' },
      { id: 'offer-loser-3', quotationRequestId: 'req-1', userId: 'provider-3' }
    ];
    mockQuotationRepository.findByQuotationRequestId.mockResolvedValue(allOffers);
    mockSendNotificationUseCase.execute.mockResolvedValue(undefined);

    await useCase.execute('req-1', 'buyer-user-1', 'offer-winner');

    // Should update request status
    expect(mockQuotationRequestRepository.update).toHaveBeenCalledWith('req-1', { status: QuotationRequestStatus.CLOSED });
    
    // Should update winner to ACCEPTED
    expect(mockQuotationRepository.update).toHaveBeenCalledWith('offer-winner', { status: QuotationStatus.ACCEPTED });
    
    // Should update losers to EXPIRED
    expect(mockQuotationRepository.update).toHaveBeenCalledWith('offer-loser-2', { status: QuotationStatus.EXPIRED });
    expect(mockQuotationRepository.update).toHaveBeenCalledWith('offer-loser-3', { status: QuotationStatus.EXPIRED });

    // Should send notification
    expect(mockSendNotificationUseCase.execute).toHaveBeenCalledWith(
      NotificationType.TRANSACTIONAL,
      '¡Cotización Seleccionada!',
      'Tu oferta para la solicitud "Need Apples" ha sido aceptada.',
      '/dashboard/quotation-management/detail/offer-winner',
      'provider-1'
    );
  });
});
