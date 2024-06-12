const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Thêm dòng này để import module fs 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../../public/images/uploads/avatars');
        fs.mkdirSync(dir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const username = req.user.username || 'default'; // Lấy tên người dùng từ request hoặc đặt tên mặc định
        const ext = path.extname(file.originalname); // Lấy phần mở rộng của file
        cb(null, `${username}${ext}`); // Đặt tên file theo tên người dùng
    }
})

const upload = multer({ storage });

function addImgUrlToBody(req, res, next) {
    if (req.file) {
        req.body.avatar = '/images/uploads/avatars/' + req.file.filename;
    }
    next();
}

module.exports = [upload.single('avatar'), addImgUrlToBody];