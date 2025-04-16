import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'

// Khởi  tạo giá trị State của Slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducer
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Khởi tạo 1 Slice trong kho lưu trữ - redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận  dữ liệu vào reducer, ở đây chúng ta gán
      // nó ra 1 biến có nghĩa  hơn
      const board = action.payload

      // Xu ly du lieu neu can thiet
      // ....

      //Update lai du lieu cua currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // ExtraReducers: Noi xu ly du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là response.data mà ta đã gọi API trả về ở trên
      let board = action.payload

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      //xu  ly keo tha column  rong
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sap xep thu tu cac card o day trc khi dua du lieu xuong duoi (fix bug vd71)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      //Update lai du lieu cua currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không có properties actions ở đâu, bởi vì những actions này đơn giản là được redux tạo tự động theo tên của reducer
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// file tên là activeBoardSlice nhưng chúng ta sẽ export ra Reducer //! Lưu Ý
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
