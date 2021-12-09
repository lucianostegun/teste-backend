import { IsEmpty, IsInt, IsNotEmpty, IsNumber, IsString, validate } from 'class-validator';
import { MediaEntity } from '../entities/media.entity';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsString()
  provider: string;

  @IsNotEmpty()
  @IsString()
  media_type: string;

  @IsNotEmpty()
  @IsString()
  provider_id: string;

  @IsNotEmpty()
  @IsInt()
  expires_at: number;


  constructor(media?: Partial<MediaEntity>) {
    
    this.id          = media?.id;
    this.name        = media?.name;
    this.duration    = media?.duration;
    this.provider    = media?.provider;
    this.media_type  = media?.media_type;
    this.provider_id = media?.provider_id;
    this.expires_at  = media?.expires_at;
  }
}
