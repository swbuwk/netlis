import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import * as cookieParser from 'cookie-parser';
import { ServerExceptionFilter } from './server-exception.filter';

async function bootstrap() {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, {cors: {origin: "http://localhost:3000", credentials: true }});
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe())
    app.useGlobalFilters(new ServerExceptionFilter())
    await app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    });
    
  } catch (error) {
    console.log(error)
  }
}
bootstrap();
