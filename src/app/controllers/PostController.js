const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Profile = require('../models/Profile');

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

            let isLiked = false;
            const postUser = await Profile.findOne({ userId: post.userId });
            if (!postUser) {
                return res.status(404).send('Post user profile not found');
            }

            const like = await Like.findOne({ userId: user.id, postId: post._id });
            if (like) isLiked = true;


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
                    const now = new Date();
                    const secondsPast = (now.getTime() - comment.createdAt.getTime()) / 1000;
                    console.log(secondsPast);
                    if (secondsPast < 60) {
                        timecreated = `${Math.floor(secondsPast)} seconds ago.`;
                    }
                    else if (secondsPast < 3600 && secondsPast >= 60) {
                        timecreated = `${Math.floor(secondsPast / 60)} minutes ago.`;
                    }
                    else if (secondsPast <= 86400 && secondsPast >= 3600) {
                        timecreated = `${Math.floor(secondsPast / 3600)} hours ago.`;
                    }
                    else if (secondsPast > 86400) {
                        const days = Math.floor(secondsPast / 86400);
                        if (days === 1) {
                            timecreated = `Yesterday.`;
                        } else {
                            timecreated = `${days} days ago.`;
                        }
                    }

                    return {
                        content: comment.content,
                        timecreated,
                        avatar: commentUser.avatar,
                        username: commentUser.username,
                    };
                }
            }));

            console.log(commentsPage);
            console.log(postPage);

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

}

module.exports = new postController();