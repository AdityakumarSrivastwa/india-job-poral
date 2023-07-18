exports.testgetController = (req, res) => {
  const { name } = req.body;
  res.send(`hi i am ${name}`);
};
