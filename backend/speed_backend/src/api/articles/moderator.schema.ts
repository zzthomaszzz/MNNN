import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModeratorDocument = Moderator & Document;

@Schema({ timestamps: true })
export class Moderator {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ModeratorSchema = SchemaFactory.createForClass(Moderator);