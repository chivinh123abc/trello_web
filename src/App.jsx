import { Routes, Route, Navigate } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'

function App() {
  return (
    //React Router Dom /boards /boards/(board_id)
    <Routes>
      {/* Redirect Route */}
      {/* Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route/ sẽ không còn nằm trong history của Browser
      // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có
       */}
      <Route path='/' element={
        <Navigate to='/boards/67f255a06c5aa0fcdb33f6c6' replace={true} />
      } />
      {/* Board Detail */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authetication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
