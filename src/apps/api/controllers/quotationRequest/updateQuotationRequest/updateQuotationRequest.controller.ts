import { Request, Response } from 'express';
import { UpdateQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/updateQuotationRequest.useCase';
import { TypeORMQuotationRequestRepository } from '../../../../../contexts/quotationRequest/infraestructure/persistance/typeorm/typeOrmQuotationRequestRepository';

export class UpdateQuotationRequestController {
  private updateQuotationRequestUseCase: UpdateQuotationRequestUseCase;

  constructor() {
    const quotationRequestRepository = new TypeORMQuotationRequestRepository();
    this.updateQuotationRequestUseCase = new UpdateQuotationRequestUseCase(
      quotationRequestRepository
    );
  }

  async updatedQuotationRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { responseDeadline, status, branch } = req.body;

      if (!responseDeadline && !status && !branch) {
        res.status(400).json({
          message: 'Se debe proporcionar al menos un campo a actualizar',
        });
        return;
      }

      const updatedQuotationRequest =
        await this.updateQuotationRequestUseCase.update(
          id,
          responseDeadline,
          status,
          branch
        );
      res.status(200).json({
        message: 'Solicitud de cotización actualizada exitosamente',
        data: updatedQuotationRequest,
      });
    } catch (error: any) {
      console.log('Error al actualizar el negocio', error);
      if (
        error.message.includes(
          'La solicitud de cotización que deseas actualizar no existe.'
        )
      ) {
        res.status(404).json({ error: error.message });
      } else if (
        error.message.includes(
          'No se detectaron cambios en los campos enviados.'
        )
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }
}
