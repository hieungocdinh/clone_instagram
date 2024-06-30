document.addEventListener('DOMContentLoaded', () => {
    const post = document.querySelector('.post');
    const postImage = document.querySelectorAll('.post__images');
    const commentBtnSend = document.querySelector('.post__content__comment-send-btn');
    const commentBtn = document.querySelector('.post__button-comment');
    const commentInput = document.querySelector('.post__content__comment-send-input');
    const backBtn = document.querySelector('.post__back');
    const moreBtn = document.querySelector('.post__content__user-more');
    const modal = document.getElementById('modal');
    const modalPostOption = document.querySelector('.modal__post-options');
    const modalPostConfirmDelete = document.querySelector('.modal__post-confirm-delete');
    const modalPostEdit = document.querySelector('.modal-post-edit');
    const modalPostEditCloseBtn = document.querySelector('.close-btn');
    const uploadBtn = document.querySelector('.modal-post-edit__body-upload-img-btn');
    const imageUpload = document.getElementById('imageUpload');
    const previewContainer = document.querySelector('.modal-post-edit__body-upload-img');
    const postPlaceEdit = document.getElementById('post-place');
    const postEditbtn = document.querySelector('.modal-post-edit__footer-btn');

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

        post.querySelector('.post__images').appendChild(leftButtonElement);
        post.querySelector('.post__images').appendChild(rightButtonElement);

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


    // Adding buttons features on every post with multiple medias
    postImage.forEach((post) => {
        if (post.querySelectorAll('.post__media').length > 1) {
            const leftButton = post.querySelector('.post__left-button');
            const rightButton = post.querySelector('.post__right-button');
            const postMediasContainer = post.querySelector('.post__medias');

            // Functions for left and right buttons
            leftButton.addEventListener('click', () => {
                postMediasContainer.scrollLeft -= 600;
            });
            rightButton.addEventListener('click', () => {
                postMediasContainer.scrollLeft += 600;
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

    // Back to current page
    backBtn.addEventListener('click', () => {
        window.history.back();
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
    // focus comment input
    commentBtn.addEventListener('click', () => {
        commentInput.focus();
    });

    commentInput.addEventListener('focus', () => {
        commentInput.setAttribute('placeholder', '');
    });

    commentInput.addEventListener('blur', () => {
        commentInput.setAttribute('placeholder', 'Thêm bình luận...');
    });

    //when input change
    commentInput.addEventListener('input', () => {
        if (commentInput.value.length > 0) {
            commentBtnSend.style.color = '#429aff';
        }
        else {
            commentBtnSend.style.color = '#ccc';
        }
    });


    // comment post
    commentBtnSend.addEventListener('click', () => {
        const commentInput = document.querySelector('.post__content__comment-send-input').value;
        const postId = commentBtnSend.dataset.id;
        fetch(`/post/comment/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: commentInput }),
            method: 'POST',
        }
        )
            .then((res) => res.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                }
            })
            .catch((err) => {
                console.error(err);
            });

    });

    // modal
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modalPostOption.style.display = 'block';
                modalPostConfirmDelete.style.display = 'none';
                modal.style.display = 'none';
                modalPostEdit.style.display = 'none';
            }
        });

        $('.modal__post-option').click(function () {
            const btn = $(this);
            const option = btn.data('option');
            switch (option) {
                case 'exit':
                    modal.style.display = 'none';
                    break;
                case 'delete':
                    modalPostOption.style.display = 'none';
                    modalPostConfirmDelete.style.display = 'block';
                    break;
                case 'edit':
                    modalPostOption.style.display = 'none';
                    modalPostEdit.style.display = 'block';
                    postPlaceEdit.value = postPlaceEdit.dataset.location;
                    break;
                default:
                    break;
            }
        });

        $('.modal__post-confirm__action').click(function () {
            const btn = $(this);
            const action = btn.data('action');
            if (action === 'exit') {
                modalPostConfirmDelete.style.display = 'none';
                modalPostOption.style.display = 'block';
            }
            if (action === 'delete') {
                const postId = btn.data('post-id');
                const username = btn.data('username');

                fetch(`/post/delete/${postId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'DELETE',
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            window.location.href = `/profile/${username}`;
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        });

        modalPostEditCloseBtn.addEventListener('click', () => {
            modalPostOption.style.display = 'block';
            modalPostEdit.style.display = 'none';
        });

        // edit post
        let postImages = [];
        let postImgsPrevious = [];
        const postImgsPreviousPrv = document.querySelectorAll('.modal-post-edit__body-upload-img-preview-img-previous');
        postImgsPreviousPrv.forEach((img) => {
            // Sử dụng URL object để lấy pathname
            let url = new URL(img.src);
            let imgSrc = url.pathname;
            postImgsPrevious.push(imgSrc);
        });
        $('.modal-post-edit__body-upload-img-preview-delete-previous').click(function () {
            const btn = $(this);
            const index = btn.data('index');
            postImgsPrevious.splice(index, 1);
            btn.parent().remove();
            console.log(postImgsPrevious);
        });
        // upload image
        uploadBtn.addEventListener('click', function () {
            const message = document.querySelector('.modal-post-edit__body-message');
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
                    imgContainer.classList.add('modal-post-edit__body-upload-img-preview');

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('modal-post-edit__body-upload-img-preview-img');

                    const deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('modal-post-edit__body-upload-img-preview-delete');
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
        postEditbtn.addEventListener('click', function () {
            const message = document.querySelector('.modal-post-edit__body-message');
            const content = document.querySelector('.modal-post-edit__body-input-text').value;
            const postId = postEditbtn.dataset.id;
            const location = postPlaceEdit.value;
            if (content === '' && postImages.length === 0 && postImgsPrevious.length === 0) {
                message.innerHTML = 'Nội dung không được để trống';
                return;
            }

            const formData = new FormData();
            formData.append('content', content);
            formData.append('location', location);
            if (postImages.length > 0) {
                postImages.forEach((file) => {
                    formData.append('images', file);
                });
            }
            formData.append('postImgsPrevious', JSON.stringify(postImgsPrevious));
            // formData.forEach((value, key) => {
            //     console.log(key, value);
            // });
            fetch(`/post/edit/${postId}`, {
                method: 'PUT',
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        window.location.href = `/post/${postId}`;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    }
});