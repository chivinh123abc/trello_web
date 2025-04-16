import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho  dự  án
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Cho phép axios tự đọng gửi cookie trong mỗi request lên BE (phụ  vụ lưu JWT tokens (refresh & access) và trong httpOnly Cokkie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors  ( Bộ đánh chặn vào giữa mọi Request & Responce )
 * https://axios-http.com/docs/interceptors
 */
// Interceptor Request  : Can thiep vao giua cac requestAPI
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})
// Interceptor Response  : Can thiep vao giua cac responseAPI nhan ve
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  // Mọi mã http status code nằm ngoài khoảng 200-299 sẽ la error và rơi vào đây
  // Xử lý tập trung phần hiển thị thông báo lỗi tra về từ  mọi API ở đây (viết code 1 lần -  CLEAN CODE)
  // clg.error ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  }
  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance