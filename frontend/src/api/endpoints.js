import api from "./axiosInstance"

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
}

// Profile endpoints
export const profileAPI = {
  getProfile: () => api.get("/profile"),
  updateProfile: (profileData) => api.put("/profile", profileData),
  updatePassword: (passwordData) => api.put("/profile/password", passwordData),
}

// Income endpoints
export const incomeAPI = {
  getIncome: (params) => api.get("/income", { params }),
  getIncomeById: (id) => api.get(`/income/${id}`),
  createIncome: (incomeData) => api.post("/income", incomeData),
  updateIncome: (id, incomeData) => api.put(`/income/${id}`, incomeData),
  deleteIncome: (id) => api.delete(`/income/${id}`),
  getIncomeSummary: (params) => api.get("/income/summary", { params }),
}

// Expense endpoints
export const expenseAPI = {
  getExpenses: (params) => api.get("/expenses", { params }),
  getExpenseById: (id) => api.get(`/expenses/${id}`),
  createExpense: (expenseData) => api.post("/expenses", expenseData),
  updateExpense: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  getExpenseSummary: (params) => api.get("/expenses/summary", { params }),
}

// Comment endpoints
export const commentAPI = {
  getComments: (params) => api.get("/comments", { params }),
  getCommentById: (id) => api.get(`/comments/${id}`),
  createComment: (commentData) => api.post("/comments", commentData),
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
}
