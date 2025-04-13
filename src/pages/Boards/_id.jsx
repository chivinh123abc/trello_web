//BoardDetail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect } from 'react'
import {
  moveCardInDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

function Board() {
  const dispatch = useDispatch()
  // Khong dung state cua component nx ma chuyen qua dung State cua Redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)


  useEffect(() => {
    // tạm thời fix  cứng board(flow chuẩn chỉnh thì nằm ở advance dùng react_router_dom để lấy chuẩn boardId từ URL)
    const boardId = '67f255a06c5aa0fcdb33f6c6'
    //Call API
    dispatch(fetchBoardDetailsAPI(boardId))

  }, [dispatch])


  //Goi APi va xu ly khi keo tha column
  // Chi can goi API de cap nhat mang columnsOrderIds cua Board chua no (thay doi vi tri trong mang)
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    // Trường hợp này không lỗi do không dùng push như ở trên làm thay đổi trực tiếp  mở rộng mảng mà chỉ gán lại toàn bộ giá  trị bằng 2 mảng mới
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // console.log(createdColumn)
    dispatch(updateCurrentActiveBoard(newBoard))

    //Goi API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  // Khi di chuyen card  trong cung Column:
  // Chi can goi API de cap nhat mang cardOrderIds cua Column chua no (thay doi vi tri trong mang)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    //Update cho chuandu lieu state board

    /**
     * Cannot assign to read only property 'cards' of object
     * Trường hợp Immutability ở đây đã đụng tới giá trị của cards đang được coi là read only - (nested object - can thiệp sâu dữ liệu)
     */
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns?.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    //Goi api update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // Khi di chuyen card sang  column khac:
  // B1: Cap nhat cardOrderIds cua column ban dau chua no  (xoa _id khoi mang)
  // B2: Cap  nhat  mang  cardOrderIds cua column tiep theo
  // B3: Cap nhat lai truong  columnId  moi  cua card da keo
  //=>lam 1 API support rieng
  const moveCardInDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    //Update cho chuan du lieu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    //Goi API xu ly phia BE
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // Xy ly van de khi keo card cuoi cung ra khoi column, Column rong se co placeholder card, can xoa no di trc khi gui len BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardInDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }


  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board....</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar></AppBar>
      <BoardBar board={board} />
      <BoardContent
        board={board}

        // createNewColumn={createNewColumn}
        // createNewCard={createNewCard}
        // deleteColumnDetails={deleteColumnDetails}

        // 3 trường hợp move thì giữ nguyên để code xử lý kéo thả ở phần BoardContent không bị quá dài mất kiểm soát khi đọc code, maintain
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardInDifferentColumn={moveCardInDifferentColumn}
      />
    </Container >


  )
}

export default Board
