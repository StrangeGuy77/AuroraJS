const ctrl = {};

ctrl.index = (req, res) => {
    res.send('user index');
};

ctrl.login = (req, res) => {
    res.send('user login');
};

ctrl.register = (req, res) => {
    res.send('user register');
};

ctrl.profile = (req, res) => {
    res.send('user profile');
};


module.exports = ctrl;