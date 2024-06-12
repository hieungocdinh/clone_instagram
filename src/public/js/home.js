document.addEventListener('DOMContentLoaded', function () {
    const posts = document.querySelectorAll('.post');
    const postsContent = document.querySelectorAll('.post__content');
    let postImages = [];
    const input = document.querySelector('.create-post__input-text');
    const modal = document.getElementById('postModal');
    const postBtn = document.querySelector('.modal-content__footer-btn');
    const closeBtn = document.querySelector('.close-btn');
    const uploadBtn = document.querySelector('.modal-content__body-upload-img-btn');
    const imageUpload = document.getElementById('imageUpload');
    const previewContainer = document.querySelector('.modal-content__body-upload-img');

    // suggestion follow
    $('.suggestion-follow-btn').click(function () {
        const button = $(this); // Lưu trữ 'this' vào biến 'button'
        const username = button.data('username');
        fetch(`/following/follow/${username}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // Ẩn nút "Follow" và hiện nút "Following"
                    button.hide();
                    button.siblings('.suggestion-unfollow-btn').show();
                }
            });

    });

    $('.suggestion-unfollow-btn').click(function () {
        const button = $(this); // Lưu trữ 'this' vào biến 'button'
        const username = button.data('username');
        fetch(`/following/unfollow/${username}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // Ẩn nút "Following" và hiện nút "Follow"
                    button.hide();
                    button.siblings('.suggestion-follow-btn').show();
                }
            });
    });

    //show images in post
    // POST MULTIPLE MEDIAS
    // Creating scroll buttons and indicators when post has more than one media
    posts.forEach((post) => {
        if (post.querySelectorAll('.post__media').length > 1) {
            const leftButtonElement = document.createElement('button');
            leftButtonElement.classList.add('post__left-button');
            leftButtonElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="#fff" d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z"></path>
      </svg>
    `;

            const rightButtonElement = document.createElement('button');
            rightButtonElement.classList.add('post__right-button');
            rightButtonElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="#fff" d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z"></path>
      </svg>
    `;

            post.querySelector('.post__content').appendChild(leftButtonElement);
            post.querySelector('.post__content').appendChild(rightButtonElement);

            post.querySelectorAll('.post__media').forEach(function () {
                const postMediaIndicatorElement = document.createElement('div');
                postMediaIndicatorElement.classList.add('post__indicator');

                post
                    .querySelector('.post__indicators')
                    .appendChild(postMediaIndicatorElement);
            });

            // Observer to change the actual media indicator
            const postMediasContainer = post.querySelector('.post__medias');
            const postMediaIndicators = post.querySelectorAll('.post__indicator');
            const postIndicatorObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Removing all the indicators
                            postMediaIndicators.forEach((indicator) =>
                                indicator.classList.remove('post__indicator--active')
                            );
                            // Adding the indicator that matches the current post media
                            postMediaIndicators[
                                Array.from(postMedias).indexOf(entry.target)
                            ].classList.add('post__indicator--active');
                        }
                    });
                },
                { root: postMediasContainer, threshold: 0.5 }
            );

            // Calling the observer for every post media
            const postMedias = post.querySelectorAll('.post__media');
            postMedias.forEach((media) => {
                postIndicatorObserver.observe(media);
            });
        }
    });

    // Adding buttons features on every post with multiple medias
    postsContent.forEach((post) => {
        if (post.querySelectorAll('.post__media').length > 1) {
            const leftButton = post.querySelector('.post__left-button');
            const rightButton = post.querySelector('.post__right-button');
            const postMediasContainer = post.querySelector('.post__medias');

            // Functions for left and right buttons
            leftButton.addEventListener('click', () => {
                postMediasContainer.scrollLeft -= 400;
            });
            rightButton.addEventListener('click', () => {
                postMediasContainer.scrollLeft += 400;
            });

            // Observer to hide button if necessary
            const postButtonObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach((entry) => {
                        if (entry.target === post.querySelector('.post__media:first-child')) {
                            leftButton.style.display = entry.isIntersecting ? 'none' : 'unset';
                        } else if (
                            entry.target === post.querySelector('.post__media:last-child')
                        ) {
                            rightButton.style.display = entry.isIntersecting ? 'none' : 'unset';
                        }
                    });
                },
                { root: postMediasContainer, threshold: 0.5 }
            );

            if (window.matchMedia('(min-width: 1024px)').matches) {
                postButtonObserver.observe(
                    post.querySelector('.post__media:first-child')
                );
                postButtonObserver.observe(post.querySelector('.post__media:last-child'));
            }
        }
    });


    // modal display
    input.addEventListener('focus', function () {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        const content = document.getElementById('post-content').value;
        if (content) {
            input.value = content;
        }
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            const content = document.getElementById('post-content').value;
            if (content) {
                input.value = content;
            }
            modal.style.display = 'none';
        }
    });

    // upload image
    uploadBtn.addEventListener('click', function () {
        const message = document.querySelector('.modal-content__body-message');
        if (message.innerHTML !== '') {
            message.innerHTML = '';
        }
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function () {
        Array.from(this.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('modal-content__body-upload-img-preview');

                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('modal-content__body-upload-img-preview-img');

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('modal-content__body-upload-img-preview-delete');
                deleteBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                    </svg>
                `;
                deleteBtn.addEventListener('click', function () {
                    imgContainer.remove();
                    const index = postImages.indexOf(file);
                    if (index > -1) {
                        postImages.splice(index, 1); // Xóa tệp khỏi mảng postImages
                    }
                });

                imgContainer.appendChild(img);
                imgContainer.appendChild(deleteBtn);
                previewContainer.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);

            postImages.push(file);
        });
    });
    //create post
    postBtn.addEventListener('click', function () {
        const content = document.getElementById('post-content').value;
        const place = document.getElementById('post-place').value;
        const data = new FormData();

        if (postImages.length === 0) {
            const message = document.querySelector('.modal-content__body-message');
            message.innerHTML = 'Vui lòng chọn ảnh của bạn để đăng bài viết !!!';
            return;
        }


        data.append('content', content);
        data.append('location', place);
        postImages.forEach((image) => {
            data.append(`images`, image);
        });
        // Gửi POST request đến '/post/create' với dữ liệu là 'data'
        fetch('/post/create', {
            method: 'POST',
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    window.location.reload(); // Tải lại trang web
                }
                else {
                    console.log('Something went wrong');
                }
            }
            );
    });

    //like post
    $('.post__button-like').click(function () {
        const button = $(this);
        const postId = button.data('post-id');

        fetch(`/post/like/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    button.find('.post__count-like').html(data.countLikes);
                    //display liked icon
                    const like = button.find('.post__icon-like');
                    const liked = button.find('.post__icon-liked');

                    if (like.css('display') === 'block') {
                        like.css('display', 'none');
                        liked.css('display', 'block');
                    } else {
                        like.css('display', 'block');
                        liked.css('display', 'none');
                    }
                }
            }
            );
    });

    // comment post
    $('.post__button-comment').click(function () {
        const button = $(this); // Lưu trữ 'this' vào biến 'button'
        const postId = button.data('post-id');


        window.location.href = `/post/${postId}`;
    });


});

