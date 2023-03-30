/* eslint-disable prettier/prettier */
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { AirQualityController } from '../../air_quality/air_quality.controller';
import { AirQualityService } from '../../air_quality/air_quality.service';

describe('AirQualityController', () => {
  let airQualityController: AirQualityController;
  let airQualityService: AirQualityService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: AirQualityService,
          useValue: {
            getMostPollutedDateTime: jest.fn().mockImplementation(() => Promise.resolve({
              ts: '2022-03-28T13:45:00.000Z'
            })),
            callAirQualityApi: jest.fn().mockImplementation((longitude: string, latitude: string) =>
              Promise.resolve({
                data: {
                  current: {
                    pollution: {
                      "ts": "2023-03-28T22:41:02.682+00:00",
                      "aqius": 35,
                      "mainus": "p2",
                      "aqicn": 18,
                      "maincn": "p1",
                    }
                  }
                }
              }),
            ),
          },
        },
      ],
    }).compile();

    airQualityController = moduleRef.get<AirQualityController>(AirQualityController);
    airQualityService = moduleRef.get<AirQualityService>(AirQualityService);
  });

  it('should be defined', () => {
    expect(airQualityController).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should return air quality data', async () => {
      const mockLongitude = '1.23';
      const mockLatitude = '4.56';
      const result = airQualityController.getAirQuality(mockLongitude, mockLatitude);
      expect(result).resolves.toEqual({
        Result: {
          Pollution: {
            "ts": "2023-03-28T22:41:02.682+00:00",
            "aqius": 35,
            "mainus": "p2",
            "aqicn": 18,
            "maincn": "p1",
          }
        }
      });
    });
  });

  describe('getMostPollutedDateTime', () => {
    it('should return the most polluted date and time', async () => {
      const result = airQualityController.getMostPollutedDateTime();
      expect(result).resolves.toEqual({ DateTime: '2022-03-28T13:45:00.000Z' });
    });
  });
});
