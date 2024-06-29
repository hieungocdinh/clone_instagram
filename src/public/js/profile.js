const editProfileBtn = document.getElementById("edit-profile");
const username = document.getElementById("username").innerText.substring(1);
const followBtn = document.getElementById("follow-btn");
const unfollowBtn = document.getElementById("unfollow-btn");
const settingBtn = document.getElementById("setting");
const modal = document.getElementById("modal");
const settingOption = document.querySelector(".modal__profile-options");
const getFollowersBtn = document.querySelector(".get-followers-btn");
const getFollowingBtn = document.querySelector(".get-following-btn");
const getFollowersBtnMobile = document.querySelector(".profile__mobile-followers-info");
const getFollowingBtnMobile = document.querySelector(".profile__mobile-following-info");
const listFollowers = document.getElementById("list-followers");
const listFollowing = document.getElementById("list-following");


function openSection(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName(
        "profile__section__tab__tabcontent"
    );
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

document.addEventListener("DOMContentLoaded", function () {
    // Edit profile
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", function () {
            window.location.href = `/profile/${username}/edit`;
        });
    }
    // Follow
    if (followBtn) {
        followBtn.addEventListener("click", function () {
            fetch(`/following/follow/${username}`, {
                method: "POST",
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        // console.log(data.message);
                        window.location.reload();
                    }
                });
        });
    }

    // Unfollow
    if (unfollowBtn) {
        unfollowBtn.addEventListener("click", function () {
            fetch(`/following/unfollow/${username}`, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        // console.log(data.message);
                        window.location.reload();
                    }
                    else {
                        console.error(data.message);
                    }
                });
        });
    }

    // get post
    $('.profile__section__tab__tabcontent__container__post').click(function () {
        const button = $(this);
        const postId = button.data('post-id');
        window.location.href = `/post/${postId}`;
    });

    // Setting
    if (settingBtn) {
        settingBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            settingOption.style.display = 'block';
        });

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                settingOption.style.display = 'none';
            }
        });

        $('.modal__profile-option').click(function () {
            const btn = $(this);
            const option = btn.data('option');
            switch (option) {
                case 'logout':
                    window.location.href = '/logout';
                    break;
                default:
                    break;
            }
        });
    }


    // get followers
    getFollowersBtn.addEventListener('click', function () {
        modal.style.display = 'block';
        listFollowers.style.display = 'block';

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                listFollowers.style.display = 'none';
            }
        });

    });
    // in mobile
    getFollowersBtnMobile.addEventListener('click', function () {
        modal.style.display = 'block';
        listFollowers.style.display = 'block';

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                listFollowers.style.display = 'none';
            }
        });

    });

    // get following
    getFollowingBtn.addEventListener('click', function () {
        modal.style.display = 'block';
        listFollowing.style.display = 'block';

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                listFollowing.style.display = 'none';
            }
        });

    });
    // in mobile
    getFollowingBtnMobile.addEventListener('click', function () {
        modal.style.display = 'block';
        listFollowing.style.display = 'block';

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                listFollowing.style.display = 'none';
            }
        });

    });

    // exit list followers and following
    $('.modal__profile-user-header__close-btn').click(function () {
        modal.style.display = 'none';
        listFollowers.style.display = 'none';
    });

    // unfollow and follow in list follow
    $('.modal__profile-user-main__list-item__follow-btn').click(function () {
        const button = $(this);
        const username = button.data('username');
        fetch(`/following/follow/${username}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    button.siblings('.modal__profile-user-main__list-item__unfollow-btn').removeClass('hide');
                    button.addClass('hide');
                }
            });
    });

    $('.modal__profile-user-main__list-item__unfollow-btn').click(function () {
        const button = $(this);
        const username = button.data('username');
        fetch(`/following/unfollow/${username}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    button.siblings('.modal__profile-user-main__list-item__follow-btn').removeClass('hide');
                    button.addClass('hide');
                }
            });
    });

    // search user in list followers and following
    $('.modal__profile-user-main__search-input').keyup(function () {
        const input = $(this);
        const searchTerm = input.val().toLowerCase();

        // Find the closest list container to the input field
        const listContainer = input.closest('.modal__profile-user-main').find('.modal__profile-user-main__list');

        // Get all list items in the list container
        const listItems = listContainer.find('.modal__profile-user-main__list-item');

        // Iterate over each list item
        listItems.each(function () {
            const item = $(this);
            const username = item.data('username').toLowerCase();
            const fullName = item.data('fullname').toLowerCase();

            // Check if the username or fullName contains the search term
            if (username.includes(searchTerm) || fullName.includes(searchTerm)) {
                item.show(); // Show the item if it matches
            } else {
                item.hide(); // Hide the item if it doesn't match
            }
        });
    });


});
