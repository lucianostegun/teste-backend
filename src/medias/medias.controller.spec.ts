import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Mockbase } from '../mockbase';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaEntity } from './entities/media.entity';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import * as source from './spec.source.json';

const mediaEntityList : MediaEntity[] = [
  new MediaEntity(source.correct[0]),
  new MediaEntity(source.correct[1]),
  new MediaEntity(source.correct[2]),
  new MediaEntity(source.correct[3]),
];

describe('MediasController', () => {
  
  let mediaController: MediasController;
  let mediaService: MediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediasController],
      providers: [
        {
          provide: MediasService,
          useValue: {
            create: jest.fn().mockReturnValue(mediaEntityList[0]),
            findAll: jest.fn().mockReturnValue(mediaEntityList),
            findOne: jest.fn().mockReturnValue(mediaEntityList[0]),
            update: jest.fn(),
            remove: jest.fn(),
          }
        }, Mockbase]
    }).compile();

    mediaController = module.get<MediasController>(MediasController);
    mediaService    = module.get<MediasService>(MediasService);
  });

  it('should be defined', () => {
    expect(mediaController).toBeDefined();
    expect(mediaService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a media entity list', async () => {
      // Arrange
      
      // Act
      const result = await mediaController.findAll();
      
      // Assert
      expect(result).toEqual(mediaEntityList);
    })
  });

  describe('create', () => {
    it('should create a single instance of media entity', async () => {
      // Arrange
      
      // Act
      let createMediaDto = new CreateMediaDto();
      Object.assign(createMediaDto, mediaEntityList[0]);

      let result = await mediaController.create(createMediaDto);
      expect(result).toEqual(mediaEntityList[0]);
    });
  });

  describe('findOne', () => {
    it('should return a single instance of media entity', async () => {
      // Arrange
      
      // Act
      const result = await mediaController.findOne('1');
      expect(result).toEqual(mediaEntityList[0]);
      expect(result).toHaveProperty('watched', false);
      expect(result).toHaveProperty('expired', false);
    })
  });

  describe('update', () => {
    it('should update an instance of media entity', async () => {
      // Arrange
      
      // Act
      let createMediaDto : CreateMediaDto = new CreateMediaDto();
      
      Object.assign(createMediaDto, mediaEntityList[0]);

      let result = await mediaController.create(createMediaDto);

      expect(result).toEqual(mediaEntityList[0]);
    });
  });
  
  describe('delete', () => {
    it('should delete an instance of media entity', async () => {
      // Arrange
      
      // Act
      let result = await mediaController.remove('1');

      expect(result).toBeUndefined();
    });
  });
});
