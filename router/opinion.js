import { createOpinion, downVote, upVote } from './../controllers/opinion.js'
import { isAuthenticated } from './../middlewares/auth.js'

export default (router) => {
    router.post('/api/opinions', isAuthenticated, createOpinion)
    router.patch('/api/opinions/:id/upvote', isAuthenticated, upVote)
    router.patch('/api/opinions/:id/downvote', isAuthenticated, downVote)
}