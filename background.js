// Keep track of tabs where pasting is enabled
let enabledTabs = new Set();

// Function to check if pasting should be enabled and inject the script if needed
function checkAndInjectScript(tabId, url) {
    chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], (data) => {
        if (data.pasteEnabled && data.enabledUrl === url) {
            enabledTabs.add(tabId);
            injectContentScript(tabId, true);
        } else if (enabledTabs.has(tabId)) {
            enabledTabs.delete(tabId);
            injectContentScript(tabId, false);
        } else {
            enabledTabs.delete(tabId);
            injectContentScript(tabId, false);
        }
    });
}

// Inject content script and send message
function injectContentScript(tabId, isEnabled) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            chrome.tabs.sendMessage(tabId, {
                action: 'updatePasteState',
                isEnabled: isEnabled
            });
        }
    });
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        checkAndInjectScript(tabId, tab.url);
    }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        checkAndInjectScript(tab.id, tab.url);
    });
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && (changes.pasteEnabled || changes.enabledUrl)) {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => checkAndInjectScript(tab.id, tab.url));
        });
    }
});

// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
    checkAndInjectScript(tab.id, tab.url);
});

// Added: Listen for messages indicating storage update
chrome.runtime.onMessage.addListener((message, sender,  sendResponse) => {
    if (message.action === 'storageUpdated') {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => checkAndInjectScript(tab.id, tab.url));
        });
    }
});