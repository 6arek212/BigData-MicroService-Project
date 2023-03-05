const moment = require("moment");

const makeElasticSearchQueries = (client) => {
  const searchOrdersByDate = async ({
    startDate,
    endDate,
    storeName,
    page,
    pageSize,
  }) => {
    let allRecords = [];
    const filter = [];
    const must = [];
    const q = {
      index: "orders",
      scroll: "10s",
      query: {
        bool: {
          must: must,
          filter: filter,
        },
      },
    };
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

    var { _scroll_id, hits } = await client.search(q);
    while (hits && hits.hits.length) {
      // Append all new hits
      allRecords.push(...hits.hits);
      var { _scroll_id, hits } = await client.scroll({
        scroll_id: _scroll_id,
        scroll: "10s",
      });
    }

    return allRecords;
  };

  return {
    searchOrdersByDate,
  };
};

module.exports = {
  makeElasticSearchQueries,
};
