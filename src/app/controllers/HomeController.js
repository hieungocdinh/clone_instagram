const User = require('../models/User');
const Like = require('../models/Like');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const Following = require('../models/Following');
const { mutipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
class homeController {
    // [GET] /
    async index(req, res, next) {
        try {
            const user = req.user;
            if (user) {
                // Lấy danh sách tất cả người dùng
                const allUsers = await Profile.find({ userId: { $ne: user.id } });

                // Lấy danh sách người dùng mà người dùng hiện tại đã theo dõi
                const followings = await Following.find({ userId: user.id });
                let followingIds = followings.map(f => f.followingId.toString());

                // Lọc ra những người dùng mà người dùng hiện tại chưa theo dõi
                const usersNotFollowed = allUsers.filter(u => !followingIds.includes(u.userId.toString()));

                // Chọn ngẫu nhiên 5 người từ danh sách người dùng chưa theo dõi
                const randomUsers = usersNotFollowed.sort(() => 0.5 - Math.random()).slice(0, 5);

                // Lấy bài viết 
                followingIds.push(user.id.toString()); // Thêm ID của người dùng hiện tại vào danh sách theo dõi để lấy cả bài viết của chính mình
                const posts = await Post.find({ userId: { $in: followingIds } }).sort({ createdAt: -1 }).limit(10);

                // Lấy thông tin về các like của người dùng
                const likes = await Like.find({ userId: user.id });
                const likePostIds = likes.map(l => l.postId.toString());

                // Lấy thông tin người dùng từ ID trong mỗi bài viết
                const homePosts = await Promise.all(posts.map(async post => {
                    const date = new Date(post.createdAt);
                    const formattedCreatedAt = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    const user = await Profile.findOne({ userId: post.userId }); // Tìm kiếm thông tin người dùng từ ID
                    const isLiked = likePostIds.includes(post._id.toString()); // Kiểm tra xem người dùng đã thích bài viết này chưa
                    return {
                        ...post.toObject(),
                        username: user.username,
                        avatar: user.avatar,
                        date: formattedCreatedAt,
                        isLiked,
                    }; // Trả về đối tượng mới chứa thông tin người dùng và bài viết
                }));

                res.render('home', { title: 'Intagram | Home', action: 'home', user: user, randomUsers: mutipleMongooseToObject(randomUsers), posts: homePosts });
            }
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new homeController();