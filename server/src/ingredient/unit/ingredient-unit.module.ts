import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { IngredientUnitService } from "./ingredient-unit.service";

@Module({
    imports: [DatabaseModule],
    providers: [IngredientUnitService],
    exports: [IngredientUnitService],
})
export class IngredientUnitModule { }
