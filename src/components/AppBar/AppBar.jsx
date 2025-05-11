import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelection from '~/components/ModeSelection/ModeSelection'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Box sx={{
      // backgroundColor: 'primary.light',
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      '&::-webkit-scrollbar-track': { m: 2 },
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to={'/boards'}>
          <Tooltip title='Board List'>
            <AppsIcon sx={{ color: '#ffffff', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>


        <Link to='/'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: '#ffffff' }} />
            <Typography variant='span' sx={{
              fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff'
            }}>Trello</Typography>
          </Box>
        </Link>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{
              color: '#ffffff',
              border: 'none',
              '&:hover': {
                border: 'none'
              }
            }}
            variant="outlined"
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        <AutoCompleteSearchBoard />

        {/* Dard-Light mode */}
        <ModeSelection />

        {/* Xu ly hien thi thong bao */}
        <Notifications />

        <Tooltip title="Help" >
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: '#ffffff' }} />
        </Tooltip>

        <Profiles />
      </Box>

    </Box >
  )
}

export default AppBar
