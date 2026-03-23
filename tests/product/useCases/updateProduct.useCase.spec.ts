import { UpdateProductUseCase } from '../../../src/contexts/product/useCases/updateProduct.useCase';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let mockProductRepository: any;
  let mockQuotationRequestRepository: any;

  beforeEach(() => {
    mockProductRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    mockQuotationRequestRepository = {
      findById: jest.fn()
    };
    useCase = new UpdateProductUseCase(mockProductRepository, mockQuotationRequestRepository);
  });

  const existingProduct = { id: 'prod-1', quotationRequestId: 'req-1', name: 'Laptop', amount: 5, unitOfMeasurement: 'UNIDAD', description: 'Old Description' };

  it('should throw an error if the product does not exist', async () => {
    mockProductRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('prod-1', 'user-1', {})).rejects.toThrow('El producto que intentas actualizar no existe');
  });

  it('should throw an error if user lacks ownership over parent quotation', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'hacker-user' });

    await expect(useCase.execute('prod-1', 'user-1', {})).rejects.toThrow('No tienes permiso para modificar este producto.');
  });

  it('should throw an error if nothing actually changed', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'user-1' });

    // Passing identical data
    await expect(useCase.execute('prod-1', 'user-1', { name: 'Laptop', amount: 5 })).rejects.toThrow('No se detectaron cambios en los campos enviados.');
  });

  it('should throw an error if repository update fails', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockProductRepository.update.mockResolvedValue(null); // Failure

    await expect(useCase.execute('prod-1', 'user-1', { name: 'New Laptop' })).rejects.toThrow('Error al actualizar el producto.');
  });

  it('should dynamically update fields and return the updated model', async () => {
    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'user-1' });
    
    const updatedModel = { ...existingProduct, name: 'New Laptop', amount: 10 };
    mockProductRepository.update.mockResolvedValue(updatedModel);

    const result = await useCase.execute('prod-1', 'user-1', { name: 'New Laptop', amount: 10 });

    expect(mockProductRepository.update).toHaveBeenCalledWith('prod-1', {
      name: 'New Laptop',
      amount: 10
    });
    expect(result.name).toBe('New Laptop');
    expect(result.amount).toBe(10);
  });
});
