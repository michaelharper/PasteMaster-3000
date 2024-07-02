function makeFieldsPastable(isEnabled) {
    document.querySelectorAll('input, textarea').forEach(function(element) {
        if (isEnabled) {
            element.removeAttribute('readonly');
            element.removeAttribute('disabled');
            element.removeAttribute('onpaste');
            element.addEventListener('paste', function(event) {
                event.stopImmediatePropagation();
            }, true);
        } else {
            element.setAttribute('onpaste', 'return false;');
        }
    });
}

// Listen for messages from popup.js to apply changes
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updatePasteState') {
        makeFieldsPastable(request.isEnabled);
    }
});
