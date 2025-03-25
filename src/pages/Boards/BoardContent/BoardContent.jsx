import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'

import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  //Neu dung pointerSensor mac dinh thi phai ket hop thuoc tinh CSS touch-action: none o nhung phan tu keo tha
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  //Yeu  cau chuot di chuyen 10px moi kich hoat event => fix click van co event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //nhan giu 250ms va dung sai cua cam ung(de hieu la di chuyen/ chenh lech 500px) thi voi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Uu tien su dung ket hop 2 loai sensors la mouse va touch de co trai nghiem mobile khong bug :'3
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumnsState] = useState([])

  useEffect(() => {
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnsState(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    console.log('HandleDragend: ', event)
    const { active, over } = event
    // Khi Keo linh tinh ra ngoai screen
    if (!over) return
    // Neu vi tri moi sau keo tha khac voi vi tri ban dau
    if (active.id !== over.id) {
      //Lay vi tri cu
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Lay vi tri moi
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      // Xu ly vi tri
      // Dung arrayMove cua dnd-kit de sap xep lai Columns ban dau
      // dnd-kit/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // 2 cai console.log Sau nay xu ly goi API de thay du lieu trong database
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log(dndOrderedColumns)
      // console.log(dndOrderedColumnsIds)

      // Cap nhat lai state colums sau khi theo tha
      setOrderedColumnsState(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
