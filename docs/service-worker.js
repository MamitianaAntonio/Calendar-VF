self.addEventListener('install', (event) => {
    console.log('Service Worker installé');
});

    self.addEventListener('activate', (event) => {
        console.log('Service Worker active');   
    });

    self.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
            const { title, options } = event.data;
            self.registration.showNotification(title, options);
        }
    });

    self.addEventListener('notificationclick', (event) => {
        event.notification.close();
        // Vous pouvez ajouter des actions à réaliser lorsque la notification est cliquée
    });


