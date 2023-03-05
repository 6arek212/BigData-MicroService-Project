module.exports = (dbSearch) => {
  const search = async (req, res, next) => {
    const { startDate, endDate, storeName } = req.query;
    console.log(startDate, endDate, storeName);
    try {
      const data = await dbSearch.searchOrdersByDate({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        storeName: storeName,
      });
      //   console.log(data);
      res.status(200).json({
        message: "success",
        data: data,
      });
    } catch (e) {
      next(e);
    }
  };

  return {
    search,
  };
};
