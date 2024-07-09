document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('enablePaste');

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
            toggleSwitch.checked = (data.enabledUrl === activeTabUrl) && data.pasteEnabled;
            toggleSwitch.addEventListener('change', handleToggleChange);
        });
    });
});