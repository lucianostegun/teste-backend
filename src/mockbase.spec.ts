import { MediaEntity } from './medias/entities/media.entity';
import { Mockbase } from './mockbase';
import * as source from './medias/spec.source.json';
import { MockbaseException } from './mockbase-exception';

const mockbase : Mockbase = new Mockbase();
const recordList : MediaEntity[] = [
  new MediaEntity(source.correct[0]),
  new MediaEntity(source.correct[1]),
  new MediaEntity(source.correct[2]),
];

describe('Mockbase', () => {
  it('should be defined', () => {
    expect(mockbase).toBeDefined();
  });

  it('should be empty', async () => {
    expect(await mockbase.all()).toEqual([]);
    expect(mockbase.count()).toEqual(0);
  });
  
  it('should create a record', async () => {
    
    const resultInsert = await mockbase.insert(new MediaEntity(recordList[0]));
    
    expect(resultInsert).toBeTruthy();
    expect(mockbase.count()).toEqual(1);
  });

  it('should not be empty', async () => {
    expect(await mockbase.all()).toEqual([recordList[0]]);
    expect(mockbase.count()).toEqual(1);
  });

  it('should return single instance of MediaEntity', async () => {

    const resultFind = await mockbase.find(1);

    expect(resultFind).toBeDefined();
    expect(typeof resultFind).toEqual('object');
    expect(resultFind).toEqual(recordList[0]);
  });

  it('should return an exception', () => {

    const resultFind = () => {
      mockbase.find(999)
    };

    expect(resultFind).toThrowError(MockbaseException);
  });

  it('should update a stored instance of MediaEntity', async () => {

    let record : MediaEntity = await mockbase.find(1);

    record.name = 'Brave';

    const resultUpdate = mockbase.update(1, record);
    
    expect(resultUpdate).toBeTruthy();
    expect(mockbase.count()).toEqual(1);

    const resultFind = mockbase.find(1);

    expect(resultFind).toBeDefined();
    expect(typeof resultFind).toEqual('object');
    expect(resultFind).not.toEqual(recordList[0]);
  });

  it('should delete a stored instance of MediaEntity', async () => {

    const resultDelete = await mockbase.delete(1);
    
    expect(resultDelete).toBeTruthy();
    expect(mockbase.count()).toEqual(0);

    const resultFind = () => {
      mockbase.find(1)
    };

    expect(resultFind).toThrowError(MockbaseException);
  });
});
