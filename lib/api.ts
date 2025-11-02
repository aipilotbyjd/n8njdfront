const API_BASE_URL = 'http://n8njd.test/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return { data: [], success: false };
  }
  try {
    const data = await response.json();
    return data;
  } catch (err) {
    return { data: [], success: false };
  }
};

export const authAPI = {
  register: async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  changePassword: async (data: { current_password: string; password: string; password_confirmation: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  }
};

export const workflowAPI = {
  getAll: async (page = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows?page=${page}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { data: [], current_page: 1, last_page: 1 };
    }
  },

  getById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return null;
    }
  },

  create: async (data: { name: string; description?: string; nodes?: any[]; connections?: any[] }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  delete: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  activate: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows/${id}/activate`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  deactivate: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows/${id}/deactivate`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  duplicate: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows/${id}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  execute: async (id: number, inputData?: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows/${id}/execute`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ input_data: inputData || {} })
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  }
};

export const executionAPI = {
  getAll: async (page = 1, perPage = 20) => {
    try {
      const response = await fetch(`${API_BASE_URL}/executions?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { data: [], current_page: 1, last_page: 1 };
    }
  },

  getById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/executions/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return null;
    }
  },

  stop: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/executions/${id}/stop`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  retry: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/executions/${id}/retry`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  }
};

export const credentialAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { data: [] };
    }
  },

  create: async (data: { name: string; type: string; data: any }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  delete: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  },

  test: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials/${id}/test`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  }
};

export const templateAPI = {
  getAll: async (page = 1, perPage = 20) => {
    try {
      const response = await fetch(`${API_BASE_URL}/templates?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { data: [], current_page: 1, last_page: 1 };
    }
  },

  use: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${id}/use`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (err) {
      return { success: false };
    }
  }
};
