/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Influenciador } from './influenciador.entity';

import { User } from './user.entity';

/**
 * A Empresa.
 */
@Entity('empresa')
export class Empresa extends BaseEntity {
    @Column({ name: 'nome' })
    nome: string;

    @Column({ name: 'regiao', nullable: true })
    regiao: string;

    @Column({ name: 'nicho', nullable: true })
    nicho: string;

    @Column({ name: 'site', nullable: true, unique: true })
    site: string;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @ManyToMany(type => Influenciador)
    @JoinTable({
        name: 'rel_empresa__influenciador',
        joinColumn: { name: 'empresa_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'influenciador_id', referencedColumnName: 'id' },
    })
    influenciadors: Influenciador[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
