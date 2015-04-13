export default function(server) {
  server.get('/', (req, res) => {
    res.render('index', {});
  });
};