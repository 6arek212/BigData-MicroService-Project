const router = require('express').Router()





module.exports = (dbSearch, trainModel) => {

    const controller = require('../controller/search-controller')(dbSearch, trainModel)

    router.get('/search', controller.search)
    router.get('/train', controller.train)


    return router
}