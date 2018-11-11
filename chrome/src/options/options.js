var initialClearDataPeriodHour;

function restore_options() {
    chrome.storage.sync.get({
        authorColor: '#faebd7',
        clearDataPeriodHour: 24
    }, function(items) {
        document.getElementById('colorSelecter').value = items.authorColor;
        document.getElementById('colorPicker').value = items.authorColor;
        document.getElementById('clearPeriod').value = items.clearDataPeriodHour;
        initialClearDataPeriodHour = items.clearDataPeriodHour;
    });
}

function onChange_colorSelecter(){
    var value = document.getElementById('colorSelecter').value;
    document.getElementById('colorPicker').value = value;
}
function onChange_colorPicker(){
    var value = document.getElementById('colorPicker').value;
    document.getElementById('colorSelecter').value = value;
}


function displayStatus(text){
    var status = document.getElementById('status');
    status.textContent = text;
    setTimeout(function() {
        status.textContent = '';
    }, 1500);
}

function removeTopics(){
    document.getElementById('confirm_remove').style.display = "block";
}
function confirm_removeTopics(){
    chrome.storage.local.clear(() => {
        displayStatus("Topics supprimés");
    });
    hide_removeTopics();
}
function hide_removeTopics(){
    document.getElementById('confirm_remove').style.display = "none";
}

function resetOptions(){
    document.getElementById('colorSelecter').value = "#faebd7";
    document.getElementById('colorPicker').value = "#faebd7";
    document.getElementById('clearPeriod').value = 24;
}

function save(){
    var clearDataPeriodHour = document.getElementById('clearPeriod').value;

    chrome.storage.sync.set({
        authorColor: document.getElementById('colorPicker').value,
        clearDataPeriodHour: clearDataPeriodHour
    }, () => {
        if(clearDataPeriodHour != initialClearDataPeriodHour){
            chrome.alarms.create({periodInMinutes: 60 * clearDataPeriodHour});
        }
        displayStatus("Options saved");
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('colorSelecter').addEventListener('change', onChange_colorSelecter);
document.getElementById('colorPicker').addEventListener('change', onChange_colorPicker);
document.getElementById('save').addEventListener('click', save);

document.getElementById('removeTopics').addEventListener('click', removeTopics);
document.getElementById('resetOptions').addEventListener('click', resetOptions);
document.getElementById('confirm_removeTopics').addEventListener('click', confirm_removeTopics);
document.getElementById('cancel_removeTopics').addEventListener('click', hide_removeTopics);