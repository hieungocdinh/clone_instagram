const User = require('../models/User');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class loginController {
    // [GET] /login
    index(req, res) {
        res.render('login', { title: 'Intagram | Login', action: 'login', layout: 'nolayout' });
    }
    // [POST] /login
    login(req, res, next) {
        const { username, password } = req.body;
        User.findOne({ username })
            .then(user => {
                if (!user) {
                    res.json({ error: 'Tài khoản không tồn tại' });
                }
                else {
                    bcrypt.compare(password, user.password)
                        .then(function (result) {
                            if (result === true) {
                                Profile.findOne({ userId: user._id })
                                    .then(profile => {
                                        if (profile) {
                                            const accessToken = jwt.sign({
                                                id: user._id,
                                                username: user.username,
                                                avatar: profile.avatar,
                                                fullName: profile.fullName,
                                            }, process.env.JWT_ACCESS_KEY, { expiresIn: '1d' });
                                            res.cookie('Bear', accessToken);
                                            res.json({ suscess: 'Đăng nhập thành công' });
                                        }
                                        else {
                                            res.json({ error: 'Tài khoản không tồn tại' });
                                        }
                                    })
                                    .catch(next);
                            }
                            else {
                                res.json({ error: 'Mật khẩu không chính xác' });
                            }
                        });
                }
            })
            .catch(next);
    }
}

module.exports = new loginController();