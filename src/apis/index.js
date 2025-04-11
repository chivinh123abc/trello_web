import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Lưu ý: Khi dùng Axios
 * Tất cả các function bên dưới chỉ có request và lấy data tu response, mà k có try catch hay then catch để bắt lỗi
 * Lý do: ở front-end chúng ta không cần thiết làm  như  vậy đối vs mọi request bởi nó sẽ gây ra việc dư thừa code catch lỗi quá nhiều
 * Giải pháp cleancode gọn gàng là chúng ta sẽ catch lỗi tập trung  tại một nơi bằng cách tận dụng Interceptors của Axios
 * Hiểu đơn giản Interceptors là cách mà chúng ta đánh chặn vào giữa request và response để xử lý logic mà chúng ta muốn
 */

// Board
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //Axios tra ve ket qua qua property cua no la data
  return response.data
}


// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}


// Card
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}


