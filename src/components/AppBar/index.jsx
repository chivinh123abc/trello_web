import Box from '@mui/material/Box'
import ModeSelection from '~/components/ModeSelection'

function AppBoard() {
  return (
    <Box sx={{
      backgroundColor: 'primary.light',
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center'
    }}>
      <ModeSelection />
    </Box>
  )
}

export default AppBoard
