const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Post = require('../models/Post');
const Profile = require('../models/Profile');
const Following = require('../models/Following');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');

class profileController {
    // [GET] /
    async index(req, res, next) {
        try {
            const user = req.user;
            const username = req.params.username;
            let isUser = false;

            const profile = await Profile.findOne({ username: username });
            if (!profile) {
                return res.json('Không tìm thấy người dùng');
            }

            const posts = await Post.find({ userId: profile.userId }).sort({ createdAt: 'desc' });

            // get list followers
            const followers = await Following.find({ followingId: profile.userId });
            const listFollowers = [];
            for (let i = 0; i < followers.length; i++) {
                let follower = await Profile.findOne({ userId: followers[i].userId }).select('userId username avatar fullName');
                const check = await Following.findOne({ userId: user.id, followingId: follower.userId });

                follower = follower.toObject();
                if (check) {
                    follower.isFollowing = true;
                } else {
                    follower.isFollowing = false;
                }

                if (follower.userId.toString() === user.id) {
                    follower.isUser = true;
                }

                listFollowers.push(follower);
            }

            //get list following
            const followings = await Following.find({ userId: profile.userId });
            const listFollowing = [];
            for (let i = 0; i < followings.length; i++) {
                let following = await Profile.findOne({ userId: followings[i].followingId }).select('userId username avatar fullName');
                const check = await Following.findOne({ userId: user.id, followingId: following.userId });

                following = following.toObject();
                if (check) {
                    following.isFollowing = true;
                } else {
                    following.isFollowing = false;
                }

                if (following.userId.toString() === user.id) {
                    following.isUser = true;
                }

                listFollowing.push(following);
            }

            if (user.id === profile.userId.toString()) {
                isUser = true;
                return res.render('profile', {
                    title: 'Intagram | Profile',
                    action: 'profile',
                    profile: mongooseToObject(profile),
                    user: user,
                    isUser: isUser,
                    posts: mutipleMongooseToObject(posts),
                    followers: listFollowers,
                    following: listFollowing,
                });
            } else {
                const following = await Following.findOne({ userId: user.id, followingId: profile.userId });
                const isFollowing = !!following;
                return res.render('profile', {
                    title: 'Intagram | Profile',
                    action: 'profile',
                    profile: mongooseToObject(profile),
                    user: user,
                    isFollowing: isFollowing,
                    posts: mutipleMongooseToObject(posts),
                    followers: listFollowers,
                    following: listFollowing,
                });
            }
        } catch (error) {
            next(error);
        }
    }

    edit(req, res, next) {
        const user = req.user;
        const username = req.params.username;

        Profile.findOne({ username: username })
            .then(profile => {
                if (profile) {
                    if (user.id == profile.userId) {
                        res.render('profile/edit', { title: 'Intagram | Edit Profile', action: 'editProfile', profile: mongooseToObject(profile), user: user });
                    }
                    else {
                        res.json('Không thể chỉnh sửa thông tin của người khác');
                    }
                }
                else {
                    res.json('Không tìm thấy người dùng');
                }
            })
            .catch(next)
    }

    stored(req, res, next) {
        const user = req.user;
        const username = req.params.username;
        Profile.findOneAndUpdate({ username: username }, req.body, { new: true })
            .then((profile) => {
                const accessToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                    avatar: profile.avatar,
                    fullName: profile.fullName,
                }, process.env.JWT_ACCESS_KEY, { expiresIn: '1d' });
                res.cookie('Bear', accessToken);
                res.json('Success');
            })
            .catch(next)
    }

}

module.exports = new profileController();