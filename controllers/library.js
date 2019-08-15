const ctrl = {};

ctrl.index = (req, res) => {
    res.render('index', {title: "Biblioteca - Aurora Development"});
};

ctrl.create = (req, res) => {
    console.log(req.file);
    res.send('Completado!');
};

ctrl.like = (req, res) => {

};

ctrl.comment = (req, res) => {

};

ctrl.delete = (req, res) => {
    
}

module.exports = ctrl;