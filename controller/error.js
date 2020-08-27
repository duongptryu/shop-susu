exports.errorPage = (req, res) => {
    res.status(404).render("404");
};

exports.alertPage = (req,res) => {
    res.status(301).render("301");
}