
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


// Kỹ thuật dùng css-pointer-event để chặn user spam click tại bất kỳ nơi nào có hành động click gọi api
// Đây là kỹ thuật hay tận dụng  Axios Interceptors và CSS Pointer-events để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// Cách  dùng:  với tất cả  link or button mà có gọi api thì thêm class "interceptor -loading" là đc
export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll('.interceptor-loading')
  // console.log('🚀 ~ interceptorLoadingElements ~ elements:', elements)
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      //Neu dang trong thoi gian cho goi api thi se lam mo phan tu va chan click bang CSS pointer envent
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}