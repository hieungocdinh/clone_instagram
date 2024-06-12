const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Post = require('../models/Post');
const Profile = require('../models/Profile');
const Following = require('../models/Following');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');

class profileController {
    // [GET] /
    index(req, res, next) {
        const user = req.user;
        const username = req.params.username;
        let isUser = false;

        Profile.findOne({ username: username })
            .then(profile => {
                if (profile) {
                    Post.find({ userId: profile.userId })
                        .sort({ createdAt: 'desc' })
                        .then(posts => {
                            if (user.id == profile.userId) isUser = true;
                            if (isUser) {
                                return res.render('profile', { title: 'Intagram | Profile', action: 'profile', profile: mongooseToObject(profile), user: user, isUser: isUser, posts: mutipleMongooseToObject(posts) });
                            }
                            else {
                                Following.findOne({ userId: user.id, followingId: profile.userId })
                                    .then(following => {
                                        let isFollowing = false;
                                        if (following) isFollowing = true;
                                        return res.render('profile', { title: 'Intagram | Profile', action: 'profile', profile: mongooseToObject(profile), user: user, isFollowing: isFollowing, posts: mutipleMongooseToObject(posts) });
                                    })
                                    .catch(next)
                            }
                        })
                        .catch(next)
                }
                else {
                    res.json('Không tìm thấy người dùng');
                }
            })
            .catch(next)


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