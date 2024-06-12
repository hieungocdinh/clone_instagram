const User = require('../models/User');
const Profile = require('../models/Profile');
const Following = require('../models/Following');

class followingController {
    follow(req, res, next) {
        const followerUsername = req.params.username;
        const user = req.user;
        User.findOne({ username: followerUsername })
            .then((follower) => {
                if (follower) {
                    Following.findOne({ userId: user.id, followingId: follower._id })
                        .then((following) => {
                            if (following) {
                                res.json({ success: false, message: 'User already followed' });
                            }
                            else {
                                const following = new Following({ userId: user.id, followingId: follower._id });
                                following.save()
                                    .then(() => {
                                        const updateFollowerProfile = Profile.findOneAndUpdate(
                                            { userId: follower._id },
                                            { $inc: { countFollowers: 1 } }
                                        );
                                        const updateUserProfile = Profile.findOneAndUpdate(
                                            { userId: user.id },
                                            { $inc: { countFollowing: 1 } }
                                        );
                                        return Promise.all([updateFollowerProfile, updateUserProfile]);
                                    })
                                    .then(() => {
                                        res.json({ success: true, message: 'User followed' });
                                    })
                                    .catch(next);
                            }
                        })
                        .catch(next);
                }
                else {
                    res.json({ success: false, message: 'User not found' });
                }
            })
            .catch(next);
    }

    unfollow(req, res, next) {
        const followerUsername = req.params.username;
        const user = req.user;
        User.findOne({ username: followerUsername })
        User.findOne({ username: followerUsername })
            .then((follower) => {
                if (follower) {
                    Following.findOneAndDelete({ userId: user.id, followingId: follower._id })
                        .then(() => {
                            const updateFollowerProfile = Profile.findOneAndUpdate(
                                { userId: follower._id },
                                { $inc: { countFollowers: -1 } }
                            );
                            const updateUserProfile = Profile.findOneAndUpdate(
                                { userId: user.id },
                                { $inc: { countFollowing: -1 } }
                            );
                            return Promise.all([updateFollowerProfile, updateUserProfile]);
                        })
                        .then(() => {
                            res.json({ success: true, message: 'User unfollowed' });
                        })
                        .catch(next);
                }
                else {
                    res.json({ success: false, message: 'User not found' });
                }
            })
            .catch(next);
    }
}

module.exports = new followingController();