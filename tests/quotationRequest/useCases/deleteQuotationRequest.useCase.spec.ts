import { DeleteQuotationRequestUseCase } from '../../../src/contexts/quotationRequest/useCases/deleteQuotationRequest.useCase';

describe('DeleteQuotationRequestUseCase', () => {
  let useCase: DeleteQuotationRequestUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findById: jest.fn(), delete: jest.fn() };
    useCase = new DeleteQuotationRequestUseCase(mockRepo);
  });

  const session = { id: 'buyer-1', role: 'BUYER' };

  it('should throw error if request not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('req-1', session)).rejects.toThrow('La solicitud de cotización que deseas eliminar no existe');
  });

  it('should throw error if user lacks permission', async () => {
    mockRepo.findById.mockResolvedValue({ userId: 'hacker-1' });
    await expect(useCase.execute('req-1', session)).rejects.toThrow('No tienes permiso para eliminar esta solicitud.');
  });

  it('should safely delete and map the returned value', async () => {
    mockRepo.findById.mockResolvedValue({ id: 'req-1', userId: 'buyer-1', title: 'Need Laptops' });
    mockRepo.delete.mockResolvedValue(true);

    const result = await useCase.execute('req-1', session);
    expect(mockRepo.delete).toHaveBeenCalledWith('req-1');
    expect(result.id).toBe('req-1');
    expect(result.title).toBe('Need Laptops');
  });
});
