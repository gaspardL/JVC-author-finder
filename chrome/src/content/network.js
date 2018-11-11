function callPage(url){
    return new Promise((resolve, reject) => {
        
        function onError(event) {
            reject("Une erreur " + event.target.status + " s'est produite au cours de la réception du document.");
        }
        
        function onLoad(event) {
            if (this.status === 200) {
                resolve(this.responseText);
            } else {
                reject("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
        
        const req = new XMLHttpRequest();
        req.onerror = onError;
        req.onload = onLoad;
        
        req.open('GET', "http://www.jeuxvideo.com/forums/"+ url, true);
        req.send(null);
    });
}