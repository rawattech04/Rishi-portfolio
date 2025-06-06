export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      // Clear any auth tokens/cookies
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Throw error to be caught by the component
      throw new ApiError(401, data.error || 'Unauthorized - Please log in');
    }
    
    throw new ApiError(response.status, data.error || 'Something went wrong');
  }
  
  return data;
}

export async function makeApiCall(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Let the component handle the 401 error
      throw error;
    }
    throw error;
  }
} 