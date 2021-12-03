import { Media } from './medias/entities/media.entity';
import { Mockbase } from './mockbase';

const mockbase = new Mockbase();
const recordList = [
  new Media({id: '1', name: 'Matrix'}),
  new Media({id: '2', name: 'Toy Story'}),
  new Media({id: '3', name: 'Forrest Gump'}),
];

describe('Mockbase', () => {
  it('should be defined', () => {
    expect(mockbase).toBeDefined();
  });

  it('should be empty', () => {
    expect(mockbase.all()).toEqual([]);
    expect(mockbase.count()).toEqual(0);
  });
  
  it('should create a record', () => {
    
    const resultInsert = mockbase.insert(new Media(recordList[0]));
    
    expect(resultInsert).toBeTruthy();
    expect(mockbase.count()).toEqual(1);
  });

  it('should not be empty', () => {
    expect(mockbase.all()).toEqual([recordList[0]]);
    expect(mockbase.count()).toEqual(1);
  });

  it('should return single instance of Media', () => {

    const resultFind = mockbase.find(1);

    expect(resultFind).toBeDefined();
    expect(typeof resultFind).toEqual('object');
    expect(resultFind).toEqual(recordList[0]);
  });

  it('should return a exception', () => {

    const resultFind = () => {
      mockbase.find(2)
    };

    expect(resultFind).toThrowError()
  });

  it('should update a stored instance of Media', () => {

    let record : Media = mockbase.find(1);

    record.name = 'Brave';

    const resultUpdate = mockbase.update(1, record);
    
    expect(resultUpdate).toBeTruthy();
    expect(mockbase.count()).toEqual(1);

    const resultFind = mockbase.find(1);

    expect(resultFind).toBeDefined();
    expect(typeof resultFind).toEqual('object');
    expect(resultFind).not.toEqual(recordList[0]);
  });

  it('should delete a stored instance of Media', () => {

    const resultDelete = mockbase.delete(1);
    
    expect(resultDelete).toBeTruthy();
    expect(mockbase.count()).toEqual(0);

    const resultFind = () => {
      mockbase.find(1)
    };

    expect(resultFind).toThrowError();
  });
});
