document.addEventListener('DOMContentLoaded', (event) => {
    const registerForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Lấy các trường dữ liệu từ form
            const usernameField = registerForm.querySelector('input[name="username"]');
            const passwordField = registerForm.querySelector('input[name="password"]');
            const message = registerForm.querySelector('.message-error');

            // Xóa lớp input-error nếu có
            usernameField.addEventListener('input', function () {
                message.innerHTML = ''; // Xóa nội dung thông báo lỗi
            });
            passwordField.addEventListener('input', function () {
                message.innerHTML = ''; // Xóa nội dung thông báo lỗi
            });

            // Kiểm tra nếu một trong các trường dữ liệu không có giá trị
            if (!usernameField.value || !passwordField.value) {
                // Thêm lớp input-error vào các trường dữ liệu
                message.innerHTML = 'Vui lòng điền đầy đủ thông tin';
                return;
            }

            // Gửi dữ liệu đăng ký lên server
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameField.value,
                    password: passwordField.value
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        message.innerHTML = data.error;
                    }
                    else if (data.suscess) {
                        alert(data.suscess);
                        window.location.replace('/');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                }
                )
        });
    } else {
        console.error('Form not found');
    }
});
