// Keep track of tabs where pasting is enabled
let enabledTabs = new Set();

// Function to check if pasting should be enabled and update the content script
function checkAndUpdateScript(tabId, url) {
    if (!url || url.startsWith('chrome://')) {
        console.log(`Skipping check for invalid or chrome:// URL: ${url}`);
        return;
    }

    chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], (data) => {
        const isEnabled = data.pasteEnabled && data.enabledUrl === url;
        if (isEnabled) {
            enabledTabs.add(tabId);
        } else {
            enabledTabs.delete(tabId);
        }
        chrome.tabs.sendMessage(tabId, {
            action: 'updatePasteState',
            isEnabled: isEnabled
        }, response => {
            if (chrome.runtime.lastError) {
                console.error("Error sending message to tab:", chrome.runtime.lastError.message);
            }
        });
    });
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        checkAndUpdateScript(tabId, tab.url);
    }
});

// Listen for tab creation
chrome.tabs.onCreated.addListener((tab) => {
    if (tab.url) {
        checkAndUpdateScript(tab.id, tab.url);
    }
});

// Other listeners remain the same...

// Function to update popup state
function updatePopupState(tabId, url) {
    chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], (data) => {
        const isEnabled = data.pasteEnabled && data.enabledUrl === url;
        chrome.action.setBadgeText({ text: isEnabled ? 'ON' : '' });
        chrome.action.setBadgeBackgroundColor({ color: isEnabled ? '#4CAF50' : '#999999' });
    });
}

// Update popup state when tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab && tab.url) {
            updatePopupState(tab.id, tab.url);
        }
    });
});