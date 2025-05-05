import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo giá trị của một Slice trong redux
const initialState = {
  currentActiveCard: null
}

// Khởi tạo một slice trong kho lưu trữ - redux store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Reducer: Noi xu ly du lieu dong bo
  reducers: {
    // Luu y: la can cap ngoac  nhon cho function trong reducer  choducodebentrong chi co 1 dong, day la rule cua Redux
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },

    updateCurrentActiveCard: (state, action) => {
      const fullcard = action.payload // action.payload la chuan dat ten nhan dulieuvao reducer,o day chung ta gan no ra mot bien co nghia hon
      // Xu ly du lieu neu can thiet
      // ...
      // Update lai du lieu currentActiveCard trong redux
      state.currentActiveCard = fullcard
    }
  },

  // ExtraReducer: Xu ly du lieu bat dong bo
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => { }
})

// Action creators are generated for each case reducer function
// Actions: La noi danh cho cac components ben duoi goi bang  dispatch() toi no de cap nhat lai du lieu thong qua reducer (chay dong bo)
// De y o tren thi khong thay properties actions dau ca, boi vi nhung cai actions nay don gian la duoc Redux tao tu dong theo ten cua reducer ne
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

// Selectors : La noi danh cho cac components ben duoi goi bang hook useSelector() de lay du lieu tu trong kho redux store ra su dung
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

// filenay ten la activeCardSlice NHUNG chung  ta se export 1 thu ten la Reducer
export const activeCardReducer = activeCardSlice.reducer
