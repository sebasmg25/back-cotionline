import { Request, Response } from 'express';
import { RegisterQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/registerQuotationRequest.useCase';
import { TypeORMQuotationRequestRepository } from '../../../../../contexts/quotationRequest/infraestructure/persistance/typeorm/typeOrmQuotationRequestRepository';

export class CreateQuotationRequestController {
  private registerQuotationRequestUseCase: RegisterQuotationRequestUseCase;

  constructor() {
    const quotationRequestRepository = new TypeORMQuotationRequestRepository();
    this.registerQuotationRequestUseCase = new RegisterQuotationRequestUseCase(
      quotationRequestRepository
    );
  }

  async registerQuotationRequest(req: Request, res: Response): Promise<void> {
    try {
      const { responseDeadline, status, branch, userId } = req.body;
      const savedQuotationRequest =
        await this.registerQuotationRequestUseCase.save(
          responseDeadline,
          status,
          branch,
          userId
        );

      res.status(201).json({
        message: 'QUOTATION REQUEST',
        savedQuotationRequest,
      });
    } catch (error: any) {
      console.log('Error al crear la solicitud de cotización ', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
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
        await this.registerQuotationRequestUseCase.update(
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
  async deleteQuotationRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteQuotationRequest =
        await this.registerQuotationRequestUseCase.delete(id);
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
