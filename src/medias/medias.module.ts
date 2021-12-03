import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { Mockbase } from 'src/mockbase';

@Module({
  controllers: [MediasController],
  providers: [MediasService, Mockbase]
})
export class MediasModule {}
