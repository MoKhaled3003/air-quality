import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AirQualityDocument = HydratedDocument<AirQuality>;

@Schema()
export class AirQuality {
  @Prop()
  ts: Date;
  @Prop()
  aqius: number;
  @Prop()
  mainus: string;
  @Prop()
  aqicn: number;
  @Prop()
  maincn: string;
}

export const AirQualitySchema = SchemaFactory.createForClass(AirQuality);
