function getAllTopics(){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (items) => {
            chrome.runtime.lastError ? reject() : resolve(items);
        });
    });
}

function getSavedTopic(id) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(id, (items) => {
            chrome.runtime.lastError ? resolve(null) : resolve(items[id]);
        });
    });
}

function updateTopic(id, topic) {
    return new Promise((resolve, reject) => {
        var items = {};
        items[id] = topic;
        chrome.storage.local.set(items, () => {
            if(chrome.runtime.lastError) {
                console.log("JVC author finder : error while saving topic");
                reject();
            }
            resolve();
        });
    });
}

function removeTopic(id){
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(id, () => {
            if(chrome.runtime.lastError) {
                console.log("JVC author finder : error while removing topic");
                reject();
            }
            resolve();
        });
    });
}

function getChosenColor(){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({ authorColor: '#faebd7' }, (items) => {
            if(chrome.runtime.lastError) {
                console.log("JVC author finder : error while retrieving chosen color");
                reject();
            }
            resolve(items.authorColor);
        });
    });
}