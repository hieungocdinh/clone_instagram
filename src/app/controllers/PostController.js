const fs = require('fs').promises;

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Profile = require('../models/Profile');

function timeSince(date) {
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;
    if (secondsPast < 60) {
        return timecreated = `${Math.floor(secondsPast)} seconds ago.`;
    }
    else if (secondsPast < 3600 && secondsPast >= 60) {
        return timecreated = `${Math.floor(secondsPast / 60)} minutes ago.`;
    }
    else if (secondsPast <= 86400 && secondsPast >= 3600) {
        return timecreated = `${Math.floor(secondsPast / 3600)} hours ago.`;
    }
    else if (secondsPast > 86400) {
        const days = Math.floor(secondsPast / 86400);
        if (days === 1) {
            return timecreated = `Yesterday.`;
        } else {
            return timecreated = `${days} days ago.`;
        }
    }
}

class postController {

    async index(req, res, next) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).send('User not authenticated');
            }

            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).send('Post not found');
            }

            // check if user liked post
            let isLiked = false;
            const postUser = await Profile.findOne({ userId: post.userId });
            if (!postUser) {
                return res.status(404).send('Post user profile not found');
            }

            const like = await Like.findOne({ userId: user.id, postId: post._id });
            if (like) isLiked = true;

            // check post is user's post
            let isUserPost = false;
            if (user.id === post.userId.toString()) {
                isUserPost = true;
            }

            // time post
            let timecreated;
            timecreated = timeSince(post.createdAt);

            const postPage = {
                id: post.id,
                content: post.content,
                images: post.images,
                location: post.location,
                countLikes: post.countLikes,
                countComments: post.countComments,
                avatar: postUser.avatar || 'default-avatar.png',
                username: postUser.username || 'Unknown User',
                isLiked,
                isUserPost,
                timecreated,
            };

            const comments = await Comment.find({ postId: post._id });
            const commentsPage = await Promise.all(comments.map(async (comment) => {
                const commentUser = await Profile.findOne({ userId: comment.userId });
                if (!commentUser) {
                    return {
                        content: comment.content,
                        avatar: 'default-avatar.png',
                        username: 'Unknown User',
                    };
                }
                else {
                    // Time comment
                    let timecreated;
                    timecreated = timeSince(comment.createdAt);
                    return {
                        content: comment.content,
                        timecreated,
                        avatar: commentUser.avatar,
                        username: commentUser.username,
                    };
                }
            }));

            res.render('post', {
                layout: 'nolayout',
                user,
                title: 'Instagram | Post',
                action: 'post',
                post: postPage,
                comments: commentsPage
            });

        } catch (err) {
            next(err);
        }
    }


    create(req, res, next) {
        const user = req.user;

        if (req.body.images.length === 0) {
            req.body.images = ['/images/uploads/posts/no-image.png'];
        }

        const post = new Post({
            content: req.body.content,
            images: req.body.images,
            location: req.body.location,
            userId: user.id,
        });


        post.save()
            .then(() => {
                res.json({ success: true });
            })
            .catch(next);
    }

    like(req, res, next) {
        const userId = req.user.id;
        const postId = req.params.postId;
        Like.findOne({ userId, postId })
            .then((like) => {
                if (like) {
                    Like.findByIdAndDelete(like.id)
                        .then(() => {
                            Post.findByIdAndUpdate(postId, { $inc: { countLikes: -1 } }, { new: true })
                                .then((post) => {
                                    const countLikes = post.countLikes;
                                    res.json({ success: true, countLikes });
                                })
                                .catch(next);
                        })
                        .catch(next);
                } else {
                    const like = new Like({ userId, postId });
                    like.save()
                        .then(() => {
                            Post.findByIdAndUpdate(postId, { $inc: { countLikes: 1 } }, { new: true })
                                .then((post) => {
                                    const countLikes = post.countLikes;
                                    res.json({ success: true, countLikes });
                                })
                                .catch(next);
                        })
                        .catch(next);
                }
            })
            .catch(next);
    }

    comment(req, res, next) {
        const userId = req.user.id;
        const postId = req.params.postId;
        const content = req.body.content;

        const comment = new Comment({ userId, postId, content });
        comment.save()
            .then(() => {
                Post.findByIdAndUpdate(postId, { $inc: { countComments: 1 } }, { new: true })
                    .then((post) => {
                        res.json({ success: true });
                    })
                    .catch(next);
            })
            .catch(next);
    }

    async delete(req, res, next) {
        try {
            const user = req.user;

            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).send('Post not found');
            }

            if (user.id !== post.userId.toString()) {
                return res.status(403).send('You can not delete this post');
            }

            await Like.deleteMany({ postId: post._id });
            await Comment.deleteMany({ postId: post._id });

            post.images.forEach(async (image) => {
                if (image !== '/images/uploads/posts/no-image.png') {

                    await fs.unlink(`src/public${image}`);
                }
            });

            await post.deleteOne();

            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
    edit(req, res, next) {
        const user = req.user;
        const postId = req.params.postId;
        let prevImages = JSON.parse(req.body.postImgsPrevious);

        Post.findById(postId)
            .then((post) => {
                if (!post) {
                    return res.status(404).send('Post not found');
                }

                if (user.id !== post.userId.toString()) {
                    return res.status(403).send('You can not edit this post');
                }

                post.images.forEach(async (image) => {
                    if (!prevImages.includes(image)) {
                        await fs.unlink(`src/public${image}`);
                    }
                });

                if (req.body.images.length !== 0) {
                    prevImages = prevImages.concat(req.body.images);
                }

                post.content = req.body.content;
                post.location = req.body.location;
                post.images = prevImages;

                post.save()
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch(next);
            })
            .catch(next);
    }

}

module.exports = new postController();