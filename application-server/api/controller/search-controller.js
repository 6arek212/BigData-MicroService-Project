module.exports = (dbSearch) => {
  const search = async (req, res, next) => {
    const { startDate, endDate, storeName, page, pageSize , searchDate } = req.query;
    try {
      const { count, result } = await dbSearch.searchOrdersByDate({
        searchDate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        storeName: storeName,
        page,
        pageSize
      });
      //   console.log(data);
      res.status(200).json({
        message: "success",
        data: result,
        count
      });
    } catch (e) {
      next(e);
    }
  };

  return {
    search,
  };
};
