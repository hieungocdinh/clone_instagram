const mongoose = require('mongoose');

async function connect() {
    try {
        // Đặt tùy chọn strictQuery
        mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        });
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect failure!!!');
        console.error(error); // Thêm dòng này để in chi tiết lỗi ra console
    }
}

module.exports = { connect };
