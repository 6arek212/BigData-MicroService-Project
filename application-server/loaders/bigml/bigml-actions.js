
const bigml = require('bigml');

const makeBigmlAcitons = ({ source, dataset, model }) => {

    const uploadAndTrainModel = async ({ filePath }) => {

        console.log('uploadAndTrainModel', filePath);
        const sc = await new Promise((resolve, reject) => {
            source.createAndWait(filePath, (error, sourceInfo) => {
                console.log('phase 1 done', sourceInfo.resource);
                if (error) {
                    reject(error);
                }
                resolve(sourceInfo)
            })
        })

        const ds = await new Promise((resolve, reject) => {
            dataset.createAndWait(sc, {}, true, (error, datasetInfo) => {
                console.log('phase 2 done');
                if (error) {
                    reject(error);
                }
                resolve(datasetInfo)
            });
        })



        await new Promise((resolve, reject) => {
            model.createAndWait(ds, {}, true, {}, (error, modelInfo) => {
                if (error) {
                    reject(error);
                }
                console.log('phase 3 done');
                resolve()
            });
        })


    }



    const getAssosiations = async () => {


        const recentModel = await new Promise((resolve, reject) => {
            model.list('limit=1;', (error, data) => {
                if (error) {
                    reject(error)
                }
                resolve(data.resources.length > 0 ? data.resources[0] : null)
            })
        })


        if (!recentModel)
            return []


        const data = await new Promise((resolve, reject) => {
            model.get(recentModel.resource,
                true,
                (error, data) => {
                    if (error) {
                        reject(error)
                    }

                    const newData = data.object.associations.rules
                        .filter(rule => {
                            let item1 = data.object.associations.items[rule.lhs[0]]
                            let item2 = data.object.associations.items[rule.rhs[0]]
                            const key1 = data.object.associations.fields[item1.field_id].name
                            const key2 = data.object.associations.fields[item2.field_id].name
                            return key1 === key2 && key1 === 'additions'
                        }).map(rule => {
                            let item1 = data.object.associations.items[rule.lhs[0]]
                            let item2 = data.object.associations.items[rule.rhs[0]]

                            const antecedent = {
                                key: data.object.associations.fields[item1.field_id].name,
                                value: item1.name
                            }

                            const consequent = {
                                key: data.object.associations.fields[item2.field_id].name,
                                value: item2.name
                            }

                            return {
                                ...rule,
                                antecedent: antecedent,
                                consequent: consequent,
                            }
                        })
                    resolve(newData)
                })
        })


        return data
    }


    return {
        uploadAndTrainModel,
        getAssosiations
    }
}



module.exports = {
    makeBigmlAcitons
}