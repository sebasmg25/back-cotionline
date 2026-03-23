import { UpdateQuotationRequestUseCase } from '../../../src/contexts/quotationRequest/useCases/updateQuotationRequest.useCase';
import { QuotationRequestStatus } from '../../../src/contexts/quotationRequest/domain/models/quotationRequest.model';

describe('UpdateQuotationRequestUseCase', () => {
  let useCase: UpdateQuotationRequestUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findById: jest.fn(), update: jest.fn() };
    useCase = new UpdateQuotationRequestUseCase(mockRepo);
  });

  const session = { id: 'buyer-1', role: 'BUYER' };
  const d1 = new Date('2023-01-01');
  const existing = { id: 'req-1', userId: 'buyer-1', title: 'Need 5 laptops', responseDeadline: d1, status: QuotationRequestStatus.PENDING };

  it('should safely throw error if req does not exist or user unauthorized', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('req-1', session, {})).rejects.toThrow('La solicitud de cotización no existe o no tienes permiso.');

    mockRepo.findById.mockResolvedValue({ ...existing, userId: 'hacker-1' });
    await expect(useCase.execute('req-1', session, {})).rejects.toThrow('La solicitud de cotización no existe o no tienes permiso.');
  });

  it('should safely return original map without hitting the db if there are absolutely no changes', async () => {
    mockRepo.findById.mockResolvedValue(existing);

    const result = await useCase.execute('req-1', session, { title: 'Need 5 laptops' });
    expect(mockRepo.update).not.toHaveBeenCalled();
    expect(result.id).toBe('req-1');
  });

  it('should safely update repository logic and map back the full model', async () => {
    mockRepo.findById.mockResolvedValue(existing);
    
    // We try changing title and status
    const dbUpdatePayload = { title: 'Need 10 laptops', status: QuotationRequestStatus.EXPIRED };
    mockRepo.update.mockResolvedValue({ ...existing, ...dbUpdatePayload });

    const result = await useCase.execute('req-1', session, dbUpdatePayload);

    expect(mockRepo.update).toHaveBeenCalledWith('req-1', expect.objectContaining({
      title: 'Need 10 laptops',
      status: QuotationRequestStatus.EXPIRED
    }));

    expect(result.title).toBe('Need 10 laptops');
    expect(result.status).toBe(QuotationRequestStatus.EXPIRED);
  });
});
