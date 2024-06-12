const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Like = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Like', Like);