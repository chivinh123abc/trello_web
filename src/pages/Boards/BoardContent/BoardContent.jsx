import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'

import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { generatePlaceholderCard } from '~/utils/formatters'


const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard, moveColumns }) {
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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([null])
  // Diem va cham cuoi cung truoc do(xu ly thuat toan phat hien va cham  vd37)
  const lastOverId = useRef(null)

  useEffect(() => {
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnsState(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //Tim  mot cai column theo cardID
  const findColumnByCardId = (cardId) => {
    //Can luu y, nen dung c.cards thay vi c.cardOrderIds boi vi
    //o buoc handleDragOver chung  ta lam du lieu cho cards hoan chinh truoc roi moi tao cardOrderIds moi
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //Function chung xu ly viec cap nhat lai state trong khi di chuyen
  const moveCardBetweenDifferentColumns = (
    overColumn,
    activeColumn,
    over,
    active,
    overCardId,
    activeDraggingCardId,
    activeDraggingCardData) => {
    setOrderedColumnsState(prevColumns => {
      // Tim  vi tri cua overCard trong column dich(noi activeCard sap dc tha)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      //Logic  tinh toan newCardIndex (tren hoac duoi cua overCard) lay chuan ra tu code  cua thu vien
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //Clone mang OrderedColulmsState cu ra 1 cai moi roi xu ly data roi moi return
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
      // Column Cu~
      if (nextActiveColumn) {
        //Xoa card o column active (column cu) luc ma keo card khoi de sang column khac
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //Them placeHoderCard neu column rong: 37.2
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        //Cap nhat lai cardOrderids cho chuan du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      //Column moi
      if (nextOverColumn) {
        //Kiem  tra card dang keo co ton tai o overColumn chua, neu co thi can xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        //Phai cap  nhat lai chuan du lieu columnId trong card sau khi
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        //Them card dang keo vao column theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        //Xoa placeholderCard khi dang ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlacehoderCard)

        //cap nhat lai cardOrderedIds cho chuan du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  //Trigger Khi bat dau keo 1 phan tu
  const handleDragStart = (event) => {
    // console.log('HandleDragStart: ', event)
    setActiveDragItemId(event?.active.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //Neu la keo card thi moi set oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active.id))
    }
  }

  //Trigger trong qua trinh keo (drag) 1 phan tu
  const handleDragOver = (event) => {
    //Khong lam gi them neu dang keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Con neu keo card thi xu ly them de co the keo card qua lai giua cac column
    // console.log('Handle DragOver', event)
    const { active, over } = event
    //Kiem tra neu khong ton tai over (khi  keo ra khoi pham vi container) tranh crash trang
    if (!over || !active) return

    //activeDragingCard:la card dang dc keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    //overCard la  card tuong tac tren hoac duoi cai card dang dc keo o tren
    const { id: overCardId } = over

    //tim 2 columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // Xu ly logic khi keo card qua 2 column khac nhau, con neu keo trong chinh column ban dau thi khong can lam gi
    // Vi day la dang xu ly logic luc keo (Dragover), con luc keo xong xuoi thi van de nam o handleDragEnd
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        activeColumn,
        over,
        active,
        overCardId,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  //Trigger Khi ket thuc hanh dong keo (drop) 1 phan tu
  const handleDragEnd = (event) => {
    const { active, over } = event
    // Kiem tra neu khong ton tai over (khi  keo ra khoi pham vi container) tranh crash trang
    if (!over || !active) return
    // Neu vi tri moi sau keo tha khac voi vi tri ban dau

    // console.log('HandleDragend: ', event)
    // Xy ly keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDragingCard:la card dang dc keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      //overCard la  card tuong tac tren hoac duoi cai card dang dc keo o tren
      const { id: overCardId } = over

      //tim 2 columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return
      // co the dung {activeDragItemData} or {oldColumnWhenDraggingCard._id} (set vao state tu buoc handleDragStart) chu khong phai activeData
      // trong scope handleDragEnd vi sau khi di qua onDragOver toi day la state cua card da bi cap nhat 1 lan
      // if (activeDragItemData.columnId !== overColumn._id) => co bug do khong doi gia tri cua column khi di qua column khac trong over
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // console.log('2 column khac nhau')
        moveCardBetweenDifferentColumns(
          overColumn,
          activeColumn,
          over,
          active,
          overCardId,
          activeDraggingCardId,
          activeDraggingCardData)
      } else {
        //Hanh dong keo tha card trong cung 1 column
        //Lay vi tri cu tu oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Lay vi tri moi tu thang over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // dung arrayMove vi keo card  trong  1 column trong tu luc keo 1 column trong boardContent
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumnsState(prevColumns => {
          //Clone mang OrderedColulmsState cu ra 1 cai moi roi xu ly data roi moi return
          const nextColumns = cloneDeep(prevColumns)
          //Tim toi column dang tha
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          //Cap nhat 2 gia tri moi la card va cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumns
        })
      }

    }

    // Xu ly keo tha column trong 1 boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Neu vi tri keo tha khac vi tri ban dau
      if (active.id !== over.id) {
        //Lay vi tri cu
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Lay vi tri moi
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        // Xu ly vi tri
        // Dung arrayMove cua dnd-kit de sap xep lai Columns ban dau
        // dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // goi len moveColumns nam o component cha cao nhat
        moveColumns(dndOrderedColumns)

        // Van goi update Stat de tranh delay or flickering giao dien luc keo tha can phai cho goi api
        setOrderedColumnsState(dndOrderedColumns)
      }
    }
    //Nhung du lieu sau khi keo tha nay luon phai set ve null mac dinh
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // console.log('HandleDragId: ', activeDragItemId)
  // console.log('HandleDragType: ', activeDragItemType)
  // console.log('HandleDragData: ', activeDragItemData)

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  //Custom lai strategy cua thuat toan phat hien va cham
  //==>  toi uu cho viec keo tha card giua nhieu columns (vd 37)
  const collisionDetectionStrategy = useCallback((args) => {
    //Truong hop keo column thi dung closetCorners isdabet
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    //Tim cac diem giao nhau, va cham - intersection voi con tro
    const pointerIntesections = pointerWithin(args)

    //Thuat toan phat hien  va cham se tra ve mot mang cac va cham o day
    //neu pointerIntersection la mang  rong  return ngay  va do nothing
    //fix  flickering triet de trong truong hop  nay
    // const intersections = pointerInterections?.length > 0
    if (!pointerIntesections?.length) {
      return
    }

    //Thuat toan  phat hien va cham tra ve 1 mang cac  va cham o day (k can buoc nay nx - vd 37.1)
    // const intersections = !!pointerInterections?.length
    //   ? pointerInterections
    //   : rectIntersection(args)

    //tim  overId dau tien trong dam pointerInterection o tren
    let overId = getFirstCollision(pointerIntesections, 'id')
    if (overId) {
      //neu over la column se tim toi card  id gan nhat ben trong khu vuc va cham dua vao
      //thuat toan phat hien va cham closestCorners (muot hon centers 1 ti) - vd 37
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('OverId before: '.overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds.includes(container.id))
          })
        })[0]?.id
        // console.log('OverId after: '.overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    //Neu  overId la null thi tra ve mang rong, tranh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      // Cam bien - video so 30
      sensors={sensors}
      // Thuat toan phat hien va cham (neu k co no thi card vs cover lon se khong keo qua Column khac dc
      // vi luc nay bi conflict giua card va column), chung ta se dung closestCorners thay vi closetCenter

      //Neu chi dung closestCorner  se co bug flickering + sai lech du lieu (video 37)
      // collisionDetection={closestCorners}
      //Tu custom nang cao thuat toan pha hien va cham (vd 37)
      collisionDetection={collisionDetectionStrategy}

      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
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
