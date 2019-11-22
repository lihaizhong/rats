self.addEventListener('install', function(event) {
  /**
   * setup
   */
  function setup() {}

  event.waitUntil(setup());
});

self.addEventListener('activate', function(event) {
  /**
   * setup
   */
  function setup() {}

  event.waitUntil(setup());
});

self.addEventListener('message', function(event) {
  console.log(event);
});

self.addEventListener('fetch', function(event) {
  /**
   * setup
   * @return {Promise} request
   */
  function setup() {
    console.log(event.request);
    return fetch(event.request)
      .then(function(response) {
        console.log(response);
        return response;
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  event.respondWith(setup());
});

self.addEventListener('sync', function(event) {
  /**
   * setup
   */
  function setup() {
    console.log('sync serviceWorker');
  }

  event.waitUntil(setup());
});

self.addEventListener('push', function(event) {
  /**
   * setup
   */
  function setup() {
    console.log('push serviceWorker');
  }

  event.waitUntil(setup());
});
