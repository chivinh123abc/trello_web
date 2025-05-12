/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react'
import { debounce } from 'lodash'
/**
 * Custom một hook dùng cho debounce function, nhận vào 2 tham số là function và thời gian delay
 * Bài viết tham khảo tại đây:
 * https://trippingoncode.com/react-debounce-hook/
 * https://lodash.com/docs/4.17.15#debounce
 */
export const useDebounceFn = (fnToDebounce, delay = 500) => {
  // Trả lỗi nếu delay nhận vào không phải number
  if (isNaN(delay)) {
    throw new Error('Delay value should be a number.')
  }
  // Tương tự cũng trả luôn nếu fnToDebounce không phải là 1 function
  if (!fnToDebounce || (typeof fnToDebounce !== 'function')) {
    throw new Error('Debounce must have a function')
  }

  // Bọc thực thi debounce từ lodash vào useCallback để tránh re-render nhiều lần, chỉ re-render khi fnToDebounce hoặc delay thay đổi
  return useCallback(debounce(fnToDebounce, delay), [fnToDebounce, delay])
}
