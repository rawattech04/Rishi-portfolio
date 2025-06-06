'use client';

import { useState, useEffect, useCallback } from 'react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import ProjectsTable from '@/components/ProjectsTable';
import ProjectModal from '@/components/ProjectModal';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  technologies: string[];
  isActive: boolean;
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

interface ProjectFormData {
  _id?: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  isActive: boolean;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectFormData | undefined>();
  const router = useRouter();

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects`, { 
        headers: headers as HeadersInit 
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch projects';
      setError(message);
      toast.error(message);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/admin/signin');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle project save (create/update)
  const handleSave = async (projectData: ProjectFormData) => {
    setError(null);
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const method = projectData._id ? 'PUT' : 'POST';
      const url = projectData._id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects/${projectData._id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects`;

      const response = await fetch(url, {
        method,
        headers: headers as HeadersInit,
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save project');
      }

      await fetchProjects();
      setIsModalOpen(false);
      toast.success(projectData._id ? 'Project updated successfully' : 'Project created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save project';
      setError(message);
      toast.error(message);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/admin/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: headers as HeadersInit
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      await fetchProjects();
      toast.success('Project deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete project';
      setError(message);
      toast.error(message);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/admin/signin');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => {
            setSelectedProject(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProjectsTable
          projects={projects}
          onEdit={(project) => {
            setSelectedProject(project);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          project={selectedProject}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
} 