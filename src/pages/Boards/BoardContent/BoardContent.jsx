import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  // Cung 1 thoi diem chi co 1  phan tu dc keo la column or card
  const [activeDragItemId, setActiveDragItemId] = useState([null])
  const [activeDragItemType, setActiveDragItemType] = useState([null])
  const [activeDragItemData, setActiveDragItemData] = useState([null])

  useEffect(() => {
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnsState(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //Trigger Khi bat dau keo 1 phan tu
  const handleDragStart = (event) => {
    // console.log('HandleDragStart: ', event)
    setActiveDragItemId(event?.active.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  //Trigger Khi ket thuc hanh dong keo (drop) 1 phan tu
  const handleDragEnd = (event) => {
    // console.log('HandleDragend: ', event)
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
      // console.log(active)
      // console.log(over)
      // console.log(dndOrderedColumns)
      // console.log(dndOrderedColumnsIds)

      // Cap nhat lai state colums sau khi theo tha
      setOrderedColumnsState(dndOrderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  // console.log('HandleDragId: ', activeDragItemId)
  // console.log('HandleDragType: ', activeDragItemType)
  // console.log('HandleDragData: ', activeDragItemData)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
