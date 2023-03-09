const path = require('path');


const makeTrainModelUseCase = (dbMl, ml, csv, emitter) => {

    return async ({ startDate, endDate }) => {
        console.log('training model started');

        // get data
        const data = await dbMl.fetchData({ startDate, endDate })
        // progressEmitter('20%')
        if (data && data.length > 0) {
            const p = path.join(__dirname, '..', 'data.csv')

            // write to a csv file
            await csv.make(p, data)
            // progressEmitter('60%')

            // upload data set to bigml
            await ml.uploadAndTrainModel({ filePath: p })
        }

        // progressEmitter('100%')

        emitter()
        console.log('training model finished');
    }

}

module.exports = {
    makeTrainModelUseCase
}