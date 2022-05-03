/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Empresa } from './empresa.entity';

import { User } from './user.entity';

/**
 * A Influenciador.
 */
@Entity('influenciador')
export class Influenciador extends BaseEntity {
    @Column({ name: 'nome' })
    nome: string;

    @Column({ name: 'email', nullable: true, unique: true })
    email: string;

    @Column({ name: 'regiao', nullable: true })
    regiao: string;

    @Column({ name: 'bio', nullable: true })
    bio: string;

    @Column({ name: 'redes', nullable: true })
    redes: string;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @ManyToMany(type => Empresa)
    empresas: Empresa[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
