import { AcceptInvitationUseCase } from '../../../src/contexts/collaborator/useCases/acceptInvitation.useCase';
import { InvitationStatus } from '../../../src/contexts/collaborator/domain/models/collaborator.model';

describe('AcceptInvitationUseCase', () => {
  let useCase: AcceptInvitationUseCase;
  let mockCollaboratorRepo: any;
  let mockNotification: any;

  beforeEach(() => {
    mockCollaboratorRepo = { findById: jest.fn(), update: jest.fn() };
    mockNotification = { execute: jest.fn() };
    useCase = new AcceptInvitationUseCase(mockCollaboratorRepo, mockNotification);
  });

  const validCollab = { id: 'col-1', email: 'test@mail.com', invitationStatus: InvitationStatus.PENDING, userId: 'owner-1' };

  it('should throw error if invitation is not found', async () => {
    mockCollaboratorRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('col-1')).rejects.toThrow('Invitación no encontrada');
  });

  it('should throw error if already accepted', async () => {
    mockCollaboratorRepo.findById.mockResolvedValue({ ...validCollab, invitationStatus: InvitationStatus.ACCEPTED });
    await expect(useCase.execute('col-1')).rejects.toThrow('Esta invitación ya ha sido aceptada anteriormente');
  });

  it('should throw error if update fails', async () => {
    mockCollaboratorRepo.findById.mockResolvedValue(validCollab);
    mockCollaboratorRepo.update.mockResolvedValue(null);
    await expect(useCase.execute('col-1')).rejects.toThrow('No se pudo actualizar el estado de la invitación');
  });

  it('should accept, map, and send notification', async () => {
    mockCollaboratorRepo.findById.mockResolvedValue(validCollab);
    mockCollaboratorRepo.update.mockResolvedValue({ ...validCollab, invitationStatus: InvitationStatus.ACCEPTED });

    const result = await useCase.execute('col-1');
    expect(mockCollaboratorRepo.update).toHaveBeenCalledWith('col-1', { invitationStatus: InvitationStatus.ACCEPTED });
    expect(mockNotification.execute).toHaveBeenCalled();
    expect(result.invitationStatus).toBe(InvitationStatus.ACCEPTED);
  });
});
