import { DeleteQuotationUseCase } from '../../../src/contexts/quotation/useCases/deleteQuotation.useCase';

describe('DeleteQuotationUseCase', () => {
  let useCase: DeleteQuotationUseCase;
  let mockQuotationRepo: any;

  beforeEach(() => {
    mockQuotationRepo = { findById: jest.fn(), delete: jest.fn() };
    useCase = new DeleteQuotationUseCase(mockQuotationRepo);
  });

  const session = { id: 'vendor-1', role: 'PROVIDER' };

  it('should throw error if quotation does not exist', async () => {
    mockQuotationRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('quot-1', session)).rejects.toThrow('Cotización no encontrada');
  });

  it('should throw error if not the owner of the quotation', async () => {
    mockQuotationRepo.findById.mockResolvedValue({ userId: 'hacker-1' });
    await expect(useCase.execute('quot-1', session)).rejects.toThrow('No tienes permiso para eliminar esta cotización.');
  });

  it('should successfully delete and map to response', async () => {
    const existing = { id: 'quot-1', userId: 'vendor-1', price: 100 };
    mockQuotationRepo.findById.mockResolvedValue(existing);

    const result = await useCase.execute('quot-1', session);

    expect(mockQuotationRepo.delete).toHaveBeenCalledWith('quot-1');
    expect(result.id).toBe('quot-1');
  });
});
