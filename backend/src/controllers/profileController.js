const renderProfilePage = (req, res) => {
  res.render("profile", { user: req.user });
};

module.exports = { renderProfilePage };
