document.addEventListener('DOMContentLoaded', function() {
    const disableGACheckbox = document.getElementById('disableGoogleAnalytics');
    const enableAllCheckbox = document.getElementById('enableOnAllWebsites');

    // Load settings and update checkbox states
    chrome.storage.sync.get(['googleAnalyticsEnabled', 'enableOnAllWebsites'], function(data) {
        disableGACheckbox.checked = !data.googleAnalyticsEnabled; // Inverted logic
        enableAllCheckbox.checked = data.enableOnAllWebsites || false;
    });

    // Save settings when checkboxes are changed
    disableGACheckbox.addEventListener('change', function() {
        chrome.storage.sync.set({googleAnalyticsEnabled: !disableGACheckbox.checked}); // Inverted logic
    });

    enableAllCheckbox.addEventListener('change', function() {
        chrome.storage.sync.set({enableOnAllWebsites: enableAllCheckbox.checked});
    });
});