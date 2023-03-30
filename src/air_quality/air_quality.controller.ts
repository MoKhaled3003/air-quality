/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { AirQualityService } from './air_quality.service';

@Controller('airQuality')
export class AirQualityController {
    constructor(private airQualityService: AirQualityService) { }

    @Get()
    async getAirQuality(@Query('longitude') longitude: string, @Query('latitude') latitude: string): Promise<any> {
        const response = await this.airQualityService.callAirQualityApi(longitude, latitude);
        return {
            Result: {
                Pollution: response.data.current.pollution
            }
        };
    }

    @Get("/getMostPolluted")
    async getMostPollutedDateTime(): Promise<any> {
        const response = await this.airQualityService.getMostPollutedDateTime();
        return { DateTime: response.ts };
    }
}
