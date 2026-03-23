import { UpdateQuotationUseCase } from '../../../src/contexts/quotation/useCases/updateQuotation.useCase';
import { QuotationStatus } from '../../../src/contexts/quotation/domain/models/quotation.model';

describe('UpdateQuotationUseCase', () => {
  let useCase: UpdateQuotationUseCase;
  let mockQuotationRepo: any;

  beforeEach(() => {
    mockQuotationRepo = { findById: jest.fn(), update: jest.fn() };
    useCase = new UpdateQuotationUseCase(mockQuotationRepo);
  });

  const session = { id: 'vendor-1', role: 'PROVIDER' };
  const d1 = new Date('2023-01-01');
  const d2 = new Date('2023-01-02');
  const existingQuotation = {
    id: 'quot-1',
    userId: 'vendor-1',
    price: 100,
    responseDeadline: d1,
    deliveryTime: d1,
    description: 'old desc',
    status: QuotationStatus.PENDING
  };

  it('should throw if quotation does not exist', async () => {
    mockQuotationRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('quot-1', session, {})).rejects.toThrow('La cotización que intentas actualizar no existe');
  });

  it('should throw if user is not author', async () => {
    mockQuotationRepo.findById.mockResolvedValue({ ...existingQuotation, userId: 'other-vendor' });
    await expect(useCase.execute('quot-1', session, {})).rejects.toThrow('No tienes permiso para editar esta cotización.');
  });

  it('should throw if no changes sent', async () => {
    mockQuotationRepo.findById.mockResolvedValue(existingQuotation);
    await expect(useCase.execute('quot-1', session, { price: 100, description: 'old desc', responseDeadline: d1 })).rejects.toThrow('No se detectaron cambios en los campos enviados.');
  });

  it('should throw if repository update fails technically', async () => {
    mockQuotationRepo.findById.mockResolvedValue(existingQuotation);
    mockQuotationRepo.update.mockResolvedValue(null);

    await expect(useCase.execute('quot-1', session, { price: 200 })).rejects.toThrow('Error técnico al actualizar.');
  });

  it('should validate and merge multiple changes securely', async () => {
    mockQuotationRepo.findById.mockResolvedValue(existingQuotation);
    mockQuotationRepo.update.mockResolvedValue({ ...existingQuotation, price: 200, status: QuotationStatus.ACCEPTED });

    const result = await useCase.execute('quot-1', session, {
      price: 200,
      deliveryTime: d2,
      status: QuotationStatus.ACCEPTED as any
    });

    expect(mockQuotationRepo.update).toHaveBeenCalledWith('quot-1', {
      price: 200,
      deliveryTime: d2,
      status: QuotationStatus.ACCEPTED
    });
    expect(result.price).toBe(200);
  });
});
