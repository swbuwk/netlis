import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './track/validation.pipe';

async function bootstrap() {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    });
    
  } catch (error) {
    console.log(error)
  }
}
bootstrap();
