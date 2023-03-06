const moment = require("moment");

const makeElasticSearchQueries = (client) => {
  const searchOrdersByDate = async ({
    searchDate,
    startDate,
    endDate,
    storeName,
    page,
    pageSize,
  }) => {
    // let allRecords = [];
    const filter = [];
    const must = [];
    const q = {
      index: "orders",
      // scroll: "10s",
      sort: [
        { createdAt: 'desc' }
      ],
      query: {
        bool: {
          must: must,
          filter: filter,
        },
      },
    };

    if (searchDate) {
      must.push({
        range: {
          createdAt: { lte: searchDate },
        },
      });
    }

    if (storeName) {
      must.push({
        match: {
          store_name: storeName,
        },
      });
    }

    if (startDate && endDate) {
      filter.push({
        range: {
          createdAt: { gte: startDate, lte: endDate },
        },
      });
    }

    if (page && pageSize) {
      q.size = pageSize;
      q.from = (page - 1) * pageSize;
    }


    const { count } = await client.count({
      index: "orders"
    })

    const { hits } = await client.search(q)

    // var { _scroll_id, hits } = await client.search(q);
    // while (hits && hits.hits.length) {
    //   // Append all new hits
    //   allRecords.push(...hits.hits);
    //   var { _scroll_id, hits } = await client.scroll({
    //     scroll_id: _scroll_id,
    //     scroll: "10s",
    //   });
    // }

    return { count, result: hits.hits };
  };

  return {
    searchOrdersByDate,
  };
};

module.exports = {
  makeElasticSearchQueries,
};
