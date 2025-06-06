import { useState } from 'react';
import { FiEdit2, FiTrash2, FiExternalLink, FiImage, FiAlertTriangle } from 'react-icons/fi';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  categories: string[];
  isPublished: boolean;
  publishedAt?: string;
  slug: string;
}

interface BlogsTableProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  isAdminView?: boolean;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  blogTitle: string;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, blogTitle }: DeleteConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="relative mx-auto max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-200" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                Delete Blog
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete &quot;{blogTitle}&quot;? This action cannot be undone.
              </Dialog.Description>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600">Cancel</button>
            <button type="button" onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400">Delete</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const BlogsTable = ({ blogs, onEdit, onDelete, isAdminView = false }: BlogsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; blogId: string; blogTitle: string }>({
    isOpen: false,
    blogId: '',
    blogTitle: ''
  });
  const itemsPerPage = 5;
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);
  const handleDeleteClick = (blog: Blog) => {
    setDeleteModal({
      isOpen: true,
      blogId: blog._id,
      blogTitle: blog.title
    });
  };
  const handleConfirmDelete = () => {
    onDelete(deleteModal.blogId);
    setDeleteModal({ isOpen: false, blogId: '', blogTitle: '' });
  };
  return (
    <div className="container mx-auto">
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">No.</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Image</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Summary</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categories</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published At</th>
              <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentBlogs.map((blog, index) => (
              <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{startIndex + index + 1}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Image src={blog.image} alt={blog.title} width={60} height={40} className="rounded object-cover" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{blog.title}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{blog.summary}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{blog.author}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{tag}</span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">+{blog.tags.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {blog.categories.slice(0, 3).map((cat, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-300">{cat}</span>
                    ))}
                    {blog.categories.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-300">+{blog.categories.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${blog.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{blog.isPublished ? 'Yes' : 'No'}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <Link
                      href={isAdminView ? `/admin/blog/${blog.slug}` : `/blog/${blog.slug}`}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="View blog"
                    >
                      <FiExternalLink className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => blog._id ? onEdit(blog) : null} 
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" 
                      title="Edit blog"
                      disabled={!blog._id}
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteClick(blog)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Delete blog">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-6">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">Previous</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page ? 'bg-blue-500 text-white border border-blue-500 dark:border-blue-400' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>{page}</button>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">Next</button>
      </div>
      <DeleteConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, blogId: '', blogTitle: '' })} onConfirm={handleConfirmDelete} blogTitle={deleteModal.blogTitle} />
    </div>
  );
};

export default BlogsTable; 