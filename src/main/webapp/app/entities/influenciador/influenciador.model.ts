import { IUser } from 'app/entities/user/user.model';
import { IEmpresa } from 'app/entities/empresa/empresa.model';

export interface IInfluenciador {
  id?: number;
  nome?: string;
  email?: string | null;
  regiao?: string | null;
  bio?: string | null;
  redes?: string | null;
  user?: IUser | null;
  empresas?: IEmpresa[] | null;
}

export class Influenciador implements IInfluenciador {
  constructor(
    public id?: number,
    public nome?: string,
    public email?: string | null,
    public regiao?: string | null,
    public bio?: string | null,
    public redes?: string | null,
    public user?: IUser | null,
    public empresas?: IEmpresa[] | null
  ) {}
}

export function getInfluenciadorIdentifier(influenciador: IInfluenciador): number | undefined {
  return influenciador.id;
}
