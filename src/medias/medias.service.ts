import { Injectable } from '@nestjs/common';
import { Mockbase } from '../mockbase';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';

@Injectable()
export class MediasService {
  
  constructor(
    private mockbase: Mockbase
  ){}

  create(createMediaDto: CreateMediaDto) {
    createMediaDto.watched = false;
    createMediaDto.expired = false;
    
    this.mockbase.insert(new Media(createMediaDto));
  }

  findAll() {
    return this.mockbase.all();
  }

  findOne(id: number) {
    
    const record = {... this.mockbase.find(id)};

    record.expired = (new Date(record.expires_at)) < (new Date());
    
    this.mockbase.update(id, new Media({watched: true}))

    return record;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    updateMediaDto.watched = false;
    delete updateMediaDto.id;
    this.mockbase.update(id, new Media(updateMediaDto));
  }

  remove(id: number) {
    this.mockbase.delete(id);
  }
}
