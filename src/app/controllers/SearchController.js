const Profile = require('../models/Profile');
const Following = require('../models/Following');

class SearchController {
    static async getEscapeRegExp() {
        if (!this.escapeRegExp) {
            const { default: escapeRegExp } = await import('escape-string-regexp');
            this.escapeRegExp = escapeRegExp;
        }
        return this.escapeRegExp;
    }

    async index(req, res, next) {
        try {
            const q = req.query.q || '';
            const escapeRegExp = await SearchController.getEscapeRegExp();
            const escapedQ = escapeRegExp(q);
            const user = req.user;

            if (q.length === 0) {
                return res.render('search', {
                    title: 'Instagram | Search',
                    action: 'search',
                    user: req.user,
                });
            } else {
                const users = await Profile.find({
                    $and: [
                        {
                            $or: [
                                { username: { $regex: new RegExp(escapedQ, 'i') } },
                                { fullName: { $regex: new RegExp(escapedQ, 'i') } },
                            ]
                        },
                        { userId: { $ne: user.id } } // Loại trừ người dùng hiện tại
                    ]
                }).select('avatar fullName username countFollowers userId');

                for (let i = 0; i < users.length; i++) {
                    const following = await Following.findOne({ userId: user.id, followingId: users[i].userId });
                    users[i] = users[i].toObject();
                    users[i].isFollowing = !!following;
                }

                return res.render('search', {
                    title: 'Instagram | Search',
                    action: 'search',
                    user: req.user,
                    q: q,
                    results: users,
                });
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SearchController();
