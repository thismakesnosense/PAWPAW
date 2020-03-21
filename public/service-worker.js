if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").then(reg => {
        console.log("We found your service worker file!", reg);
      });
    });
  }


  self.addEventListener("install", function(event){
      event.waitUntil(
          caches.open("money").then(function(cache){
              return cache.addAll(["/", "index.js", "service-worker.js", "styles.css", "fa/font-awesome-4.7.0/css/font-awesome.css", "https://cdn.jsdelivr.net/npm/chart.js@2.8.0", "https://unpkg.com/dexie@2.0.4/dist/dexie.js"])
          }) 
      )
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request,{credentials:'include'}).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        let responseToCache = response.clone();

                        caches.open("money")
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );

});