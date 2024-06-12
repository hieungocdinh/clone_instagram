const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Following = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Following', Following);