const editProfileBtn = document.getElementById("edit-profile");
const username = document.getElementById("username").innerText.substring(1);
const followBtn = document.getElementById("follow-btn");
const unfollowBtn = document.getElementById("unfollow-btn");
const settingBtn = document.getElementById("setting");
const modal = document.getElementById("modal");


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
        });

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
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


});
