import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { RecipeModule } from './recipe/recipe.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { AllergenModule } from './allergen/allergen.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TestController } from './test.controller';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorMiddleware } from './common/middlewares/error-exception.middleware';
import { CollectionModule } from './collection/collection.module';
import { FollowingModule } from './following/following.module';
import { RecipePhotosMiddleware } from './common/middlewares/cloudinary-upload.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CloudinaryInterceptor } from './common/interceptors/photo.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    RecipeModule,
    IngredientModule,
    CategoryModule,
    UserModule,
    CuisineModule,
    AllergenModule,
    CollectionModule,
    FollowingModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        }
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),

  ],
  controllers: [AppController, TestController],
  providers: [
    AppService,
    DatabaseService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CloudinaryInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ErrorMiddleware)
      .forRoutes('*');


  }
}
