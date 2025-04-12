
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
        * Video 37.2 cach  xu ly bug logic thu  vien dnd kit khi Column la rong
        * Phia FE se tu  tao 1  cai card dac  biet: PlaceholderCard , khong lien qan den BE
        * Card  nay se dc an o giao dien UI nguoi  dung
        * Cau truc Id cua cai card nay de Unique rat don gian khong can phai random phuc tap:
        * "columnId-placeholder-card" (moi column chi co the co toi da 1 placeHolderCard)
        * quan trong khi tao: phai day du (_id, boardId, columnId, FE_PlaceholderCard)
        */
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}