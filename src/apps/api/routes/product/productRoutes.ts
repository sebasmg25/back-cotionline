import { Router, Request, Response } from 'express';

// Infraestructura
import { TypeORMProductRepository } from '../../../../contexts/product/infraestructure/persistance/typeorm/typeOrmProductRepository';
import { TypeORMQuotationRequestRepository } from '../../../../contexts/quotationRequest/infraestructure/persistance/typeorm/typeOrmQuotationRequestRepository';

// Casos de Uso
import { CreateProductUseCase } from '../../../../contexts/product/useCases/createProduct.useCase';
import { UpdateProductUseCase } from '../../../../contexts/product/useCases/updateProduct.useCase';
import { GetProductUseCase } from '../../../../contexts/product/useCases/getProduct.useCase';
import { DeleteProductUseCase } from '../../../../contexts/product/useCases/deleteProduct.useCase';
import { GetProductsByQuotationRequestIdUseCase } from '../../../../contexts/product/useCases/getProductsByQuotationRequestId.useCase';

// Controladores
import { CreateProductController } from '../../controllers/product/createProduct/createProduct.controller';
import { UpdateProductController } from '../../controllers/product/updateProduct/updateProduct.controller';
import { GetProductController } from '../../controllers/product/getProduct/getProduct.controller';
import { DeleteProductController } from '../../controllers/product/deleteProduct/deleteProduct.controller';
import { GetProductsByQuotationRequestIdController } from '../../controllers/product/getProductsByQuotationRequestId/getProductsByQuotationRequestId.controller';

// Middlewares y Validadores
import { RequestValidator } from '../../middlewares/validateRequest';
import { JwtVerifier, AuthRequest } from '../../middlewares/jwtVerifier';
import { BusinessStatusValidator } from '../../middlewares/businessStatus';
import { createProductValidationRules } from '../../controllers/product/createProduct/createProduct.validator';
import { updateProductValidationRules } from '../../controllers/product/updateProduct/updateProduct.validator';

const router = Router();

// 1. Instanciar Infraestructura
const productRepo = new TypeORMProductRepository();
const quotationRepo = new TypeORMQuotationRequestRepository();

// 2. Instanciar Casos de Uso
const createUseCase = new CreateProductUseCase(productRepo, quotationRepo);
const updateUseCase = new UpdateProductUseCase(productRepo, quotationRepo);
const getUseCase = new GetProductUseCase(productRepo, quotationRepo);
const deleteUseCase = new DeleteProductUseCase(productRepo, quotationRepo);
const getByQuotationUseCase = new GetProductsByQuotationRequestIdUseCase(
  productRepo,
  quotationRepo,
);

// 3. Instanciar Controladores
const createCtrl = new CreateProductController(createUseCase);
const updateCtrl = new UpdateProductController(updateUseCase);
const getCtrl = new GetProductController(getUseCase);
const deleteCtrl = new DeleteProductController(deleteUseCase);
const getByQuotationCtrl = new GetProductsByQuotationRequestIdController(
  getByQuotationUseCase,
);

// --- 4. Definición de Rutas ---

/**
 * Listar productos de una cotización
 * CORRECCIÓN: Se agrega BusinessStatusValidator para bloqueo total.
 */
router.get(
  '/quotation-request/:quotationRequestId',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, // <--- Agregado
  (req: Request, res: Response) =>
    getByQuotationCtrl.handle(req as AuthRequest, res),
);

/**
 * Creación de producto
 */
router.post(
  '/quotation-request/:quotationRequestId',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  createProductValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => createCtrl.handle(req as AuthRequest, res),
);

/**
 * Ver detalle de un producto
 * CORRECCIÓN: Se agrega BusinessStatusValidator.
 */
router.get(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler, // <--- Agregado
  (req: Request, res: Response) => getCtrl.handle(req as AuthRequest, res),
);

/**
 * Actualización
 */
router.patch(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  updateProductValidationRules,
  RequestValidator.handle,
  (req: Request, res: Response) => updateCtrl.handle(req as AuthRequest, res),
);

/**
 * Eliminación
 */
router.delete(
  '/:id',
  JwtVerifier.handler,
  BusinessStatusValidator.handler,
  (req: Request, res: Response) => deleteCtrl.handle(req as AuthRequest, res),
);

export const productRoutes = router;
