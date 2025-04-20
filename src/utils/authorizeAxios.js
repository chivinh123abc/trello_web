import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { interceptorLoadingElements } from '~/utils/formatters'

/**
 * Không  thể import {store} from  ''redux/store'' theo  cách thông thường
 * Giải pháp :  inject store :  là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
 * Hiểu đơn giản: Khi ứng dụng bắt đầu chạy lên, code chạy vào main.jsx từ đó gọi hàm injectStore nggay lập thực để gán biến mainStore vào biến axiosReduxStore trong cục bộ file này
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */
let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho  dự  án
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Cho phép axios tự đọng gửi cookie trong mỗi request lên BE (phục vụ lưu JWT tokens (refresh & access) và trong httpOnly Cokkie của trình duyệt)
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

// Khởi tạo một promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong thì mới retry lại nhiều api bị lỗi trước đó
let refreshTokenPromise = null

// Interceptor Response  : Can thiep vao giua cac responseAPI nhan ve
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Mọi mã http status code nằm ngoài khoảng 200-299 sẽ la error và rơi vào đây
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  /**Quan trọng:  Xử lý RefreshToken tự động */
  // Case 1: Nếu như nhận 401 từ BE thì gọi api đăng xuất ngay
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }
  // Case 2: Nếu như nhận 410 thì gọi api refresh token để làm mới accesstoken
  // Đầu tiên lấy đc các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Gán thêm môt giá trị _retry luôn = true trong khoản thời gian chờ, đảm bảo việc refeshtoken chỉ luôn gọi 1 lần tại 1 thời điểm
    originalRequests._retry = true
    // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gán vào refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // Dong thoi accessToken da nam trong  httpOnly cookie (xu ly tu BE)
          return data?.accessToken
        })
        .catch((_error) => {
          // Neu nhan bat ky loi nao tu refresh token thi logout
          axiosReduxStore.dispatch(logoutUserAPI(false))
          // return Promise.reject(_error)
        })
        .finally(() => {
          // Du API co ok hay error thi van luon gan  refreshTokenPromis ve null
          refreshTokenPromise = null
        })
    }
    // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      /**
       * Bước 1: đối  với trường hợp dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
       * Hiện tại ở đây không cần bước 1 này, vì chúng ta đã đưa accessToken vào cookie(Xử lý từ BE) sau khi api refreshToken được gọi thành công
       */
      // Bước 2: Return  lại axiosInstance của chúng  ta kết hợp các originalRequests để gọi lại những API ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })
  }
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