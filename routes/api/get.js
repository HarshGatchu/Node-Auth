module.exports = function (req, res, next) {
    req.books.get(function (rows) {
        res.send(rows);
    });
};