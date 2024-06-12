const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const token = req.cookies.Bear;
    if (!!token) {
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                res.json({ message: 'Token is not valid' });
                return;
            }
            // gửi dữ liệu cho hàm tiếp theo
            req.user = user;
            next();
        });
    }
    else {
        res.redirect('/login');
    }
}

module.exports = verify;    