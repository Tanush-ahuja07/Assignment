const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  total_seats: number;
  available_seats: number;
  image_url?: string;
  created_by?: number;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Booking {
  id: number;
  event_id: number;
  name: string;
  email: string;
  mobile: string;
  quantity: number;
  total_amount: number;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export const usersAPI = {
  getAll: async (token: string) => {
    const response = await fetch(`${getApiUrl()}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    return response.json();
  },

  makeAdmin: async (token: string, userId: number) => {
    const response = await fetch(`${getApiUrl()}/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: 'admin' }),
    });
    if (!response.ok) {
      try {
        const err = await response.json();
        throw new Error(err.error || `Failed to update role: ${response.status}`);
      } catch (e) {
        throw new Error(`Failed to update role: ${response.status} ${response.statusText}`);
      }
    }
    return response.json();
  },
};

// Auth API calls
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Registration failed: ${response.status}`);
        } catch (e) {
          throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Login failed: ${response.status}`);
        } catch (e) {
          throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  getMe: async (token: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Failed to fetch user data: ${response.status}`);
        } catch (e) {
          throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error('GetMe error:', err);
      throw err;
    }
  },
};

// Events API calls
export const eventsAPI = {
  getAll: async (search?: string, location?: string, date?: string) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (date) params.append('date', date);

      const response = await fetch(`${getApiUrl()}/events?${params.toString()}`);
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Failed to fetch events: ${response.status}`);
        } catch (e) {
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error('GetAll events error:', err);
      throw err;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await fetch(`${getApiUrl()}/events/${id}`);
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Event not found: ${response.status}`);
        } catch (e) {
          throw new Error(`Event not found: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error(`GetById event ${id} error:`, err);
      throw err;
    }
  },

  create: async (token: string, eventData: Partial<Event>) => {
    try {
      const response = await fetch(`${getApiUrl()}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Failed to create event: ${response.status}`);
        } catch (e) {
          throw new Error(`Failed to create event: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error('Create event error:', err);
      throw err;
    }
  },

  update: async (token: string, id: number, eventData: Partial<Event>) => {
    try {
      const response = await fetch(`${getApiUrl()}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Failed to update event: ${response.status}`);
        } catch (e) {
          throw new Error(`Failed to update event: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error(`Update event ${id} error:`, err);
      throw err;
    }
  },

  delete: async (token: string, id: number) => {
    try {
      const response = await fetch(`${getApiUrl()}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Failed to delete event: ${response.status}`);
        } catch (e) {
          throw new Error(`Failed to delete event: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error(`Delete event ${id} error:`, err);
      throw err;
    }
  },

  getUserEvents: async (token: string, userId: number) => {
    try {
      const response = await fetch(`${getApiUrl()}/events/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Failed to fetch user events: ${response.status}`);
        } catch (e) {
          throw new Error(`Failed to fetch user events: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error('Get user events error:', err);
      throw err;
    }
  },
};

// Bookings API calls
export const bookingsAPI = {
  create: async (token: string, bookingData: Partial<Booking>) => {
    try {
      const response = await fetch(`${getApiUrl()}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Failed to create booking: ${response.status}`);
        } catch (e) {
          throw new Error(`Failed to create booking: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (err) {
      console.error('Create booking error:', err);
      throw err;
    }
  },
};
