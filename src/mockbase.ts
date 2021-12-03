import { Injectable } from '@nestjs/common';
import { Media } from './medias/entities/media.entity';

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
  
  private recordCollection: Media[] = [];
  private records: number = 0;

  public count(): number {
    return this.records;
  }

  public insert(record: Media): boolean {

    let recordId: number;

    try {
      recordId = this.find(record.id).id;
    } catch (err){}
    finally {
      if (recordId) {
        throw 'Media exists';
      }
    }

    this.recordCollection.push(record);
    this.records++;

    return true;
  }

  public update(id: number, record: Media): Media {

    let index = this.recordCollection.findIndex(record => record.id == id);

    if (index == -1) {
      throw 'Not found';
    }

    this.recordCollection[index] = Object.assign(this.recordCollection[index], record);
    
    return this.recordCollection[index];
  }

  public all(): Media[] {

    return this.recordCollection;
  }

  public find(id: number): Media {

    let record = this.recordCollection.find(record => record.id == id);

    if (!record) {
      throw 'Not found';
    }

    return record;
  }

  public delete(id: number): boolean {

    let index = this.recordCollection.findIndex(record => record.id == id);

    if (index == -1) {
      throw 'Not found';
    }

    this.recordCollection.splice(index, 1);
    this.records--;

    return true;
  }
}
