exports.getLoginPage = (req,res) => {
    res.render('login');
}

exports.doLogin = (req,res) => {
    var username = req.body.username;
    var password = req.body.password;

    if(username !== "admin"){
        res.render('login', {error: "User is not exist"});
        return;
    }else{
        if(password !== "123456"){
            res.render('login', {error: "Password is not correct"});
            return;
        }
    }
    req.session.logged = true;
    req.session.userID = "123456";
    res.redirect("/");
}

exports.logout = (req,res) => {
    req.session.destroy();
    res.redirect('login');
    
}