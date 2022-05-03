/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { InfluenciadorDTO } from './influenciador.dto';

import { UserDTO } from './user.dto';

/**
 * A EmpresaDTO object.
 */
export class EmpresaDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'nome field' })
    nome: string;

    @ApiModelProperty({ description: 'regiao field', required: false })
    regiao: string;

    @ApiModelProperty({ description: 'nicho field', required: false })
    nicho: string;

    @ApiModelProperty({ description: 'site field', required: false })
    site: string;

    @ApiModelProperty({ type: UserDTO, description: 'user relationship' })
    user: UserDTO;

    @ApiModelProperty({ type: InfluenciadorDTO, isArray: true, description: 'influenciadors relationship' })
    influenciadors: InfluenciadorDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
