import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { InputAdornment, TextField } from '@mui/material'

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const exitAddNewColums = () => {
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Khong duoc de trong ten Column')
      return
    }
    // console.log(newColumnTitle)
    //Goi API o day....

    //Dong trang thai them column & clear Input
    exitAddNewColums()
  }

  // Sortable Context yeu cau items la 1 mang dan ['id-1', 'id-2']
  // Chu khong phai [{id: 'id-1'},{id:'id-2'}]
  //Neu khong dung thi van keu tha dc nhung k co Animation
  // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-81259512
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column key={column._id} column={column} />)}
        {/* {columns?.map(column => {
        return <Column key={column._id} />
        })} */}
        {/* Co the doi ngoac nhon thanh ngoac tron de bo return */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: '#ffffff',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >Add New Column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title...."
              type="text"
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: '#ffffff' },
                '& input': { color: '#ffffff' },
                '& label.Mui-focused': { color: '#ffffff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ffffff'
                  },
                  '&:hover fieldset': {
                    borderColor: '#ffffff'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff'
                  }
                }
              }}
            />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Button
                onClick={addNewColumn}
                variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: '#ffffff',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={exitAddNewColums}
              />
            </Box>
          </Box>
        }

      </Box >
    </SortableContext >
  )
}

export default ListColumns
