import { Injectable } from '@nestjs/common';
import { MediaEntity } from './medias/entities/media.entity';
import { MockbaseException } from './mockbase-exception';

/**
 * @author Luciano Stegun
 * Esta classe é um singleton de representação simulada de um banco de dados
 * que armazena as informações de registros em memória durante a execução da aplicação
 * 
 * Contém métodos simples de inclusão, pesquisa, edição e inclusão 
 * e faz uma simples validação de consistência antes de persistir os dados
 */
@Injectable()
export class Mockbase {
  
  private recordCollection: MediaEntity[] = [];
  private records: number = 0;

  public count(): number {
    return this.records;
  }

  public async insert(record: MediaEntity): Promise<MediaEntity> {

    let recordId: number;

    try {
      recordId = (await this.find(record.id)).id;
    } catch (err){
    }finally {
      /**
       * Se dentro do finally a variável recordId possuir um valor
       * vamos considerar que um registro foi encontrado e retornar um exception
       */
      if (recordId !== undefined) {
        throw new MockbaseException(MockbaseException.TYPE_RECORD_EXISTS);
      }
    }

    this.recordCollection.push(record);
    this.records++;

    return Promise.resolve(record);
  }

  public update(id: number, record: MediaEntity): Promise<MediaEntity> {

    let index = this.recordCollection.findIndex(record => record.id == id);

    if (index == -1) {
      throw new MockbaseException(MockbaseException.TYPE_RECORD_NOT_FOUND);
    }

    this.recordCollection[index] = Object.assign(this.recordCollection[index], record);
    
    return Promise.resolve(this.recordCollection[index]);
  }

  public all(): Promise<MediaEntity[]> {
    return Promise.resolve(this.recordCollection);
  }

  public find(id: number): Promise<MediaEntity> {

    let record = this.recordCollection.find(record => record.id == id);

    if (!record) {
      throw new MockbaseException(MockbaseException.TYPE_RECORD_NOT_FOUND);
    }

    return Promise.resolve(record);
  }

  public delete(id: number): Promise<boolean> {

    let index = this.recordCollection.findIndex(record => record.id == id);

    if (index == -1) {
      throw new MockbaseException(MockbaseException.TYPE_RECORD_NOT_FOUND);
    }

    this.recordCollection.splice(index, 1);
    this.records--;

    return Promise.resolve(true);
  }
}
