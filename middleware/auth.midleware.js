
exports.requestAuth = (req,res, next) => {
    if(!req.session.logged){
        res.redirect('login');
        return;
    }
    next();
}


exports.logged = (req,res, next) => {
    if(req.session.logged){
        res.redirect('/');
        return;
    }
    next();
}