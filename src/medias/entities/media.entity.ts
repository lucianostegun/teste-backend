export class MediaEntity {
  id: number;
  name: string;
  duration: number;
  provider: string;
  media_type: string;
  provider_id: string;
  expires_at: number;
  watched: boolean;
  expired: boolean;

  constructor(props: Object) {
    Object.assign(this, props);

    if (!props.hasOwnProperty('watched')) {
      this.watched = false;
    }

    if (!props.hasOwnProperty('expired')) {
      this.expired = false;
    }
  }
}
