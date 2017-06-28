const Hapi = require('hapi');
const Path = require('path');
const fetchUrl = require('fetch').fetchUrl;

const server = new Hapi.Server({
    connections: {
      routes: {
          files: {
              relativeTo: Path.join(__dirname, 'public')
          }
      }
    }

});
server.connection({ port: 3000, host: 'localhost' });

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }
    server.route([
      {
          method: 'GET',
          path: '/',
          handler: function (request, reply) {
              reply.file('./index.html');
          }
      }
  ,{
    method: 'GET',
    path: '/public/assets/js/{file*}',
    handler: {
      directory: {
        path: Path.join(__dirname + '/public/assets/js/')
      }
    },
  },
  {
    method: 'GET',
    path: '/public/assets/css/{file*}',
    handler: {
      directory: {
        path: Path.join(__dirname + '/public/assets/css/')
      }
    },
  },
  {
    config: {
      cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-with']
      }
  },
    method: 'GET',
    path: '/api/beer',
    handler: (request, reply) => {
      fetchUrl('https://api.untappd.com/v4/search/beer?q=IPA%20Denver&client_id=337761F7CE5C059F22A5D05E4182CD9AC5BF5711&client_secret=AAD5C7DC2CCD52B7A5E2721DA26765411A8F986B', (err,meta,body) => {
        console.warn("Fetch response!!!", err, meta, body);
        reply(body.toString())
      });

    }
  }
]);

});

// server.route({
//     method: 'GET',
//     path: '/{name}',
//     handler: function (request, reply) {
//         reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
//     }
// });

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
