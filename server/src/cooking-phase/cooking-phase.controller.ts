import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CookingPhaseService } from './cooking-phase.service';
import { CreateCookingPhaseDto } from './dto/create-cooking-phase.dto';
import { CreateCookingStepDto } from './dto/create-cooking-step.dto';

@Controller('cooking-phase')
export class CookingPhaseController {
  constructor(private readonly cookingPhaseService: CookingPhaseService) { }

  @Post()
  async create(@Body() createCookingPhaseDto: CreateCookingPhaseDto, @Query() recipeId: string) {
    return await this.cookingPhaseService.create(createCookingPhaseDto, recipeId);
  }

  @Get()
  async findAll() { }

}
