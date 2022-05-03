import { Empresa } from '../../domain/empresa.entity';
import { EmpresaDTO } from '../dto/empresa.dto';

/**
 * A Empresa mapper object.
 */
export class EmpresaMapper {
    static fromDTOtoEntity(entityDTO: EmpresaDTO): Empresa {
        if (!entityDTO) {
            return;
        }
        const entity = new Empresa();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Empresa): EmpresaDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new EmpresaDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
