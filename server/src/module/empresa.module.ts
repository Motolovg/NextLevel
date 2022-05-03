import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaController } from '../web/rest/empresa.controller';
import { EmpresaRepository } from '../repository/empresa.repository';
import { EmpresaService } from '../service/empresa.service';

@Module({
    imports: [TypeOrmModule.forFeature([EmpresaRepository])],
    controllers: [EmpresaController],
    providers: [EmpresaService],
    exports: [EmpresaService],
})
export class EmpresaModule {}
