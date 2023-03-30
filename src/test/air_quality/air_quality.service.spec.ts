/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from '../../air_quality/air_quality.service';
import { getModelToken } from '@nestjs/mongoose';
import { AirQualityInterface } from '../../air_quality/interfaces/air-quality.interface';
import { createMock } from '@golevelup/ts-jest';
import { Model, Query } from 'mongoose';
import { AirQuality, AirQualityDocument } from '../../air_quality/air_quality.shema';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

const mockAirQuality = (
  ts = new Date('2023-03-28T22:41:02.682+00:00'),
  aqius = 35,
  mainus = 'p2',
  aqicn = 18,
  maincn = 'p2',
): AirQualityInterface => ({
  ts,
  aqius,
  mainus,
  aqicn,
  maincn,
});

// still lazy, but this time using an object instead of multiple parameters
const mockAirQualityDoc = (mock?: Partial<AirQualityInterface>): Partial<AirQualityDocument> => ({
  ts: mock?.ts || new Date('2023-03-28T22:41:02.682+00:00'),
  aqius: mock?.aqius || 35,
  mainus: mock?.mainus || 'p2',
  aqicn: mock?.aqicn || 18,
  maincn: mock?.maincn || 'p2',
});

const airQualityRecord = mockAirQuality();

const airQualityDocument = mockAirQualityDoc()

describe('AirQuality Service', () => {
  let airQualityService: AirQualityService;
  let httpService: HttpService;
  let configService: ConfigService;

  let model: Model<AirQualityDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        ConfigService,
        {
          provide: getModelToken(AirQuality.name),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockAirQuality()),
            constructor: jest.fn().mockResolvedValue(mockAirQuality()),
            find: jest.fn(),
            create: jest.fn(),
            sort: jest.fn()
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    airQualityService = module.get<AirQualityService>(AirQualityService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    model = module.get<Model<AirQualityDocument>>(getModelToken(AirQuality.name));
  });

  it('should be defined', () => {
    expect(airQualityService).toBeDefined();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the air quality API', async () => {
    const longitude = '123.45';
    const latitude = '67.89';
    const airQuality = {
      data: {
        current: {
          pollution: {
            "ts": "2023-03-28T22:41:02.682+00:00",
            "aqius": 35,
            "mainus": "p2",
            "aqicn": 18,
            "maincn": "p1",
          },
        },
      },
      headers: {},
      config: {},
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of(airQuality as any));
    const result = await airQualityService.callAirQualityApi(
      longitude,
      latitude,
    );

    expect(spy).toHaveBeenCalledWith(`http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${configService.get('AIR_VISUAL_API_KEY')}`);
    // expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual(airQuality.data);
  });
  it('should call the IQAIR API and save result to database', async () => {
    const longitude = '123.45';
    const latitude = '67.89';
    const airQuality = {
      data: {
        current: {
          pollution: {
            "ts": "2023-03-28T22:41:02.682+00:00",
            "aqius": 35,
            "mainus": "p2",
            "aqicn": 18,
            "maincn": "p1",
          },
        },
      },
      headers: {},
      config: {},
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(airQualityService, 'callAirQualityApi')
      .mockReturnValue(airQuality as any);

    const saveSpy = jest
      .spyOn(model, 'create')
      .mockImplementationOnce(()=> Promise.resolve(airQualityDocument));

    const result = await airQualityService.createAirQualityRecord(longitude,latitude);

    expect(spy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual(airQualityDocument);
  });
})