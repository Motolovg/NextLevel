import { IUser } from 'app/entities/user/user.model';
import { IInfluenciador } from 'app/entities/influenciador/influenciador.model';

export interface IEmpresa {
  id?: number;
  nome?: string;
  regiao?: string | null;
  nicho?: string | null;
  site?: string | null;
  user?: IUser | null;
  influenciadors?: IInfluenciador[] | null;
}

export class Empresa implements IEmpresa {
  constructor(
    public id?: number,
    public nome?: string,
    public regiao?: string | null,
    public nicho?: string | null,
    public site?: string | null,
    public user?: IUser | null,
    public influenciadors?: IInfluenciador[] | null
  ) {}
}

export function getEmpresaIdentifier(empresa: IEmpresa): number | undefined {
  return empresa.id;
}
