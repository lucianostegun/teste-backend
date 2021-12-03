import { Module } from '@nestjs/common';
import { MediasModule } from './medias/medias.module';

@Module({
  imports: [MediasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
