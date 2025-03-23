//BoardDetail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import BoardContent from '~/pages/Boards/BoardContent'

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar></AppBar>
      <BoardBar />
      <BoardContent />
    </Container >


  )
}

export default Board
