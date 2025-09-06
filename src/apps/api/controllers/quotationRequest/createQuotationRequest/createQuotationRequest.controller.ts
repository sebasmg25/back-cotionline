import { Request, Response } from 'express';
import { RegisterQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/registerQuotationRequest.useCase';
import { TypeORMQuotationRequestRepository } from '../../../../../contexts/quotationRequest/infraestructure/persistance/typeorm/typeOrmQuotationRequestRepository';
import {
  QuotationRequestDto,
  QuotationRequestResponseDto,
} from '../../../../../contexts/quotationRequest/interfaces/dtos/quotationRequestResponse.dto';

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
      const quotationRequestData = new QuotationRequestDto(
        responseDeadline,
        status,
        branch,
        userId
      );
      const savedQuotationRequest =
        await this.registerQuotationRequestUseCase.save(
          quotationRequestData
          // responseDeadline,
          // status,
          // branch,
          // userId
        );

      const responseDto = QuotationRequestResponseDto.toDto(
        savedQuotationRequest
      );

      res.status(201).json({
        message: 'QUOTATION REQUEST',
        responseDto,
      });
    } catch (error: any) {
      console.log('Error al crear la solicitud de cotización ', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
