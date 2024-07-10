let isPastingEnabled = false;

function makeFieldsPastable(isEnabled) {
    if (isPastingEnabled === isEnabled) return;

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

    isPastingEnabled = isEnabled;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updatePasteState') {
        makeFieldsPastable(request.isEnabled);
    }
});

// Immediately check the state when the script is injected
chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], function(data) {
    if (data.pasteEnabled && data.enabledUrl === window.location.href) {
        makeFieldsPastable(true);
    }
});

// Listen for DOM changes and reapply if necessary
const observer = new MutationObserver(() => {
    if (isPastingEnabled) {
        makeFieldsPastable(true);
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Request current state from background script
chrome.runtime.sendMessage({action: 'getPasteState'}, function(response) {
    if (response && response.isEnabled !== undefined) {
        makeFieldsPastable(response.isEnabled);
    }
});