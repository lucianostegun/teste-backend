import { Test, TestingModule } from '@nestjs/testing';
import { Mockbase } from '../mockbase';
import { CreateMediaDto } from './dto/create-media.dto';
import { Media } from './entities/media.entity';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

const mediaEntityList = [
  new Media({id: 1, name: 'Matrix', expires_at: 1638499119394, watched: false, expired: false}),
  new Media({id: 2, name: 'ToyStory', expires_at: 1938499119394, watched: false, expired: false}),
  new Media({id: 3, name: 'Forrest Gump', expires_at: 1638499119394, watched: false, expired: false}),
];

describe('MediasController', () => {
  let mediaController: MediasController;
  let mediaService: MediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediasController],
      providers: [MediasService, Mockbase]
    }).compile();

    mediaController = module.get<MediasController>(MediasController);
    mediaService    = module.get<MediasService>(MediasService);
  });

  it('should be defined', () => {
    expect(mediaController).toBeDefined();
    expect(mediaService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a media list entity', async () => {
      // Arrange
      
      // Act
      const result = await mediaController.findAll();
      
      // Assert
      expect(result).toEqual([]);
      expect(typeof result).toEqual('object');
    })
  });

  describe('create', () => {
    it('should create a single instance of media entity', async () => {
      // Arrange
      
      // Act
      let createMediaDto = new CreateMediaDto();
      Object.assign(createMediaDto, mediaEntityList[0]);
      let resultCreate = await mediaController.create(createMediaDto);
      expect(resultCreate).toEqual(undefined);

      createMediaDto = new CreateMediaDto();
      Object.assign(createMediaDto, mediaEntityList[1]);
      resultCreate = await mediaController.create(createMediaDto);
      expect(resultCreate).toEqual(undefined);
      
      const resultFindAll = await mediaController.findAll();
      
      // Assert
      expect(resultFindAll).toEqual([mediaEntityList[0], mediaEntityList[1]]);
      expect(typeof resultFindAll).toEqual('object');
    })
  });

  describe('findOne', () => {
    it('should return a single instance of media entity', async () => {
      // Arrange
      
      // Act
      let createMediaDto = new CreateMediaDto();
      Object.assign(createMediaDto, mediaEntityList[0]);
      let resultCreate = await mediaController.create(createMediaDto);
      expect(resultCreate).toEqual(undefined);
      
      createMediaDto = new CreateMediaDto();
      Object.assign(createMediaDto, mediaEntityList[1]);
      resultCreate = await mediaController.create(createMediaDto);
      
      let resultFindOne = await mediaController.findOne('1');
      expect(resultFindOne).toHaveProperty('watched', false);
      expect(resultFindOne).toHaveProperty('expired', true);
      
      resultFindOne = await mediaController.findOne('1');
      expect(resultFindOne).toHaveProperty('watched', true);
      expect(resultFindOne).toHaveProperty('expired', true);
      
      resultFindOne = await mediaController.findOne('2');
      expect(resultFindOne).toHaveProperty('watched', false);
      expect(resultFindOne).toHaveProperty('expired', false);
    })
  });

  describe('update', () => {
    it('should update an instance of media entity and reset the "watched" property', async () => {
      // Arrange
      
      // Act
      let createMediaDto = new CreateMediaDto();
      Object.assign(createMediaDto, mediaEntityList[0]);
      let resultCreate = await mediaController.create(createMediaDto);
      expect(resultCreate).toEqual(undefined);
      
      let resultFindOne = await mediaController.findOne('1');
      expect(resultFindOne).toHaveProperty('watched', false);
      
      resultFindOne = await mediaController.findOne('1');
      expect(resultFindOne).toHaveProperty('watched', true);

      await mediaController.update('1', createMediaDto);
      
      resultFindOne = await mediaController.findOne('1');
      expect(resultFindOne).toHaveProperty('watched', false);
    })
  });
});
