const submitEditBin = document.getElementById("submit-edit-btn");
const avatar = document.getElementById("avatar");
const avatarImg = document.querySelector('.edit-profile__info-avatar-img');
const username = document.getElementById("username").textContent.substring(1);

let file;


avatar.addEventListener("change", function (event) {
    file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            avatarImg.src = e.target.result; // Hiển thị ảnh tạm thời
        };
        reader.readAsDataURL(file); // Đọc file dưới dạng URL
    }
});

submitEditBin.onclick = function () {
    const fullName = document.getElementById("fullName").value;
    const bio = document.getElementById("bio").value;

    const data = new FormData();
    if (file) data.append('avatar', file);
    data.append('fullName', fullName);
    data.append('bio', bio);

    fetch(`/profile/${username}/stored`, {
        method: 'PUT',
        body: data,
    })
        .then(response => response.json())
        .then(data => {
            if (data == 'Success') {
                window.location.href = `/profile/${username}`;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        }
        )
}

