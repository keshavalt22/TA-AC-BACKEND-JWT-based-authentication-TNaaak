var express = require('express');
var router = express.Router();
var User = require('../model/user');
var Book = require('../model/book');
var auth = require('../middlewares/auth');
const user = require('../model/user');

router.use(auth.verifyToken);

//Add Book
router.post('/add-new-book', async (req, res, next) => {
    req.body.creator = req.user.userId;
    if(req.body.category) {
        req.body.category = req.body.category.trim().split(",");
    }
    try {
        var book = await Book.create(req.body);
        res.status(200).json({book});
    } catch (error) {
        return next(error);
    }
});


//Edit Book
router.post('/edit/:id', async(req, res, next) => {
    var bookId = req.params.id;
    req.body.category = req.body.category.trim().split(",");

    var data = await Book.findById(bookId);
    if(req.user.userId === data.creator.toString()) {
        try {
            var book = await Book.findByIdAndUpdate(bookId, req.body);
            res.status(200), json({book});
        } catch (error) {
            return next(error);
        }
    }
})


//Delete Book
router.delete('/delete/:id', async(req, res, next) => {
    var bookId = req.params.id;
    var data = await Book.findById(bookId);

    if(req.body.userId === data.creator.toString()) {
        try {
            var book = await Book.findByIdAndDelete(bookId);
            res.status(200).json({book});
        } catch (error) {
            return next(error);
        }
    }
})

//Add books to cart
router.put('/add-to-cart/:id', async(req, res, next) => {
    var bookId = req.params.id;
    var book = await Book.findById(bookId);
    if(book.quantity > 0) {
        var user = await User.findByIdAndUpdate(req.user.userId, {
            $push:{cart: {quantity:1, book: bookId}}
        })
        res.status(200).json({cart: user.cart});
    }
})

//Remove books from cart
router.put('/remove-from-cart/:id', async(req, res, next) => {
    var bookId = req.params.id;
    var user = await User.findByIdAndUpdate(req.user.userId, {
        $pull:{quantity:1, book: bookId}
    }, {new: true});
    res.status(200).json({cart: user.cart});
});

module.exports = router;