import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  categories: [{
    type: String,
    trim: true,
  }],
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  readingTime: {
    type: Number,
    default: 0,
  },
  sections: [{
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: String,
  }],
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  timestamps: true,
});

// Create URL-friendly slug from title
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Calculate reading time if content is modified
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }

  // Set publishedAt date when blog is published
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Method to find related posts based on title similarity
blogSchema.methods.findRelatedPosts = async function() {
  const relatedPosts = await this.model('Blog').find({
    $and: [
      { _id: { $ne: this._id } }, // Exclude current post
      { isPublished: true },
      { 
        $or: [
          { categories: { $in: this.categories || [] } },
          { tags: { $in: this.tags || [] } }
        ]
      }
    ]
  })
  .select('title slug summary image publishedAt readingTime')
  .limit(3)
  .sort('-publishedAt');

  return relatedPosts;
};

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog; 