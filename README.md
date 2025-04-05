Mô tả:Có 2 website 1 web gửi tọa độ vị trí, thông tin, tên, tình trạng đang có rồi gửi đi. Rồi người dùng sẽ nhận về 1 gợi ý là nên làm gì trước khi người cứu hộ đến ( do AI đọc hình ảnh, tin nhắn, địa chỉ. AI sẽ phân tích hình ảnh + xem xét địa hình tại vị trí đó ( google maps API) + thời tiết tại vị trí đó hoạt dự báo thời tiết những ngày tiếp the. Rồi AI sẽ đưa ra kết luận trả về cho người dùng). Còn Phía website dành cho đội cứu hộ. Sẽ có những tính năng như Chat với AI. Có Map hiện thị các vị trí của người cần cứu hộ, các gợi ý do AI với từng trường hợp. Ai sẽ đọc hết dữ liệu của người dùng. Lịch sử cứu hộ của từng người, khoảng cách từ người dùng đến vị trí đó. Rồi đưa ra gợi ý nên giúp trường hợp nào trước. Trên map có popup hiện thị đỏ và xanh để đánh giá mức độ ưu tiên thấp vào cao dựa vào tình trạng (do AI quản lý).  Có 1 trang thời tiết, khi ấn vào nó sẽ hiện thị các vị trí, ấn vào từng vị trí nó sẽ hiện thị ra thời tiết trực tiếp tại thời gian đó vị trí đó. Có tính năng chat team giữa các người trong đội cứu  hộ. Có tính năng đăng nhập đăng xuất, mỗi người dùng trong đội cứu hộ sẽ có lịch sử nổi bật đã cứu hộ khác nhau ( ví dụ như: giúp người đuối nước, hay chữa cháy, liên quan tới y tế…..). 

*Công nghệ sử dụng:

-Node.js, Tailwind CSS, React, TypeScript, Python Flask.

-React-Leaflet (bao gồm Leaflet Routing Machine, Leaflet Distance): Cung cấp tính năng xây dựng bản đồ, bao gồm các thành phần như marker, popup và tính năng đo khoảng cách chính xác.

-Socket.io + ReactJS: Hỗ trợ giao tiếp thời gian thực giữa các người dùng, tạo môi trường trò chuyện nhóm (Group Chat) và trao đổi thông tin nhanh chóng.

*Tính năng nổi bật:

-Cập nhật thông tin theo thời gian thực: Mọi thay đổi về tình trạng cứu hộ sẽ được cập nhật ngay lập tức, giúp đội cứu hộ nhanh chóng nhận diện tình huống.

-Tích hợp AI để phân tích hình ảnh: Khi người dùng gửi hình ảnh về tình trạng, địa chỉ và các thông tin liên quan, AI sẽ tự động phân tích các yếu tố như tình trạng hiện tại, dữ liệu thời tiết, và đánh giá địa hình khu vực để cung cấp các lời khuyên hữu ích cho đội cứu hộ.

-Dự báo thời tiết chính xác: Trang Dashboard lấy dữ liệu thời tiết thực tế từ API của OpenWeatherMap, giúp đội cứu hộ nắm bắt được tình hình thời tiết tại các địa điểm cần cứu hộ.

-Website này không chỉ đảm bảo sự kết nối giữa các thành viên cứu hộ, mà còn cung cấp công cụ hỗ trợ trực quan và thông minh để đảm bảo công tác cứu hộ được thực hiện nhanh chóng và hiệu quả.

