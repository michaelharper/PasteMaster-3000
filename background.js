chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get('pasteEnabled', function(data) {
            chrome.tabs.sendMessage(tabId, {
                action: 'updatePasteState',
                isEnabled: data.pasteEnabled || false
            });
        });
    }
});