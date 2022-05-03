import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { InfluenciadorDTO } from '../service/dto/influenciador.dto';
import { InfluenciadorMapper } from '../service/mapper/influenciador.mapper';
import { InfluenciadorRepository } from '../repository/influenciador.repository';

const relationshipNames = [];

@Injectable()
export class InfluenciadorService {
    logger = new Logger('InfluenciadorService');

    constructor(@InjectRepository(InfluenciadorRepository) private influenciadorRepository: InfluenciadorRepository) {}

    async findById(id: number): Promise<InfluenciadorDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.influenciadorRepository.findOne(id, options);
        return InfluenciadorMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<InfluenciadorDTO>): Promise<InfluenciadorDTO | undefined> {
        const result = await this.influenciadorRepository.findOne(options);
        return InfluenciadorMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<InfluenciadorDTO>): Promise<[InfluenciadorDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.influenciadorRepository.findAndCount(options);
        const influenciadorDTO: InfluenciadorDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(influenciador =>
                influenciadorDTO.push(InfluenciadorMapper.fromEntityToDTO(influenciador)),
            );
            resultList[0] = influenciadorDTO;
        }
        return resultList;
    }

    async save(influenciadorDTO: InfluenciadorDTO, creator?: string): Promise<InfluenciadorDTO | undefined> {
        const entity = InfluenciadorMapper.fromDTOtoEntity(influenciadorDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.influenciadorRepository.save(entity);
        return InfluenciadorMapper.fromEntityToDTO(result);
    }

    async update(influenciadorDTO: InfluenciadorDTO, updater?: string): Promise<InfluenciadorDTO | undefined> {
        const entity = InfluenciadorMapper.fromDTOtoEntity(influenciadorDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.influenciadorRepository.save(entity);
        return InfluenciadorMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.influenciadorRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
