const { searchPublications } = require('./search.service');

const index = async (req, res) => {
  const { publications, filters } = await searchPublications({
    query: req.query,
    currentUser: req.user || null
  });

  return res.render('search/results', {
    title: 'Buscar publicaciones',
    publications,
    filters
  });
};

module.exports = {
  index
};