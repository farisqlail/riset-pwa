// serverMiddleware/compression.js (buat file jika belum ada)
const zlib = require('zlib');

module.exports = function (req, res, next) {
  const acceptEncoding = req.headers['accept-encoding'];
  if (!acceptEncoding || !acceptEncoding.includes('gzip')) {
    return next();
  }

  const stream = zlib.createGzip();
  res.setHeader('Content-Encoding', 'gzip');
  res.setHeader('Vary', 'Accept-Encoding');
  res.removeHeader('Content-Length'); // menghapus header Content-Length untuk menghindari konflik dengan gzip

  stream.pipe(res);
  stream.end(res.body, 'utf-8');
};
