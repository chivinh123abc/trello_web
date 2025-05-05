// Redux : State management tool
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'

/**
 * Cấu hình redux-persist
 * Bài viết hướng dẫn
 * https://www.npmjs.com/package/redux-persist
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */
import { combineReducers } from 'redux' // Lưu ý : Có sẵn trong redux trong node_modules bởi vì khi cài @reduxjs/toolket là đã có
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default là localstorage

// Cấu hình persist
const rootPersistConfig = {
  key: 'root', // Key của persist cho ta chỉ định -> mặc định là root,
  storage: storage, // Biến storage ở trên - lưu vào localstorage
  whitelist: ['user'] // Định nghĩa các slide dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
  // blacklist: ['user'] // Định nghĩa các slide KHONG DUOC PHÉP duy trì
}

// Combine các reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer
})

// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // fix warning error when implement redux-persist
  // https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
  middleware: (getDefautMiddleware) => getDefautMiddleware({ serializableCheck: false })
})

