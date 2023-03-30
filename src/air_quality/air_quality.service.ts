/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { AirQuality, AirQualityDocument } from './air_quality.shema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AirQualityService {
  constructor(
    @InjectModel(AirQuality.name) private readonly airQualityModel: Model<AirQualityDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async createAirQualityRecord(longitude: string,latitude: string): Promise<any> {
    const IQAirResponse = await this.callAirQualityApi(longitude,latitude);

    //change date in response to current datetime because it always return same datetime
    // IQAirResponse.data.current.pollution.ts = new Date();
    const AirQuality = await this.airQualityModel.create(IQAirResponse.data.current.pollution)
    return AirQuality
  }

   async callAirQualityApi(longitude: string,latitude: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(`http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${this.configService.get('AIR_VISUAL_API_KEY')}`).pipe(
        catchError((error: AxiosError) => {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }),
      ),
    );
    return data;
  }

  async getMostPollutedDateTime(){
    const pollution = await this.airQualityModel.find().sort({ aqius: -1 }).limit(1);
    return pollution[0]
  }
}
