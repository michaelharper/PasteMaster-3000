chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], function(data) {
            if (tab.url === data.enabledUrl && data.pasteEnabled) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                }, () => {
                    chrome.tabs.sendMessage(tabId, {
                        action: 'updatePasteState',
                        isEnabled: true
                    });
                });
            }
        });
    }
});

function updatePasteState(isEnabled) {
    chrome.tabs.sendMessage(tabId, {
        action: 'updatePasteState',
        isEnabled: isEnabled
    }, function(response) {
        if (chrome.runtime.lastError) {
            // Silently ignore the error
        }
    });
}