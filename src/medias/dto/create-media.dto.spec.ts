import { Test, TestingModule } from '@nestjs/testing';
import { CreateMediaDto } from './create-media.dto';
import { ArgumentMetadata, BadRequestException, ValidationPipe, PipeTransform } from '@nestjs/common';
import * as source from '../spec.source.json';

const entityList = [
  // Contém menos informação do que deveria
  source.incorrect.missing[0],

  // Contem campos que não deveriam (watched e expired)
  source.incorrect.unexpected[1],
  
  // Contém todos os campos corretos mas com tipos errados
  source.incorrect.type[2],
  
  // Contém todos os campos e tipos corretos
  source.correct[3],
];

describe('CreateMediaDto', () => {

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    }).compile();
  });

  describe('create with error due of missing fields', () => {
    it('should receive a post with a json object that match with create-media.dto.ts', async () => {
      // Arrange
      let target: ValidationPipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: CreateMediaDto,
        data: ''
      };

      // Act
      await target.transform(entityList[0], metadata).catch(err => {

        // Assert
        expect(err).toBeInstanceOf(BadRequestException)
        expect(err.getResponse().message).toContain('duration should not be empty')
      });
    })
  });
  
  describe('create with error due of unexpected fields', () => {
    it('should receive a post with a json object that contain only specified fields defined at create-media.dto.ts', async () => {
      // Arrange
      let target: ValidationPipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: CreateMediaDto,
        data: ''
      };

      // Act
      await target.transform(entityList[1], metadata).catch(err => {
        // Assert
        expect(err).toBeInstanceOf(BadRequestException)
        expect(err.getResponse().message).toContain('property watched should not exist')
        expect(err.getResponse().message).toContain('property expired should not exist')
      });
    })
  });
  
  describe('create with error due of incorrect field type', () => {
    it('should receive a post with a json object that contain only correct fields types defined at create-media.dto.ts', async () => {
      // Arrange
      let target: ValidationPipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: CreateMediaDto,
        data: ''
      };

      // Act
      await target.transform(entityList[2], metadata).catch(err => {
        // Assert
        expect(err).toBeInstanceOf(BadRequestException)
        expect(err.getResponse().message).toContain('provider_id must be a string')
        expect(err.getResponse().message).toContain('duration must be a number conforming to the specified constraints')
      });
    })
  });

  describe('create with success', () => {
    it('should receive a post with a json object and validate against create-media.dto.ts', async () => {
      // Arrange
      let target: ValidationPipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: CreateMediaDto,
        data: ''
      };

      // Act
      await target.transform(entityList[3], metadata).catch(err => {
        // Assert
        expect(err).toBeUndefined();
      });
    })
  });
});
