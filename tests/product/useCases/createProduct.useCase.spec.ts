import { CreateProductUseCase } from '../../../src/contexts/product/useCases/createProduct.useCase';
import { Product } from '../../../src/contexts/product/domain/models/product.model';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockProductRepository: any;
  let mockQuotationRequestRepository: any;

  beforeEach(() => {
    mockProductRepository = {
      save: jest.fn()
    };
    mockQuotationRequestRepository = {
      findById: jest.fn()
    };
    useCase = new CreateProductUseCase(mockProductRepository, mockQuotationRequestRepository);
  });

  const validData = {
    name: 'Laptop',
    amount: 5,
    unitOfMeasurement: 'UNIDAD',
    description: 'High end laptop',
    quotationRequestId: 'req-1'
  };

  it('should throw an error if the quotation request does not exist', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(validData as any, 'user-1')).rejects.toThrow('La solicitud de cotización especificada no existe.');
  });

  it('should throw an error if the user does not own the quotation request', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'hacker-user' });
    await expect(useCase.execute(validData as any, 'user-1')).rejects.toThrow('No tienes permiso para agregar productos a esta solicitud.');
  });

  it('should carefully map, save, and return the new product', async () => {
    mockQuotationRequestRepository.findById.mockResolvedValue({ userId: 'user-1' });
    
    const savedProduct = new Product(validData.name, validData.amount, validData.unitOfMeasurement as any, validData.description, validData.quotationRequestId);
    Object.assign(savedProduct, { id: 'prod-1' });

    mockProductRepository.save.mockResolvedValue(savedProduct);

    const result = await useCase.execute(validData as any, 'user-1');

    expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('prod-1');
    expect(result.name).toBe('Laptop');
  });
});
