/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AirQualityService } from './air_quality.service';
import { AirQuality, AirQualitySchema } from './air_quality.shema';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AirQualityController } from './air_quality.controller';
import { CronService } from './cron.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: AirQuality.name, schema: AirQualitySchema }]),
    HttpModule,
  ],
  providers: [AirQualityService,CronService],
  controllers: [AirQualityController]
})
export class AirQualityModule {}
