import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { InfluenciadorDTO } from '../../service/dto/influenciador.dto';
import { InfluenciadorService } from '../../service/influenciador.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/influenciadors')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('influenciadors')
export class InfluenciadorController {
    logger = new Logger('InfluenciadorController');

    constructor(private readonly influenciadorService: InfluenciadorService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: InfluenciadorDTO,
    })
    async getAll(@Req() req: Request): Promise<InfluenciadorDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.influenciadorService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: InfluenciadorDTO,
    })
    async getOne(@Param('id') id: number): Promise<InfluenciadorDTO> {
        return await this.influenciadorService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create influenciador' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: InfluenciadorDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() influenciadorDTO: InfluenciadorDTO): Promise<InfluenciadorDTO> {
        const created = await this.influenciadorService.save(influenciadorDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Influenciador', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update influenciador' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: InfluenciadorDTO,
    })
    async put(@Req() req: Request, @Body() influenciadorDTO: InfluenciadorDTO): Promise<InfluenciadorDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Influenciador', influenciadorDTO.id);
        return await this.influenciadorService.update(influenciadorDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update influenciador with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: InfluenciadorDTO,
    })
    async putId(@Req() req: Request, @Body() influenciadorDTO: InfluenciadorDTO): Promise<InfluenciadorDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Influenciador', influenciadorDTO.id);
        return await this.influenciadorService.update(influenciadorDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete influenciador' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Influenciador', id);
        return await this.influenciadorService.deleteById(id);
    }
}
