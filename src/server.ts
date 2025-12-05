import { Server } from 'http';
import app from './app';
import config from './config';




import mongoose from 'mongoose';

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.info('🛢️  Database is connected successfully');

    const server: Server = app.listen(config.port, () => {
      console.info(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {

      if (server) {
        server.close(() => {
          console.info('Server closed');
        });
      }
      process.exit(1);
    };

    const unexpectedErrorHandler = (error: unknown) => {
      console.log(error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      console.info('SIGTERM received');
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    console.error('Failed to connect database', error);
  }
}

bootstrap();