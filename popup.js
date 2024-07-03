document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('enablePaste');

    function handleToggleChange() {
        const isEnabled = toggleSwitch.checked;
        chrome.storage.sync.set({ pasteEnabled: isEnabled }, function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updatePasteState',
                    isEnabled: isEnabled
                });
            });
        });
    }

    chrome.storage.sync.get('pasteEnabled', function(data) {
        // Directly set the checked state without triggering the change event
        toggleSwitch.checked = data.pasteEnabled || false;
        // Now, add the event listener for future user interactions
        toggleSwitch.addEventListener('change', handleToggleChange);
    });
});