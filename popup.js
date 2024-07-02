document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('enablePaste');

    // Restore the toggle state from chrome.storage
    chrome.storage.sync.get('pasteEnabled', function(data) {
        toggleSwitch.checked = data.pasteEnabled || false;
        // Send message to update content script based on the stored state
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'updatePasteState',
                isEnabled: toggleSwitch.checked
            });
        });
    });

    // Set up event listener for the toggle switch
    toggleSwitch.addEventListener('change', function() {
        const isEnabled = toggleSwitch.checked;
        chrome.storage.sync.set({ pasteEnabled: isEnabled }, function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updatePasteState',
                    isEnabled: isEnabled
                });
            });
        });
    });
});
