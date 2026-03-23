import { GetProductsByQuotationRequestIdUseCase } from '../../../src/contexts/product/useCases/getProductsByQuotationRequestId.useCase';

describe('GetProductsByQuotationRequestIdUseCase', () => {
  let useCase: GetProductsByQuotationRequestIdUseCase;
  let mockProductRepository: any;
  let mockQuotationRequestRepository: any;

  beforeEach(() => {
    mockProductRepository = {
      findProductsByQuotationRequestId: jest.fn()
    };
    mockQuotationRequestRepository = {
      findById: jest.fn()
    };
    useCase = new GetProductsByQuotationRequestIdUseCase(mockProductRepository, mockQuotationRequestRepository);
  });

  it('should throw an error if the quotation request does not exist', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('req-1', 'user-1')).rejects.toThrow('La solicitud de cotización no existe.');
  });

  it('should throw an error if the user does not own the quotation request', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'hacker-user' });
    await expect(useCase.execute('req-1', 'user-1')).rejects.toThrow('No tienes permiso para ver los productos de esta solicitud.');
  });

  it('should map and return an array of products', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockProductRepository.findProductsByQuotationRequestId.mockResolvedValue([
      { id: 'p1', name: 'Product 1' },
      { id: 'p2', name: 'Product 2' }
    ]);

    const result = await useCase.execute('req-1', 'user-1');
    
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('p1');
    expect(result[1].name).toBe('Product 2');
  });
});
