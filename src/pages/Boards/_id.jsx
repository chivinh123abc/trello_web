//BoardDetail
import Container from '@mui/material/Container'
import AppBoard from '../../components/AppBar'
import BoardBar from './BoardBar'
import BoardContent from './BoardContent'

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBoard></AppBoard>
      <BoardBar />
      <BoardContent />
    </Container >
  )
}

export default Board
