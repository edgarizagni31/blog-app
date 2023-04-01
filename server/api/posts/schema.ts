import { model, Schema, Types } from 'mongoose';
import { Post } from './types';

const postSchema = new Schema<Post>({
  title: {
    type: String,
    minlength: [5, 'post title must have at least 5 characters'],
    required: [true, 'post title is required'],
  },
  image: {
    type: String,
    required: [true, 'post image is required'],
  },
  summary: {
    type: String,
    minlength: [6, 'post summary must have at least 6 characters'],
    required: [true, 'post summary is required'],
    trim: true,
  },
  publish: {
    type: Boolean,
    required: [true, 'post publish is required'],
  },
  category: {
    type: Types.ObjectId,
    required: [true, 'post category is required'],
  },
  create_by: Types.ObjectId,
  created_up: {
    type: Date,
    default: Date.now(),
  },
});

export default model('post', postSchema);
