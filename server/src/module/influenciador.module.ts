import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluenciadorController } from '../web/rest/influenciador.controller';
import { InfluenciadorRepository } from '../repository/influenciador.repository';
import { InfluenciadorService } from '../service/influenciador.service';

@Module({
    imports: [TypeOrmModule.forFeature([InfluenciadorRepository])],
    controllers: [InfluenciadorController],
    providers: [InfluenciadorService],
    exports: [InfluenciadorService],
})
export class InfluenciadorModule {}
