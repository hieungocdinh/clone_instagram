document.addEventListener('DOMContentLoaded', function () {
    const profileButton = document.querySelector('.profile-button');
    const profileMenu = document.getElementById('profileMenu');
    const headerSearch = document.querySelector('.header__search-input');
    const headerSearchBtn = document.querySelector('.header__search-btn');
    const profileBtnMobile = document.getElementById('profile-button-mobile');

    profileButton.addEventListener('click', function () {
        profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Đóng menu khi nhấp bên ngoài
    window.addEventListener('click', function (e) {
        if (!profileButton.contains(e.target) && !profileMenu.contains(e.target)) {
            profileMenu.style.display = 'none';
        }
    });

    // search
    function performSearch() {
        const searchValue = headerSearch.value.trim();
        if (searchValue.length > 0) {
            console.log('Search', searchValue);
            window.location.href = `/search?q=${searchValue}`;
        }
    }

    headerSearchBtn.addEventListener('click', performSearch);

    headerSearch.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // profile button mobile
    profileBtnMobile.addEventListener('click', function () {
        const username = profileBtnMobile.dataset.username;
        window.location.href = `/profile/${username}`;
    });

});


