chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], function(data) {
            if (tab.url === data.enabledUrl) {
                chrome.tabs.sendMessage(tabId, {
                    action: 'updatePasteState',
                    isEnabled: data.pasteEnabled || false
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        // Silently ignore the error
                    }
                });
            }
        });
    }
});