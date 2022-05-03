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
import { EmpresaDTO } from '../../service/dto/empresa.dto';
import { EmpresaService } from '../../service/empresa.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/empresas')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('empresas')
export class EmpresaController {
    logger = new Logger('EmpresaController');

    constructor(private readonly empresaService: EmpresaService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: EmpresaDTO,
    })
    async getAll(@Req() req: Request): Promise<EmpresaDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.empresaService.findAndCount({
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
        type: EmpresaDTO,
    })
    async getOne(@Param('id') id: number): Promise<EmpresaDTO> {
        return await this.empresaService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create empresa' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: EmpresaDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() empresaDTO: EmpresaDTO): Promise<EmpresaDTO> {
        const created = await this.empresaService.save(empresaDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Empresa', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update empresa' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: EmpresaDTO,
    })
    async put(@Req() req: Request, @Body() empresaDTO: EmpresaDTO): Promise<EmpresaDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Empresa', empresaDTO.id);
        return await this.empresaService.update(empresaDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update empresa with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: EmpresaDTO,
    })
    async putId(@Req() req: Request, @Body() empresaDTO: EmpresaDTO): Promise<EmpresaDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Empresa', empresaDTO.id);
        return await this.empresaService.update(empresaDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete empresa' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Empresa', id);
        return await this.empresaService.deleteById(id);
    }
}
