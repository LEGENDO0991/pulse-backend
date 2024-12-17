import { createCampaign, downVote, getCampaign, getCampaigns, upVote } from './../controllers/campaign.js'
import {isAuthenticated} from './../middlewares/auth.js'

export default (router) => {
    router.get('/api/campaigns/:campaignId', isAuthenticated, getCampaign)
    router.get('/api/campaigns', isAuthenticated, getCampaigns)
    router.post('/api/campaigns', isAuthenticated, createCampaign)
    router.patch('/api/campaigns/:id/upvote', isAuthenticated, upVote)
    router.patch('/api/campaigns/:id/downvote', isAuthenticated, downVote)
}