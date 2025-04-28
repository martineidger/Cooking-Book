import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./auth/guards/roles.guard";
import { Roles } from "./auth/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "./auth/guards/jwt.guard";
import { Public } from "./auth/decorators/public.decorator";

@Controller('test')
export class TestController {
    @Get()
    @Roles(Role.Admin)
    //@Public()
    test() {
        return { message: 'OK' };
    }
}