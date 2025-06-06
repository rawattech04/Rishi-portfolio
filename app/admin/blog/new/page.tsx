'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { getAuthHeaders } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface BlogSection {
  title: string;
  content: string;
  image?: string;
}

interface Blog {
  title: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  isPublished: boolean;
  publishedAt?: string;
  sections?: BlogSection[];
  categories: string[];
}

export default function NewBlog() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([
    'Technology',
    'Programming',
    'Web Development',
    'Software Engineering',
    'AI & ML',
    'DevOps',
    'Other'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState<Blog>({
    title: '',
    summary: '',
    content: '',
    image: '',
    author: '',
    isPublished: false,
    sections: [],
    categories: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSectionImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const imageUrl = await uploadImageToCloudinary(file);
        const newSections = [...formData.sections!];
        newSections[index] = { ...newSections[index], image: imageUrl };
        setFormData({ ...formData, sections: newSections });
      } catch (error) {
        console.error('Error uploading section image:', error);
        toast.error('Failed to upload section image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...(formData.sections || []), { title: '', content: '' }],
    });
  };

  const handleRemoveSection = (index: number) => {
    const newSections = formData.sections?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, sections: newSections });
  };

  const handleSectionChange = (index: number, field: keyof BlogSection, value: string) => {
    const newSections = [...(formData.sections || [])];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const finalFormData = {
        ...formData,
        image: imageUrl,
      };

      const headers = getAuthHeaders();
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: headers as HeadersInit,
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create blog');
      }

      toast.success('Blog created successfully');
      router.push('/admin/blog');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create blog';
      toast.error(message);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/admin/signin');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Blog</h1>
          <button
            onClick={() => router.push('/admin/blog')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Publish Status */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={e => {
                  const isPublished = e.target.checked;
                  setFormData({
                    ...formData,
                    isPublished,
                    publishedAt: isPublished ? new Date().toISOString() : undefined
                  });
                }}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Publish immediately</span>
            </label>
            {formData.isPublished && formData.publishedAt && (
              <span className="text-sm text-gray-500">
                Will be published on: {new Date(formData.publishedAt).toLocaleString()}
              </span>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
            <textarea
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={6}
              required
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full"
            />
            {previewUrl && (
              <div className="mt-2 relative h-40">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categories</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.categories.map((category, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{category}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newCategories = formData.categories.filter(cat => cat !== category);
                        setFormData({ ...formData, categories: newCategories });
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <select
                value=""
                onChange={e => {
                  const value = e.target.value;
                  if (value && !formData.categories.includes(value)) {
                    setFormData({
                      ...formData,
                      categories: [...formData.categories, value]
                    });
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select categories (multiple allowed)</option>
                {categories
                  .filter(category => !formData.categories.includes(category))
                  .map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                    const newCategoryValue = newCategory.trim();
                    setCategories([...categories, newCategoryValue]);
                    setFormData({
                      ...formData,
                      categories: [...formData.categories, newCategoryValue]
                    });
                    setNewCategory('');
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
              >
                Add Category
              </button>
            </div>
          </div>

          {/* Sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blog Sections</label>
              <button
                type="button"
                onClick={handleAddSection}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Section
              </button>
            </div>
            {formData.sections?.map((section, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-medium">Section {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={section.title}
                  onChange={e => handleSectionChange(index, 'title', e.target.value)}
                  placeholder="Section Title"
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <textarea
                  value={section.content}
                  onChange={e => handleSectionChange(index, 'content', e.target.value)}
                  placeholder="Section Content"
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  rows={4}
                />
                <input
                  type="file"
                  onChange={e => handleSectionImageChange(index, e)}
                  accept="image/*"
                  className="w-full"
                />
                {section.image && (
                  <div className="mt-2 relative h-40">
                    <Image
                      src={section.image}
                      alt="Section"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading}
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 