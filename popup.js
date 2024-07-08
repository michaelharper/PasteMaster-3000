document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('enablePaste');

    function handleToggleChange() {
        const isEnabled = toggleSwitch.checked;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTabUrl = tabs[0].url;
            chrome.storage.sync.set({ pasteEnabled: isEnabled, enabledUrl: activeTabUrl }, function() {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updatePasteState',
                    isEnabled: isEnabled
                });
            });
        });
    }

    chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], function(data) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTabUrl = tabs[0].url;
            if (data.enabledUrl === activeTabUrl) {
                toggleSwitch.checked = data.pasteEnabled || false;
            } else {
                toggleSwitch.checked = false;
            }
            toggleSwitch.addEventListener('change', handleToggleChange);
        });
    });
});