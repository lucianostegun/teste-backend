export class CreateMediaDto {
  id: number;
  name: string;
  duration: number;
  provider: string;
  media_type: string;
  provider_id: string;
  expires_at: Date;
  watched: boolean;
  expired: boolean;
}
