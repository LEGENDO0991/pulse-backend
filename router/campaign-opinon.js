import { getOpinionsByCampaignId } from '../controllers/campaign-opinion.js'
import { isAuthenticated } from './../middlewares/auth.js'

export default (router) => {
    router.get('/api/campaigns/:campaignId/opinions', isAuthenticated, getOpinionsByCampaignId)
}
                '/api/campaigns/6751cbafe71de6b8a2e4b258/opinions'