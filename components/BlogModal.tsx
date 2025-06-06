import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import Image from 'next/image';

interface BlogSection {
  title: string;
  content: string;
  image?: string;
}

interface Blog {
  _id?: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  isPublished: boolean;
  sections?: BlogSection[];
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
  onSave: (blog: Blog, isEditing: boolean) => void;
}

const BlogModal = ({ isOpen, onClose, blog, onSave }: BlogModalProps) => {
  const [formData, setFormData] = useState<Blog>({
    title: '',
    summary: '',
    content: '',
    image: '',
    author: '',
    isPublished: false,
    sections: [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [sectionImageFiles, setSectionImageFiles] = useState<(File | null)[]>([]);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        summary: blog.summary,
        content: blog.content,
        image: blog.image,
        author: blog.author,
        isPublished: blog.isPublished,
        sections: [...(blog.sections || [])],
      });
      setPreviewUrl(blog.image);
      setSectionImageFiles(blog.sections?.map(() => null) || []);
    } else {
      setFormData({
        title: '',
        summary: '',
        content: '',
        image: '',
        author: '',
        isPublished: false,
        sections: [],
      });
      setPreviewUrl('');
      setSectionImageFiles([]);
    }
    setImageFile(null);
  }, [blog]);

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
    setSectionImageFiles([...sectionImageFiles, null]);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = formData.sections?.filter((_, i) => i !== index) || [];
    const newSectionImageFiles = sectionImageFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
    setSectionImageFiles(newSectionImageFiles);
  };

  const handleSectionChange = (index: number, field: keyof BlogSection, value: string) => {
    const newSections = [...(formData.sections || [])];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadImageToCloudinary(imageFile);
        setIsUploading(false);
      }
      const finalFormData = {
        ...formData,
        image: imageUrl,
      };
      onSave(finalFormData, !!blog);
    } catch (error) {
      console.error('Error saving blog:', error);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="inline-block w-full max-w-4xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <Dialog.Title className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-4">
            {blog ? 'Edit Blog' : 'Add New Blog'}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Summary and Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary</label>
              <textarea
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={6}
                required
              />
            </div>

            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Main Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {previewUrl && (
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    width={80} 
                    height={80} 
                    className="object-cover rounded" 
                  />
                )}
              </div>
            </div>

            {/* Sections */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Sections</label>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Section
                </button>
              </div>
              <div className="space-y-6">
                {formData.sections?.map((section, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Section {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Title</label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={e => handleSectionChange(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Content</label>
                        <textarea
                          value={section.content}
                          onChange={e => handleSectionChange(index, 'content', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Image (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleSectionImageChange(index, e)}
                          className="w-full"
                        />
                        {section.image && (
                          <Image 
                            src={section.image} 
                            alt="Section Preview" 
                            width={80} 
                            height={80} 
                            className="mt-2 object-cover rounded" 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Published Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 text-blue-600"
              />
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Published</label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : blog ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default BlogModal; 