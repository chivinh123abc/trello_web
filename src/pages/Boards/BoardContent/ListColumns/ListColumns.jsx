import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

function ListColumns({ columns }) {
  return (
    // Sortable Context yeu cau items la 1 mang dan ['id-1', 'id-2']
    // Chu khong phai [{id: 'id-1'},{id:'id-2'}]
    //Neu khong dung thi van keu tha dc nhung k co Animation
    // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-81259512
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

        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
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

      </Box >
    </SortableContext >
  )
}

export default ListColumns
