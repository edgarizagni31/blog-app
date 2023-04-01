import { SchemaDefinitionProperty, Types } from 'mongoose';

export interface Post {
  title: string;
  image: string;
  summary: string;
  publish: boolean;
  content?: Types.ObjectId[];
  create_by: Types.ObjectId;
  category: SchemaDefinitionProperty<Types.ObjectId>;
  created_up: Date;
}
