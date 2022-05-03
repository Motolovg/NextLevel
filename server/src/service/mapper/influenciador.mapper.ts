import { Influenciador } from '../../domain/influenciador.entity';
import { InfluenciadorDTO } from '../dto/influenciador.dto';

/**
 * A Influenciador mapper object.
 */
export class InfluenciadorMapper {
    static fromDTOtoEntity(entityDTO: InfluenciadorDTO): Influenciador {
        if (!entityDTO) {
            return;
        }
        const entity = new Influenciador();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Influenciador): InfluenciadorDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new InfluenciadorDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
