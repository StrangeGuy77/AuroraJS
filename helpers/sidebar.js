const Stats = require('./stats');
const Softs = require('./softs');
const Comments = require('./comments');

module.exports = async viewModel => {

    const results = await Promise.all([
        Stats(),
        Softs.popular(), 
        Comments.newest()
    ]);  

    viewModel.sidebar = {
        stats: results[0],
        popular: results[1],
        comments: results[2]
    }

    return viewModel;

}