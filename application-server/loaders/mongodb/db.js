// mongodb data access
const Pizza = require('./schemas/Pizza')



const makeMonogDbActions = () => {

    const fetchData = async () => {
        return await Pizza.aggregate([
            { $unset: "__v" },
            {
                $project: {
                    name: 1,
                    address: 1,
                    phone: 1,
                    store_id: 1,
                    store_name: 1,
                    region: 1,
                    distrect: 1,
                    status: 1,
                    additions: 1,
                    createdAt: {
                        $dateToString: {
                            date: '$createdAt',
                            format: '%Y-%m-%d %H:%M:%S:%L%z',
                            timezone: '+0300',
                            onNull: ''
                        }
                    },
                    finishedAt: {
                        $dateToString: {
                            date: '$finishedAt',
                            format: '%Y-%m-%d %H:%M:%S:%L%z',
                            timezone: '+0300',
                            onNull: ''
                        }
                    }
                }
            }
        ])
    }

    fetchData()
    return {
        fetchData
    }
}


module.exports = {
    makeMonogDbActions
}