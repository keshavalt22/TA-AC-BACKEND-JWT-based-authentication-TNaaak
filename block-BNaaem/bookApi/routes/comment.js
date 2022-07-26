var express = require('express');
var router = express.Router();
var Comment = require('../model/comment');
var Book = require('../model/book');
var auth = require('../middlewares/auth');
const book = require('../model/book');
const { findById } = require('../model/user');

//protected routes
router.use(auth.verifyToken);

//Add comment

router.post('/add-comment/:id', async(req, res, next) => {
    var bookId = req.params.id;
    req.body.bookId = bookId;
    req.body.author = req.user.userid;
    try {
        var comment = await Comment.create(req.body);
        var book = await Book.findByIdAndUpdate(bookId, {
            $push: {comment: comment._id}
        }, {new: true});
        res.status(200).json({book})l
    } catch (error) {
        return next(error);
    }
})


//Edit comment

router.put('/edit-comment/:id', async(req, res, next) => {
    var commentId = req.params.id;
    var data = findById(commentId);
    if(req.user.userid === data.author.toStirng()) {
        try {
            var comment = await Comment.findByIdAndUpdate(
                commentId, req.body, {new: true}
                );
                res.status(200).json({comment});
        } catch (error) {
            return next(error);
        }
    }
});

//Delete comment

router.delete('delete-comment/:id', (req, res, next) => {
    var commentId = req.params.id;
    var data = findById(commentId);
    if(req.user.userid === data.author.toStirng()) {
        try {
            var comment = await Comment.findByIdAndDelete(commentId);
            var book = await Book.findByIdAndUpdate(
                comment.bookId, {$pull: {comment: comment._id}}, {new: ture}
            );
            res.status(200).json({book, comment});
        } catch (error) {
            return next(error);
        }
    }
})

module.exports = router;