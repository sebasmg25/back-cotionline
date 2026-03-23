import { GetProductUseCase } from '../../../src/contexts/product/useCases/getProduct.useCase';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let mockProductRepository: any;
  let mockQuotationRequestRepository: any;

  beforeEach(() => {
    mockProductRepository = {
      findById: jest.fn()
    };
    mockQuotationRequestRepository = {
      findById: jest.fn()
    };
    useCase = new GetProductUseCase(mockProductRepository, mockQuotationRequestRepository);
  });

  const existingProduct = { id: 'prod-1', quotationRequestId: 'req-1', name: 'Laptop' };

  it('should throw an error if the product is not found', async () => {
    mockProductRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('prod-1', 'user-1')).rejects.toThrow('Producto no encontrado.');
  });

  it('should throw an error if the quotation request fails ownership validation', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'other-user' });
    await expect(useCase.execute('prod-1', 'user-1')).rejects.toThrow('No tienes permiso para ver este producto.');
  });

  it('should return the product if validation succeeds', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'user-1' });
    
    const result = await useCase.execute('prod-1', 'user-1');
    expect(result.id).toBe('prod-1');
    expect(result.name).toBe('Laptop');
  });
});
