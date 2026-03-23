import { DeleteBranchUseCase } from '../../../src/contexts/branch/useCases/deleteBranch.useCase';

describe('DeleteBranchUseCase', () => {
  let useCase: DeleteBranchUseCase;
  let mockBranchRepository: any;
  let mockBusinessRepository: any;
  let mockQuotationRequestRepository: any;

  beforeEach(() => {
    mockBranchRepository = {
      findById: jest.fn(),
      delete: jest.fn()
    };
    mockBusinessRepository = {
      findById: jest.fn()
    };
    mockQuotationRequestRepository = {
      countActiveByBranchId: jest.fn() // The new dependency in delete branch
    };
    useCase = new DeleteBranchUseCase(mockBranchRepository, mockBusinessRepository, mockQuotationRequestRepository);
  });

  it('should throw an error if branch does not exist', async () => {
    mockBranchRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('branch-1', 'user-1')).rejects.toThrow('Sede no encontrada.');
  });

  it('should throw an error if business is not found or user is not the owner', async () => {
    mockBranchRepository.findById.mockResolvedValue({ businessId: 'bus-1' });
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'other-user' });
    await expect(useCase.execute('branch-1', 'user-1')).rejects.toThrow('No tienes permiso para eliminar esta sede.');
  });

  it('should throw an error if branch has active quotation requests', async () => {
    mockBranchRepository.findById.mockResolvedValue({ businessId: 'bus-1' });
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockQuotationRequestRepository.countActiveByBranchId.mockResolvedValue(2); // 2 active requests

    await expect(useCase.execute('branch-1', 'user-1')).rejects.toThrow('No se puede eliminar esta sede porque tiene solicitudes de cotización activas.');
  });

  it('should throw an error if branch repository deletion fails', async () => {
    mockBranchRepository.findById.mockResolvedValue({ businessId: 'bus-1' });
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockQuotationRequestRepository.countActiveByBranchId.mockResolvedValue(0);
    mockBranchRepository.delete.mockResolvedValue(false); // DB Failure

    await expect(useCase.execute('branch-1', 'user-1')).rejects.toThrow('Error al eliminar la sede.');
  });

  it('should successfully delete and return branch data', async () => {
    const branchMeta = { id: 'branch-1', businessId: 'bus-1', name: 'Branch A' };
    mockBranchRepository.findById.mockResolvedValue(branchMeta);
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockQuotationRequestRepository.countActiveByBranchId.mockResolvedValue(0);
    mockBranchRepository.delete.mockResolvedValue(true);

    const result = await useCase.execute('branch-1', 'user-1');

    expect(mockBranchRepository.delete).toHaveBeenCalledWith('branch-1');
    expect(result.name).toBe('Branch A');
    expect(result.id).toBe('branch-1');
  });
});
