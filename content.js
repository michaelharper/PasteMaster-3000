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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updatePasteState') {
        makeFieldsPastable(request.isEnabled);
    }
});

// Immediately make fields pastable when the script is injected
makeFieldsPastable(true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updatePasteState') {
        makeFieldsPastable(request.isEnabled);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['pasteEnabled', 'enabledUrl'], function(data) {
        if (data.enabledUrl === window.location.href) {
            makeFieldsPastable(data.pasteEnabled);
        }
    });
});