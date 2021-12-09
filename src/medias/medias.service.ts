import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MockbaseException } from '../mockbase-exception';
import { Mockbase } from '../mockbase';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaEntity } from './entities/media.entity';
import { _ } from 'lodash';

/**
 * @author Luciano Stegun
 * CRUD padrão que utiliza a classe Mockbase para armazenar as informações em memória
 */
@Injectable()
export class MediasService {
  
  constructor(
    private readonly mockbase: Mockbase
  ){}

  async create(createMediaDto: CreateMediaDto) {

    let media = new MediaEntity(createMediaDto);
    
    try {
      await this.mockbase.insert(media);
    } catch (err) {
      if (typeof(err) == 'object' && err instanceof MockbaseException && err.isType(MockbaseException.TYPE_RECORD_EXISTS)) {
        throw new BadRequestException(`Item ${createMediaDto.id} already exists`);
      } else {
        throw new InternalServerErrorException(`Unexpected error while saving record`);
      }
    }

    return media;
  }

  async findAll() {
    try {
      return await this.mockbase.all();
    } catch (err) {
      throw new InternalServerErrorException(`Unexpected error while searching records`);
    }
  }

  async findOne(id: number) {
    
    /**
     * @author Luciano Stegun
     * Aqui estou utilizando lodash.clone para criar uma cópia do objeto que é retornado do repositório
     * pois se utilizar o objeto direto a informação do campo "watched" irá sempre retornar "true"
     * já que pelo uso de referêcia do javascript essa informação será sobrescrita após a atualização
     * do registro no repositório.
     */
    let record;

    try {
      record = _.clone(await this.mockbase.find(id));
    } catch (err) {
      if (typeof(err) == 'object' && err instanceof MockbaseException && err.isType(MockbaseException.TYPE_RECORD_NOT_FOUND)) {
        throw new NotFoundException(`Item ${id} not found`);
      } else {
        throw new InternalServerErrorException(`Unexpected error while finding record`);
      }
    }

    record.expired = (new Date(record.expires_at)) < (new Date());
    
    if (!record.watched) {
      this.mockbase.update(id, new MediaEntity({watched: true}))
    }

    return record;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    
    let media: MediaEntity = new MediaEntity(updateMediaDto);
    media.watched = false;

    try {
      delete updateMediaDto.id;
      return await this.mockbase.update(id, media);
    } catch (err) {
      if (typeof(err) == 'object' && err instanceof MockbaseException && err.isType(MockbaseException.TYPE_RECORD_NOT_FOUND)) {
        throw new NotFoundException(`Item ${id} not found`);
      } else {
        throw new InternalServerErrorException(`Unexpected error while updating record`);
      }
    }
  }

  async remove(id: number) {
    try {
      await this.mockbase.delete(id);
    } catch (err) {
      if (typeof(err) == 'object' && err instanceof MockbaseException && err.isType(MockbaseException.TYPE_RECORD_NOT_FOUND)) {
        throw new NotFoundException(`Item ${id} not found`);
      } else {
        throw new InternalServerErrorException(`Unexpected error while deleting record`);
      }
    }
  }
}
