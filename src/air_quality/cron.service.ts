import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AirQualityService } from './air_quality.service';

@Injectable()
export class CronService {
  constructor(private airQualityService: AirQualityService) {}
  private readonly logger = new Logger(CronService.name);

  @Cron('* * * * *')
  handleCron() {
    this.airQualityService.createAirQualityRecord('2.352222', '48.856613');
    this.logger.debug('Called every minitue');
  }
}
