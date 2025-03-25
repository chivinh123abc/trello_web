import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'


const MENU_STYLES = {
  color: '#ffffff',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: '#ffffff'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: 2,
      gap: 2,
      overflowX: 'auto',
      '&::-webkit-scrollbar-track': { m: 2 },
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
        // onClick={() => { }}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}//requirement
          clickable
        // onClick={() => { }}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        // onClick={() => { }}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        // onClick={() => { }}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filtes"
          clickable
        // onClick={() => { }}
        />

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: '#ffffff',
            borderColor: '#ffffff',
            '&:hover': { borderColor: '#ffffff' }
          }}
        >Invite</Button>
        <AvatarGroup
          max={5}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: '16px',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: 'a4b0be' }
            }
          }}
        >
          <Tooltip title='BaiLu'>
            <Avatar
              alt="BachLoc"
              src="https://i.pinimg.com/736x/7e/a0/90/7ea0904d2dbe92a9b8070676b85eee85.jpg" />
          </Tooltip>
          <Tooltip title='XuRuoHan'>
            <Avatar
              alt="TuNhuocHam"
              src="https://i.pinimg.com/736x/65/7f/08/657f084eb987f6a63103db62691d4418.jpg" />
          </Tooltip>
          <Tooltip title='YuXuXin'>
            <Avatar
              alt="NguThuHan"
              src="https://i.pinimg.com/736x/fa/ba/bb/fababbc20e7d451503365d52de94cbcd.jpg" />
          </Tooltip>
          <Tooltip title='SunZhenNi'>
            <Avatar
              alt="TonTranNy"
              src="https://i.pinimg.com/736x/01/1f/b5/011fb5da5a158faa0ed5c2451149f561.jpg" />
          </Tooltip>
          <Tooltip title='DaiLoOa'>
            <Avatar
              alt="DaiLoOa"
              src="https://i.pinimg.com/736x/bc/0c/15/bc0c15219b6b9fde4d65c02386b813d6.jpg" />
          </Tooltip>
          <Tooltip title='PikaPika'>
            <Avatar
              alt="Pikachu"
              src="https://i.pinimg.com/736x/d4/96/76/d496761128b05abc4aed6a81985c873a.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
