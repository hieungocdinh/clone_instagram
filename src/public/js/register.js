document.addEventListener('DOMContentLoaded', (event) => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Lấy các trường dữ liệu từ form
            const usernameField = registerForm.querySelector('input[name="username"]');
            const phoneNumberField = registerForm.querySelector('input[name="phoneNumber"]');
            const emailField = registerForm.querySelector('input[name="email"]');
            const passwordField = registerForm.querySelector('input[name="password"]');
            const passwordConfirmField = registerForm.querySelector('input[name="password-confirm"]');
            const message = registerForm.querySelector('.message-error');


            // Kiểm tra nếu một trong các trường dữ liệu không có giá trị
            if (!usernameField.value || !phoneNumberField || !emailField.value || !passwordField.value || !passwordConfirmField.value) {
                // Thêm lớp input-error vào các trường dữ liệu
                message.innerHTML = 'Vui lòng điền đầy đủ thông tin';
                return;
            }

            // Kiểm tra nếu mật khẩu không khớp
            if (passwordField.value !== passwordConfirmField.value) {
                // Thêm lớp input-error vào các trường mật khẩu
                passwordField.classList.add('input-error');
                passwordConfirmField.classList.add('input-error');
                message.innerHTML = 'Mật khẩu không khớp';
                return;
            } else {
                // Xóa lớp input-error nếu mật khẩu khớp
                passwordField.classList.remove('input-error');
                passwordConfirmField.classList.remove('input-error');
            }

            // Gửi dữ liệu đăng ký lên server
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameField.value,
                    phoneNumber: phoneNumberField.value,
                    email: emailField.value,
                    password: passwordField.value
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        message.innerHTML = data.error;
                    }
                    else if (data.success) {
                        alert(data.success);
                        window.location.replace('/login');
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
