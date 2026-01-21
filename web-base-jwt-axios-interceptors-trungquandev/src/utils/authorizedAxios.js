// Author: TrungQuanDev: https://youtube.com/@trungquandev
import axios from "axios";

// khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hính chung cho dự án.
let authorizedAxiosInstance = axios.create()
// thời gian chờ tối đa của 1 request : để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials : sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE (phục vụ trường hợp
// nếu chúng ta sử dụng JWT tokens (refresh & access) theo cơ chế httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * cấu hình Interceptors ( Bộ đánh chặn vào giữa mọi request & response)
 * https://axios-http.com/docs/interceptors
 */
// Add a request interceptor: can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use( (config) => {
    // lấy accesstoken từ localstorage và đính kèm vào header 
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken)  {
      // Cần thêm "Bearer " vì chúng ta nên tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng
      // Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền, tham khảo các loại token khác như:
      // Basic token, Digest token, OAuth token, ...vv
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
  },  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
//   { synchronous: true, runWhen: () => /* This function returns true */}
);

// Add a response interceptor: can thiệp vào giữa những response nhận về từ API 
authorizedAxiosInstance.interceptors.response.use( (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Mọi mã http status code nằm trong khoảng 200-299 sẽ là success và rơi vào đây
    // Do something with response data
    return response;
  },  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Mọi mã http status code nằm ngoài khoảng 200-299 sẽ là error và rơi vào đây 
    // Do something with response error
    
   
  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
  // console.log error ra là sẽ thấy cấu trúc data đã tới message lỗi như dưới đây
  // Dùng toastify để hiển thị bất kỳ mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }
  return Promise.reject(error)
  });

export default authorizedAxiosInstance

