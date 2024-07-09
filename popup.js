document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('enablePaste');

    function updateToggleState(isEnabled) {
        toggleSwitch.checked = isEnabled;
    }

    function handleToggleChange() {
        const isEnabled = toggleSwitch.checked;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTabUrl = tabs[0].url;
            chrome.storage.sync.set({ pasteEnabled: isEnabled, enabledUrl: activeTabUrl }, function() {
                chrome.runtime.sendMessage({ action: 'storageUpdated' });
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updatePasteState',
                    isEnabled: isEnabled
                });
            });
        });
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTabUrl = tabs[0].url;
        chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], function(data) {
            updateToggleState((data.enabledUrl === activeTabUrl) && data.pasteEnabled);
            toggleSwitch.addEventListener('change', handleToggleChange);
        });
    });

    // Listen for updates from background script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'updatePopupState') {
            updateToggleState(request.isEnabled);
        }
    });
});