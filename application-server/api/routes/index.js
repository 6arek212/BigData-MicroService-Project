const router = require('express').Router()





module.exports =  (dbSearch) => {

    const controller = require('../controller/search-controller')(dbSearch)

    router.get('/search', controller.search)
    
    
    return router
}