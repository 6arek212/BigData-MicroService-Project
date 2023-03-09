const bigml = require('bigml');
const { makeBigmlAcitons } = require('./bigml-actions');


// [
//     'complement',         'discretization',
//     'fields',             'items',
//     'max_k',              'max_lhs',
//     'min_confidence',     'min_leverage',
//     'min_lift',           'min_support',
//     'missing_items',      'rules',
//     'rules_summary',      'search_strategy',
//     'significance_level'
//   ]


module.exports = async () => {
    const connection = new bigml.BigML()
    const source = new bigml.Source(connection)
    const dataset = new bigml.Dataset(connection)
    const model = new bigml.Association(connection)

    console.log('connected to bigml');

    return makeBigmlAcitons({
        source,
        dataset,
        model
    })
}