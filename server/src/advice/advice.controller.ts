import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdviceService } from './advice.service';

@Controller('advice')
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) { }

  @Get('for-recipe/:recipename')
  findForRecipe(@Param('recipename') recipename: string) {
    return this.adviceService.findForRecipe(recipename);
  }


  @Get('for-ingr/:ingrname')
  findForIngredient(@Param('ingrname') ingrname: string) {
    return this.adviceService.findForIngredient(ingrname);
  }


  @Get('info-cuisine/:cuisine')
  getInfoForCuisine(@Param('cuisine') cuisine: string) {
    return this.adviceService.getInfoForCuisine(cuisine);
  }

}
