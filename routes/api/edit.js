module.exports = function (req, res, next) {
    req.books.update(req.body, function () {
        res.send({success: true});
    });
}