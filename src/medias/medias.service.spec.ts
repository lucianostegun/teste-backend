import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Mockbase } from '../mockbase';
import { MediaEntity } from './entities/media.entity';
import { MediasService } from './medias.service';
import * as source from './spec.source.json';
import { CreateMediaDto } from './dto/create-media.dto';
import { MockbaseException } from '../mockbase-exception';

const mediaEntityList : MediaEntity[] = [
  new MediaEntity(source.correct[0]),
  new MediaEntity(source.correct[1]),
  new MediaEntity(source.correct[2]),
  new MediaEntity(source.correct[3]),
];

describe('MediasService', () => {
  let mediaService: MediasService;
  let mockbase: Mockbase;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediasService,
        {
          provide: Mockbase,
          useValue: {
            insert: jest.fn().mockReturnValue(mediaEntityList[0]),
            update: jest.fn().mockResolvedValue(mediaEntityList[0]),
            all: jest.fn().mockResolvedValue(mediaEntityList),
            find: jest.fn().mockResolvedValue(mediaEntityList[0]),
            delete: jest.fn().mockReturnValue(true),
          }
        }
      ],
    }).compile();

    mediaService = module.get<MediasService>(MediasService);
    mockbase = module.get<Mockbase>(Mockbase);
  });

  it('should be defined', () => {
    expect(mediaService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of media successfuly', async () => {
      // Act
      const result = await mediaService.findAll();

      expect(result).toEqual(mediaEntityList);
      expect(mockbase.all).toHaveBeenCalledTimes(1);
    });

    /**
     * Não sei se é problema na minha versão de desenvolvimento
     * mas a função mockRejectedValueOnce(new Error()); está retornando um erro de sintaxe dizendo que
     * Argument of type 'Error' is not assignable to parameter of type 'never'
     * 
     */
    it('should return an exception', () => {
      // Arrange
      jest.spyOn(mockbase, 'all').mockRejectedValueOnce(new Error());

      // Assert
      expect(mediaService.findAll()).rejects.toThrowError(InternalServerErrorException)
    });
  });
  
  describe('findOne', () => {
    it('should return a single instance of media successfuly', async () => {
      // Act
      const result = await mediaService.findOne(1);

      // Assert
      expect(result).toEqual(mediaEntityList[0]);
      expect(mockbase.find).toHaveBeenCalledTimes(1);
    });

    it('should return an exception', () => {
      // Arrange
      jest.spyOn(mockbase, 'find').mockRejectedValueOnce(new MockbaseException(MockbaseException.TYPE_RECORD_NOT_FOUND));

      // Assert
      expect(mediaService.findOne(999)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a media successfuly', async () => {
      // Act
      const createMediaDto : CreateMediaDto = source.correct[0];
      const result = await mediaService.create(createMediaDto);

      // Assert
      expect(result).toEqual(mediaEntityList[0]);
      expect(mockbase.insert).toHaveBeenCalledTimes(1);
    });

    it('should return an BadRequestException', () => {
      // Arrange
      jest.spyOn(mockbase, 'insert').mockRejectedValueOnce(new MockbaseException(MockbaseException.TYPE_RECORD_EXISTS));
      const createMediaDto : CreateMediaDto = source.correct[0];

      // Assert
      expect(mediaService.create(createMediaDto)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a media successfuly', async () => {
      // Act
      const createMediaDto : CreateMediaDto = source.correct[0];
      const result = await mediaService.update(createMediaDto.id, createMediaDto);

      // Assert
      expect(result).toEqual(mediaEntityList[0]);
      expect(mockbase.update).toHaveBeenCalledTimes(1);
    });

    it('should return an NotFoundException', () => {
      // Arrange
      jest.spyOn(mockbase, 'update').mockRejectedValueOnce(new MockbaseException(MockbaseException.TYPE_RECORD_NOT_FOUND));
      const createMediaDto : CreateMediaDto = source.correct[0];

      // Assert
      expect(mediaService.update(999, createMediaDto)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a media successfuly', async () => {
      // Act
      const result = await mediaService.remove(source.correct[0].id);

      // Assert
      expect(result).toBeUndefined();
      expect(mockbase.delete).toHaveBeenCalledTimes(1);
    });

    it('should return an NotFoundException', () => {
      // Arrange
      jest.spyOn(mockbase, 'delete').mockRejectedValueOnce(new MockbaseException(MockbaseException.TYPE_RECORD_NOT_FOUND));

      // Assert
      expect(mediaService.remove(999)).rejects.toThrowError(NotFoundException);
    });
  });
});
