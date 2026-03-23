import { DeleteProductUseCase } from '../../../src/contexts/product/useCases/deleteProduct.useCase';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let mockProductRepository: any;
  let mockQuotationRequestRepository: any;

  beforeEach(() => {
    mockProductRepository = {
      findById: jest.fn(),
      delete: jest.fn()
    };
    mockQuotationRequestRepository = {
      findById: jest.fn()
    };
    useCase = new DeleteProductUseCase(mockProductRepository, mockQuotationRequestRepository);
  });

  const existingProduct = { id: 'prod-1', quotationRequestId: 'req-1', name: 'Laptop' };

  it('should throw an error if the product does not exist', async () => {
    mockProductRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('prod-1', 'user-1')).rejects.toThrow('Producto no encontrado.');
  });

  it('should throw an error if quotation does not exist or user lacks permission', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'other-user' });
    
    await expect(useCase.execute('prod-1', 'user-1')).rejects.toThrow('No tienes permiso para eliminar este producto.');
  });

  it('should throw an error if repository deletion fails', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockProductRepository.delete.mockResolvedValue(false);

    await expect(useCase.execute('prod-1', 'user-1')).rejects.toThrow('Error al intentar eliminar el producto.');
  });

  it('should successfully delete and return the deleted product', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockProductRepository.delete.mockResolvedValue(true);

    const result = await useCase.execute('prod-1', 'user-1');

    expect(mockProductRepository.delete).toHaveBeenCalledWith('prod-1');
    expect(result.name).toBe('Laptop');
  });
});
