import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Document } from 'mongoose';
import { EntityController, EntityService } from '../interfaces';

export class GenericController<T, Resource extends Partial<T>>
  implements EntityController<T, Resource> {
  constructor(public service: EntityService<T, Resource>) {}

  @Get()
  async get(): Promise<T[]> {
    return await this.service.get();
  }

  @Get('count')
  async getCount(): Promise<number> {
    return await this.service.getCount();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<T> {
    return await this.service.getById(id);
  }

  @Post()
  async create(@Body() resource: Resource): Promise<T> {
    return await this.service.create(resource);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<T> {
    return await this.service.delete(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() resource: Resource
  ): Promise<T> {
    return await this.service.update(id, resource);
  }
}
