module.exports = function (req, res, next) {
    req.books.remove(parseInt(req.body.id), function () {
        res.send({success: true});
    });
};