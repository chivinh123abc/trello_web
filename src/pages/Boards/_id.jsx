//BoardDetail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tạm thời fix  cứng board(flow chuẩn chỉnh thì nằm ở advance dùng react_router_dom để lấy chuẩn boardId từ URL)
    const boardId = '67f255a06c5aa0fcdb33f6c6'
    //Call API
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })

  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar></AppBar>
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container >


  )
}

export default Board
