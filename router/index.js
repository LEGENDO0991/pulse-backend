import { Router } from 'express'
import auth from './auth.js'
import opinion from './opinion.js'
import campaign from './campaign.js'
import campaignOpinions from './campaign-opinon.js'

const router = Router()

export default () => {
    auth(router)
    campaign(router)
    opinion(router)
    campaignOpinions(router)
    return router
}