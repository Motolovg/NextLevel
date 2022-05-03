/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { EmpresaDTO } from './empresa.dto';

import { UserDTO } from './user.dto';

/**
 * A InfluenciadorDTO object.
 */
export class InfluenciadorDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'nome field' })
    nome: string;

    @ApiModelProperty({ description: 'email field', required: false })
    email: string;

    @ApiModelProperty({ description: 'regiao field', required: false })
    regiao: string;

    @ApiModelProperty({ description: 'bio field', required: false })
    bio: string;

    @ApiModelProperty({ description: 'redes field', required: false })
    redes: string;

    @ApiModelProperty({ type: UserDTO, description: 'user relationship' })
    user: UserDTO;

    @ApiModelProperty({ type: EmpresaDTO, isArray: true, description: 'empresas relationship' })
    empresas: EmpresaDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
