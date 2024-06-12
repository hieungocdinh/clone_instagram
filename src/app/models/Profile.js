const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Profile = new Schema({
    username: { type: String, required: true, unique: true },
    fullName: { type: String, default: 'Chưa có tên' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '/images/default-user.png' },
    countFollowers: { type: Number, default: 0 },
    countFollowing: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Profile', Profile);