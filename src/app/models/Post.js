const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    content: { type: String, default: '' },
    images: { type: [String] },
    location: { type: String, default: 'none' },
    countLikes: { type: Number, default: 0 },
    countComments: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', Post);