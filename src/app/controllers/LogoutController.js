
class logoutController {
    index(req, res) {
        res.clearCookie('Bear');
        res.redirect('/login');
    }
}

module.exports = new logoutController();