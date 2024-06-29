document.addEventListener('DOMContentLoaded', function () {
    const searchBtnMobile = document.querySelector('.search__mobile-btn');

    // Follow
    $('.search-btn-follow').click(function () {
        const button = $(this);
        const username = button.data('username');
        fetch(`/following/follow/${username}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    button.siblings('.search-btn-unfollow').removeClass('hide');
                    button.addClass('hide');
                }
            });
    });
    // // Unfollow
    $('.search-btn-unfollow').click(function () {
        const button = $(this);
        const username = button.data('username');
        fetch(`/following/unfollow/${username}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    button.siblings('.search-btn-follow').removeClass('hide');
                    button.addClass('hide');
                }
            });
    });

    // Search in mobile
    searchBtnMobile.addEventListener('click', function () {
        const searchInputMobile = document.querySelector('.search__mobile-input');
        const searchValue = searchInputMobile.value.trim();
        if (searchValue.length > 0) {
            window.location.href = `/search?q=${searchValue}`;
        }
    });
});