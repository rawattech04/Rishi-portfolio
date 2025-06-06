import { Project } from '@/types/project';

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const projects = await response.json();
    return projects
      .sort((a: Project, b: Project) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3); // Only return the 3 latest projects
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
} 