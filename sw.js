var cache = 'javascripture.22.0.1556023231';

self.addEventListener('install', function(e) {
	e.waitUntil( caches.open( cache ).then(function(cache) {
		return cache.addAll([
			'index.html',
			'css/layout.css',
			'manifest.json',
			'javascripture.svg',
			//libs
			'lib/MorphCodes.js',
			'lib/MorphParse.js',

			//data
			'data/bible.js',
			'data/extra-dictionary.js',
			'data/strongs-dictionary.js',
			'data/strongs-greek-dictionary.js',
			'data/KJV.js',
			'data/WEB.js',
			'data/ESV.js',
			'data/strongsObjectWithFamilies2.js',
			'data/morphhb.js',
			'data/tischendorf.js',
			'data/crossReferences.js',
			'data/morphology.js',
			'data/literalConsistent.js',
			'data/literalConsistentExtra.js',

			//api - so that search works offline?
			'api/searchApi.js',

			//modules
			'build/bundle.js',

			//workers
			'workers/worker.js',
		]);

	}));
});


function send_message_to_client(client, msg){
	return new Promise(function(resolve, reject){
		var msg_chan = new MessageChannel();

		msg_chan.port1.onmessage = function(event){
			if(event.data.error){
				reject(event.data.error);
			}else{
				resolve(event.data);
			}
		};

		client.postMessage( msg, [msg_chan.port2] );
	});
}

function send_message_to_all_clients(msg){
	clients.matchAll().then(clients => {
		clients.forEach(client => {
			send_message_to_client(client, msg).then(m => console.log("SW Received Message: "+m));
		})
	})
}


self.addEventListener('fetch', function(event) {
	send_message_to_all_clients( cache );
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

// Delete unused cache
self.addEventListener('activate', function( event ) {
	send_message_to_all_clients( cache );
	var cacheWhitelist = [ cache ];
	event.waitUntil(
		caches.keys().then(function( keyList ) {
			return Promise.all(keyList.map(function( key ) {
				if (cacheWhitelist.indexOf( key ) === -1) {
					return caches.delete( key );
				}
			}));
		})
	);
});
