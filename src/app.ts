import express, { Application } from 'express';
import path from 'path'; // 1. Importante para manejar rutas de carpetas
import cors from 'cors';
import bodyParser from 'body-parser';

import { userRoutes } from './apps/api/routes/user/userRoutes';
import { businessRoutes } from './apps/api/routes/business/businessRoutes';
import { quotationRequestRoutes } from './apps/api/routes/quotationRequest/quotationRequestRoutes';
import { branchRoutes } from './apps/api/routes/branch/branchRoutes';
import { productRoutes } from './apps/api/routes/product/productRoutes';
import { quotationRoutes } from './apps/api/routes/quotation/quotationRoutes';
import { collaboratorRoutes } from './apps/api/routes/collaborator/collaboratorRoutes';
import { notificationRoutes } from './apps/api/routes/notification/notificationRoutes';
import { subscriptionRoutes } from './apps/api/routes/subscription/planRoutes';

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(bodyParser.json());

    // 2. HACER PÚBLICA LA CARPETA UPLOADS
    // Esto permite que si entras a http://localhost:3000/uploads/archivo.pdf, el navegador lo abra.
    this.app.use(
      '/uploads',
      express.static(path.join(process.cwd(), 'uploads')),
    );
  }

  private setupRoutes(): void {
    this.app.get('/', (req, res) => {
      res.send(
        '¡Bienvenido a mi API Backend con TypeScript, Express y TypeORM!',
      );
    });

    this.app.use('/users', userRoutes);
    this.app.use('/businesses', businessRoutes);
    this.app.use('/quotationRequests', quotationRequestRoutes);
    this.app.use('/branches', branchRoutes);
    this.app.use('/products', productRoutes);
    this.app.use('/quotations', quotationRoutes);
    this.app.use('/collaborators', collaboratorRoutes);
    this.app.use('/notifications', notificationRoutes);
    this.app.use('/subscriptions', subscriptionRoutes);
  }

  public getApp(): Application {
    return this.app;
  }
}
