import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || err.response?.data?.data || 'Đã xảy ra lỗi'
    return Promise.reject(new Error(msg))
  }
)

// Users
export const userAPI = {
  getAll: () => api.get('/user'),
  getById: (id) => api.get(`/user/${id}`),
  create: (data) => api.post('/user', data),
  update: (id, data) => api.put(`/user/${id}`, data),
  delete: (id) => api.delete(`/user/${id}`)
}

// Categories
export const categoryAPI = {
  getAll: () => api.get('/category'),
  getById: (id) => api.get(`/category/${id}`),
  create: (data) => api.post('/category', data),
  update: (id, data) => api.put(`/category/${id}`, data),
  delete: (id) => api.delete(`/category/${id}`)
}

// Questions
export const questionAPI = {
  getAll: () => api.get('/question'),
  getById: (id) => api.get(`/question/${id}`),
  create: (data) => api.post('/question', data),
  update: (id, data) => api.put(`/question/${id}`, data),
  delete: (id) => api.delete(`/question/${id}`)
}

// Quizzes
export const quizAPI = {
  getAll: () => api.get('/quizz'),
  getById: (id) => api.get(`/quizz/${id}`),
  create: (data) => api.post('/quizz', data),
  update: (id, data) => api.put(`/quizz/${id}`, data),
  delete: (id) => api.delete(`/quizz/${id}`),
  play: (quizId) => api.get(`/quizz/playQuiz?quizId=${quizId}`),
  submit: (data) => api.post('/quizz/submitQuiz', data)
}

// Quiz Variants
export const quizVariantAPI = {
  getByQuizId: (quizId) => api.get(`/quiz-variants?quizId=${quizId}`),
  create: (data) => api.post('/quiz-variants', data)
}
