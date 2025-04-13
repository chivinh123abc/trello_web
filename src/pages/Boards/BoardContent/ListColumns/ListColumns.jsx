import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import CloseIcon from '@mui/icons-material/Close'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { TextField } from '@mui/material'
import { generatePlaceholderCard } from '~/utils/formatters'
import { createNewColumnAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

function ListColumns({ columns }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const exitAddNewColums = () => {
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Khong duoc de trong ten Column')
      return
    }
    //Tao du lieu column de goi API
    const newColumnData = {
      title: newColumnTitle
      // boardId: createNewColumn.boardId
    }

    // Goi api tao moi column va lam lai du lieu State Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cap nhat state board
    /**
     * Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone giá trị newBoard nhưng bản chất của spread operator là Shallow Copy/Clone nên dính phải rules Immutability trong Redux Toolkit không dùng được hàm PUSH (sửa giá trị mảng trực tiếp), cách đơn giản nhanh gọn nhất ở trường hợp này của chúng ta là dùng Deep Copy/Clone toàn bộ Board
     */
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    /** Cách thứ 2
     * dùng array.concat thay cho push như docs của ReduxToolkit ở trên vì push như đã nói nó sẽ thay đổi giá trị mảng trực tiếp, còn concat thì merge - ghép mảng lại và tạo ra 1 mảng mới để chúng ta gán lại giá trị nên không có vấn đề gì
     * const newBoard = {...board}
     * newBoard.columns  = newBoard.columns.concat([createdColumn])
     * newBoard.columnOrderIds  = newBoard.columnOrderIds.concat([createdColumn._id])
     */

    dispatch(updateCurrentActiveBoard(newBoard))
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
        {columns?.map(column => <Column
          key={column._id}
          column={column}
        />)}
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
