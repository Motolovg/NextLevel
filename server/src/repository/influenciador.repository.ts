import { EntityRepository, Repository } from 'typeorm';
import { Influenciador } from '../domain/influenciador.entity';

@EntityRepository(Influenciador)
export class InfluenciadorRepository extends Repository<Influenciador> {}
