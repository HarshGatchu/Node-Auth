module.exports = function (req, res, next) {
    req.books.add(req.body, function () {
        res.send({success: true});
    });
}