const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Thêm dòng này để import module fs 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../../public/images/uploads/posts/');
        fs.mkdirSync(dir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const username = req.user.username || 'default'; // Lấy tên người dùng từ request hoặc đặt tên mặc định
        const ext = path.extname(file.originalname); // Lấy phần mở rộng của file
        cb(null, `${username}-${Date.now()}${ext}`); // Đặt tên file theo tên người dùng
    }
})

const upload = multer({ storage });

function addImgUrlToBody(req, res, next) {
    if (req.files) {
        let images = [];
        req.files.map(file => {
            images.push(`/images/uploads/posts/${file.filename}`);
        });
        req.body.images = images;
    }
    next()
}

module.exports = [upload.array('images'), addImgUrlToBody];