document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('enablePaste');

    function handleToggleChange() {
        const isEnabled = toggleSwitch.checked;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTabUrl = tabs[0].url;
            chrome.storage.sync.set({ pasteEnabled: isEnabled, enabledUrl: activeTabUrl }, function() {
                if (isEnabled) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['content.js']
                    }, () => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'updatePasteState',
                            isEnabled: isEnabled
                        });
                    });
                } else {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updatePasteState',
                        isEnabled: isEnabled
                    });
                }
            });
        });
    }

    function initializePopup() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTabUrl = tabs[0].url;
            chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], function(data) {
                if (data.enabledUrl === activeTabUrl) {
                    toggleSwitch.checked = data.pasteEnabled || false;
                } else {
                    toggleSwitch.checked = false;
                }
                toggleSwitch.addEventListener('change', handleToggleChange);
            });
        });
    }

    initializePopup();
});