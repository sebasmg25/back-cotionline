import { QuotationRequestStatus } from '../domain/models/quotationRequest.model';
import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';
import { QuotationRepository } from '../../quotation/domain/repositories/quotation.repository'; // Importante
import { SendNotificationUseCase } from '../../notification/useCases/sendNotification.useCase';
import { NotificationType } from '../../notification/domain/models/notification.model';
import { QuotationStatus } from '../../quotation/domain/models/quotation.model';

export class CloseQuotationRequestUseCase {
  constructor(
    private quotationRequestRepository: QuotationRequestRepository,
    private quotationRepository: QuotationRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  async execute(
    id: string,
    userIdSession: string,
    selectedOfferId: string,
  ): Promise<void> {

    const request = await this.quotationRequestRepository.findById(id);

    if (!request || request.userId !== userIdSession) {
      throw new Error(
        'No tienes permiso para cerrar esta solicitud o no existe.',
      );
    }


    if (request.status === QuotationRequestStatus.EXPIRED) {
      throw new Error('No puedes cerrar una solicitud que ya ha expirado.');
    }
    if (request.status === QuotationRequestStatus.CLOSED) {
      throw new Error('Esta solicitud ya se encuentra cerrada.');
    }


    const selectedQuotation =
      await this.quotationRepository.findById(selectedOfferId);
    if (!selectedQuotation) {
      throw new Error('La cotización seleccionada no existe.');
    }

    if (selectedQuotation.quotationRequestId !== id) {
      throw new Error(
        'La cotización seleccionada no pertenece a esta solicitud.',
      );
    }


    await this.quotationRequestRepository.update(id, {
      status: QuotationRequestStatus.CLOSED,
    });

    const allQuotations = await this.quotationRepository.findByQuotationRequestId(id);
    for (const q of allQuotations) {
      if (q.id === selectedOfferId) {
        await this.quotationRepository.update(q.id!, { status: QuotationStatus.ACCEPTED });
      } else {
        await this.quotationRepository.update(q.id!, { status: QuotationStatus.EXPIRED }); // 'Rechazada' o expirada implicitamente
      }
    }


    try {
      await this.sendNotificationUseCase.execute(
        NotificationType.TRANSACTIONAL,
        '¡Cotización Seleccionada!',
        `Tu oferta para la solicitud "${request.title}" ha sido aceptada.`,
        `/dashboard/quotation-management/detail/${selectedOfferId}`,
        selectedQuotation.userId,
      );
    } catch (error) {
      console.error(
        '[CloseQuotationRequestUseCase] Error de notificación:',
        error,
      );
    }
  }
}
