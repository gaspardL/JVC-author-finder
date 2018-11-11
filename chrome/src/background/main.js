chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.get({ clearDataPeriodHour: 24 }, (items) => {
        chrome.alarms.create({periodInMinutes: 60 * items.clearDataPeriodHour});
    });
});

chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.sync.get({ clearDataPeriodHour: 24 }, (options) => {
        chrome.storage.local.get(null, (items) => {
            var now = Date.now();
            for(element in items){
                if(items[element].visitedTime + 1000 * 3600 * options.clearDataPeriodHour < now){
                    chrome.storage.local.remove(element);
                }
            }
        });
    });
});
