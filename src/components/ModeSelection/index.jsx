import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import LightModeIcon from '@mui/icons-material/LightMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box'

function ModeSelection() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl size="small" sx={{ minWidth: '120px' }}>
      <InputLabel
        id="label-select-dark-light-mode"
        sx={{
          color: '#ffffff',
          '&.Mui-focused': { color: '#ffffff' }
        }}
      >Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{
          color: '#ffffff',
          '.MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
          '.MuiSvgIcon-root': { color: '#ffffff' }
        }}
      >
        <MenuItem value='light'>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }} >
            <LightModeIcon fontSize='small' /> Light
          </Box>
        </MenuItem>
        <MenuItem value='dark'>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }} >
            <NightsStayIcon fontSize='small' /> Dark
          </Box>
        </MenuItem>
        <MenuItem value='system'>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize='small' /> System
          </Box>
        </MenuItem>

      </Select>
    </FormControl >
  )
}

export default ModeSelection
