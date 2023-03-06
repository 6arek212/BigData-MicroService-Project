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
      sort: [{ createdAt: "desc" }],
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
      index: "orders",
      query: {
        bool: {
          must: must,
          filter: filter,
        },
      },
    });

    const { hits } = await client.search(q);

    return { count, result: hits.hits };
  };

  return {
    searchOrdersByDate,
  };
};

module.exports = {
  makeElasticSearchQueries,
};
