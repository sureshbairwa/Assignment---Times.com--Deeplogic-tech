const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === '/getTimeStories' && req.method === 'GET') {
    try {
      const opt = {
        hostname: 'api.time.com',
        port: 443,
        path: '/wp-json/wp/v2/posts?per_page=6',
        method: 'GET'
      };

      const request = https.request(opt, response => {
        let data = '';

        response.on('data', chunk => {
          data += chunk;
        });

        response.on('end', () => {
          const news = JSON.parse(data).map(post => ({
            title: post.title.rendered,
            link: post.link
          }));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(news));
        });
      });

      request.on('error', error => {
        console.error('Error fetching latest news:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch news.' }));
      });

      request.end();
    } catch (error) {
      console.error('Error fetching latest news:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch news.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT} \n go the http://localhost:3000/getTimeStories to get the 6 latest news`);
});
