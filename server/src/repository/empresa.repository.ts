import { EntityRepository, Repository } from 'typeorm';
import { Empresa } from '../domain/empresa.entity';

@EntityRepository(Empresa)
export class EmpresaRepository extends Repository<Empresa> {}
