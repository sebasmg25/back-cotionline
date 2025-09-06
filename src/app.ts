import express, { Application } from 'express';
import { userRoutes } from './apps/api/routes/user/userRoutes';
import { businessRoutes } from './apps/api/routes/business/businessRoutes';
import cors from 'cors';
import bodyParser from 'body-parser';
import { quotationRequestRoutes } from './apps/api/routes/quotationRequest/quotationRequestRoutes';
import { branchRoutes } from './apps/api/routes/branchRoutes';
// Aquí importarías tus rutas
// import { userRoutes } from './infrastructure/api/routes/userRoutes';

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(bodyParser.json()); // Habilitar el parsing de JSON en las peticiones
    // Otros middlewares como CORS, morgan para logging, etc.
  }

  private setupRoutes(): void {
    // Ejemplo de ruta de bienvenida
    this.app.get('/', (req, res) => {
      res.send(
        '¡Bienvenido a mi API Backend con TypeScript, Express y TypeORM!'
      );
    });

    this.app.use('/users', userRoutes);
    this.app.use('/business', businessRoutes);
    this.app.use('/quotationRequests', quotationRequestRoutes);
    this.app.use('/branches', branchRoutes);

    // this.app.use('/users', userRoutes); // Descomenta cuando crees tus rutas de usuario
  }

  public getApp(): Application {
    return this.app;
  }
}
