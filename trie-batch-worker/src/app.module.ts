import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmConfig } from './typeorm-config';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    BatchModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
