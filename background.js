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
        }, () => {
            if (chrome.runtime.lastError) {
                console.log("Tab not ready yet, will try again on next update");
            }
        });
        updatePopupState(tabId, url);
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

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && (changes.pasteEnabled || changes.enabledUrl)) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                checkAndUpdateScript(tabs[0].id, tabs[0].url);
            }
        });
    }
});

// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
    if (tab && tab.url) {
        checkAndUpdateScript(tab.id, tab.url);
    }
});

// Listen for messages indicating storage update
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'storageUpdated') {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                checkAndUpdateScript(tabs[0].id, tabs[0].url);
            }
        });
    } else if (message.action === 'getPasteState') {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], (data) => {
                    const isEnabled = data.pasteEnabled && data.enabledUrl === tabs[0].url;
                    sendResponse({isEnabled: isEnabled});
                });
            }
        });
        return true; // Indicates that the response is asynchronous
    }
});