const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');

class registerController {
    // [GET] /register
    index(req, res) {
        res.render('register', { title: 'Intagram | Register', action: 'register', layout: 'nolayout' });
    }
    // [POST] /register
    register(req, res, next) {
        const { username, email, password, phoneNumber } = req.body;
        const saltRounds = 10;

        User.findOne({ $or: [{ email: email }, { username: username }] })
            .then(user => {
                if (user) {
                    res.status(400).json({ error: 'Email hoặc username đã tồn tại' });
                } else {
                    bcrypt.hash(password, saltRounds)
                        .then(function (hashPassword) {
                            const newUser = new User({ username, phoneNumber, email, password: hashPassword });
                            newUser.save()
                                .then((user) => {
                                    const newProfile = new Profile({ userId: user._id, username: user.username });
                                    newProfile.save()
                                        .then(() => res.json({ success: 'Đăng ký thành công' }))
                                        .catch(err => res.json({ error: err }));
                                })
                                .catch(err => res.json({ error: err }));
                        })
                        .catch(err => res.status(500).json({ error: err })); // Xử lý lỗi khi hash mật khẩu
                }
            })
            .catch(err => res.status(500).json({ error: err })); // Xử lý lỗi khi tìm kiếm người dùng
    }
}

module.exports = new registerController();