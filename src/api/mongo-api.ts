// frontend/src/api/apiClient.ts
// Safe, environment-variable-based API client for frontend

// Use environment variable for backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
console.log('Using API URL:', API_BASE_URL);

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generic API request function
 */
export async function callAPI<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);

    // For GET requests with query parameters
    if (method === 'GET' && body) {
      Object.entries(body).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if user is stored
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: 'include', // optional: use if backend uses cookies
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined
    };

    console.log(`Fetching ${method} ${url.toString()}`, body);

    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * User API functions
 */
export async function createUser(userData: any) {
  return callAPI('POST', 'users', userData);
}

export async function getUserByEmail(email: string) {
  return callAPI('GET', 'users', { email });
}

export async function enrollUserInCourse(userId: string, courseId: string) {
  return callAPI('PATCH', `users/${userId}/enroll`, { courseId });
}

/**
 * Courses API
 */
export async function getCourses() {
  return callAPI('GET', 'courses');
}

/**
 * Test backend connection
 */
export async function testConnection() {
  return callAPI('GET', 'test-connection');
}
