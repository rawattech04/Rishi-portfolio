import { Document, Types } from 'mongoose';

export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image: string;
  publishedAt: Date;
  isPublished: boolean;
  views: number;
  readingTime: number;
  categories: string[];
  tags: string[];
}

export type BlogDocument = Document & IBlog; 