

module.exports = (dbSearch) => {
    const search = async (req, res, next) => {
        const { startDate, endDate, storeName } = req.query

        try {
            const data = await dbSearch.searchOrdersByDate({ startDate, endDate, storeName: storeName })
            res.status(200).json({
                message: 'success',
                data: data
            })
        } catch (e) {
            next(e)
        }
    }



    return {
        search
    }
}