import { config } from './config';

const API_BASE_URL = config.apiUrl;

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response: Response) => {
  if (response.status === 204) return { success: true };
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return { success: false, message: 'Invalid response format' };
  }
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
  return data;
};

export const authAPI = {
  register: async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  changePassword: async (data: { current_password: string; password: string; password_confirmation: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }
};

export const workflowAPI = {
  getAll: async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/workflows?page=${page}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (data: { name: string; description?: string; nodes?: any[]; connections?: any[] }) => {
    const response = await fetch(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  activate: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}/activate`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  deactivate: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}/deactivate`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  duplicate: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  execute: async (id: number, inputData?: any) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}/execute`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ input_data: inputData || {} })
    });
    return handleResponse(response);
  }
};

export const executionAPI = {
  getAll: async (page = 1, perPage = 20) => {
    const response = await fetch(`${API_BASE_URL}/executions?page=${page}&per_page=${perPage}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/executions/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  stop: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/executions/${id}/stop`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  retry: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/executions/${id}/retry`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const credentialAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/credentials`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (data: { name: string; type: string; data: any }) => {
    const response = await fetch(`${API_BASE_URL}/credentials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/credentials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/credentials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  test: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/credentials/${id}/test`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const templateAPI = {
  getAll: async (page = 1, perPage = 20) => {
    const response = await fetch(`${API_BASE_URL}/templates?page=${page}&per_page=${perPage}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  use: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/templates/${id}/use`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const webhookAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/webhooks`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/webhooks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/webhooks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  test: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/webhooks/${id}/test`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const notificationAPI = {
  getAll: async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/notifications?page=${page}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  markAsRead: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const analyticsAPI = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getWorkflowMetrics: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/analytics/workflows/${id}/metrics`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const variableAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/variables`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/variables`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/variables/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/variables/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const versionAPI = {
  getAll: async (workflowId: number) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}/versions`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (workflowId: number, description: string) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}/versions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ description })
    });
    return handleResponse(response);
  },

  restore: async (workflowId: number, versionId: number) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}/versions/${versionId}/restore`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};
