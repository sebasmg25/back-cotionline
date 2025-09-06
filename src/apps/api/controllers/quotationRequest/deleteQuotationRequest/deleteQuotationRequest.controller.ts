import { Request, Response } from 'express';
import { DeleteQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/deleteQuotationRequest.useCase';
import { TypeORMQuotationRequestRepository } from '../../../../../contexts/quotationRequest/infraestructure/persistance/typeorm/typeOrmQuotationRequestRepository';

export class DeleteQuotationRequestController {
  private deleteQuotationRequestUseCase: DeleteQuotationRequestUseCase;

  constructor() {
    const quotationRequestRepository = new TypeORMQuotationRequestRepository();
    this.deleteQuotationRequestUseCase = new DeleteQuotationRequestUseCase(
      quotationRequestRepository
    );
  }
  async deleteQuotationRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteQuotationRequest =
        await this.deleteQuotationRequestUseCase.delete(id);
      res.status(200).json({
        message: 'Solicitud de cotización eliminada exitosamente',
        data: deleteQuotationRequest,
      });
    } catch (error: any) {
      console.log('Error al eliminar la solicitud de cotización', error);
      if (
        error.message.includes(
          'La solicitud de cotización que deseas eliminar no existe'
        )
      ) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }
}
