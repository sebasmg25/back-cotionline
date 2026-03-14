import 'reflect-metadata'; // Importante para TypeORM
import dotenv from 'dotenv';
import { App } from './app';
import { AppDataSource } from './contexts/shared/infraestructure/config/database'; // Importar la configuración de la DB
import { EnvConfig } from './contexts/shared/infraestructure/env/envConfig'; // Importar la configuración de entorno

import { TypeORMPlanRepository } from './contexts/subscription/infraestructure/persistance/typeorm/typeOrmPlanRepository';
import { SeedPlansUseCase } from './contexts/subscription/useCases/seedPlans.useCase';
import { WompiSignatureService } from './contexts/shared/infraestructure/payment/wompiSignature.service';



dotenv.config(); // Cargar variables de entorno

async function bootstrap() {
  try {
    EnvConfig.load(); // Cargar configuración de entorno
    console.log('✅ Llave pública cargada:', EnvConfig.get('WOMPI_PUBLIC_KEY'));


    await AppDataSource.initialize();
    console.log('Base de datos conectada correctamente!');

    // Limpieza de índice único residual en products (Fix 500 Bug)
    try {
      const indexes = await AppDataSource.query("SHOW INDEXES FROM products WHERE Key_name != 'PRIMARY'");
      for (const idx of indexes) {
        if (idx.Column_name === 'name' && idx.Non_unique === 0) {
          console.log('🚨 Eliminando índice único residual en products.name:', idx.Key_name);
          await AppDataSource.query(`ALTER TABLE products DROP INDEX ${idx.Key_name}`);
        }
      }
    } catch(e) { console.error('Error limpiando indices:', e); }


    const planRepository = new TypeORMPlanRepository();
    const seedPlansUseCase = new SeedPlansUseCase(planRepository);
    await seedPlansUseCase.execute();
    console.log('✅ Planes de suscripción inicializados');

    // PRUEBAS DE FIRMA WOMPI (SOLO DESARROLLO)
    // --------------------------
    /*
    const testReference = 'test_123';
    const testAmount = 5000000;
    const testCurrency = 'COP';
    const testIntegritySecret = EnvConfig.get('WOMPI_INTEGRITY_SECRET');

    const testSignature = WompiSignatureService.generateIntegritySignature(
      testReference,
      testAmount,
      testCurrency,
      testIntegritySecret
    );
    console.log('✅ Firma generada para Wompi:', testSignature);
    */
    // --------------------------

    const app = new App().getApp();
    const port = EnvConfig.get('PORT') || 3000;

    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
      console.log(`Accede a http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
