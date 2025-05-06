import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { AdditionalService } from "./additional.service";

@Module({
    imports: [
        DatabaseModule,
    ],
    providers: [AdditionalService],
    exports: [AdditionalService]
})
export class AdditionalModule { }