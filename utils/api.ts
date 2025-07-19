const BASE_URL = 'http://localhost:8080';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    return { error: 'Network error or server unavailable' };
  }
}

// Auth API calls
export const authAPI = {
  login: async (username: string, password: string) => {
    return apiRequest<{ message: string; userId: number; username: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (username: string, email: string, password: string) => {
    return apiRequest<{ message: string; userId: number; username: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  logout: async () => {
    return apiRequest<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async (userId: number) => {
    return apiRequest<{ id: number; username: string; email: string }>(`/api/auth/me?userId=${userId}`);
  },
};

// Reservation API calls
export const reservationAPI = {
  getAll: async (userId: number) => {
    return apiRequest<{
      id: number;
      userId: number;
      date: string;
      time: string;
      duration: number;
      guestCount: number;
      createdAt: string;
    }[]>(`/api/reservations?userId=${userId}`);
  },

  create: async (userId: number, reservation: { date: string; time: string; duration: number; guestCount: number }) => {
    return apiRequest<{
      id: number;
      userId: number;
      date: string;
      time: string;
      duration: number;
      guestCount: number;
      createdAt: string;
    }>('/api/reservations', {
      method: 'POST',
      body: JSON.stringify({ userId, ...reservation }),
    });
  },

  get: async (id: number) => {
    return apiRequest<{
      id: number;
      userId: number;
      date: string;
      time: string;
      duration: number;
      guestCount: number;
      createdAt: string;
    }>(`/api/reservations/${id}`);
  },

  update: async (id: number, reservation: Partial<{ date: string; time: string; duration: number; guestCount: number }>) => {
    return apiRequest<{
      id: number;
      userId: number;
      date: string;
      time: string;
      duration: number;
      guestCount: number;
      createdAt: string;
    }>(`/api/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservation),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ message: string }>(`/api/reservations/${id}`, {
      method: 'DELETE',
    });
  },
}; 