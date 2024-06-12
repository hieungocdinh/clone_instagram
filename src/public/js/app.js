document.addEventListener('DOMContentLoaded', function () {
    const profileButton = document.querySelector('.profile-button');
    const profileMenu = document.getElementById('profileMenu');

    profileButton.addEventListener('click', function () {
        profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Đóng menu khi nhấp bên ngoài
    window.addEventListener('click', function (e) {
        if (!profileButton.contains(e.target) && !profileMenu.contains(e.target)) {
            profileMenu.style.display = 'none';
        }
    });
});


