import ReviewsDAO from '../dao/reviewsDAO.js';

export default class ReviewsController {
    //A class is used in js to export multiple functions

    //-------------------POST A REVIEW-------------------
    static async apiPostReview(req, res, next) {
        //static function so that it can be called without an instance
        try {
            const movieId = parseInt(req.body.movieId);
            const user = req.body.user;
            const review = req.body.review;
            
            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                user,
                review
            );
            res.json({ status: 'Success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    //-----------------GET USER REVIEWS-----------------
    static async apiGetReview(req, res, next) {
        try {
            let id = req.params.id || {};   //Body of req => data that is sent, parameters => url data
            let review = await ReviewsDAO.getReview(id);
            if (!review) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(review);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    //-----------------UPDATE REVIEW-----------------
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const review = req.body.review;
            const user = req.body.user;

            const reviewResponse = await ReviewsDAO.updateReview (
                reviewId,
                user,
                review
            );

            var { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error('Unable to update review');
            }

            res.json({ status: 'success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    //-----------------DELETE REVIEW-----------------
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const reviewResponse = await ReviewsDAO.deleteReview(reviewId);
            res.json({ status: 'success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    //-------------GET REVIEWS BY MOVIE-------------
    static async apiGetReviews(req, res, next) {
        try {
            let id = req.params.id || {};
            let reviews = await ReviewsDAO.getReviewsByMovieId(id);
            if (reviews.length === 0) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(reviews);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}

//Controller file gets info that was sent to route and sends it to the DAO

/*
  Problem encountered: I was not able to add or update reviews - after many
  experiments I realized that it was because my program was not parsing the
  request body. All of this was because I was not using the cors() in my app.
  Also learnt how to send http requests via curl in the command line.
  Actually, the problem was also that curl on windows ps/cmd/vscode was not
  sending parsable data or something? 
  However after wasting 2 days away on this, I am finally able to add and
  update the reviews in the database by making use of Advanced REST client 
  extension on Chrome.
  The code works perfectly.
*/