chrome.runtime.onInstalled.addListener(() => {
    // Set Google Analytics tracking to enabled by default
    chrome.storage.sync.get('googleAnalyticsEnabled', (data) => {
        if (data.googleAnalyticsEnabled === undefined) {
            chrome.storage.sync.set({googleAnalyticsEnabled: true});
        }
    });
});

// Function to dynamically inject or remove the Google Analytics script based on user preference
function updateAnalyticsScript(enable) {
    if (enable) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3M2PJPZZ73';
        script.id = 'ga-script';
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3M2PJPZZ73');
        `;
        inlineScript.id = 'ga-inline-script';
        document.head.appendChild(inlineScript);
    } else {
        const script = document.getElementById('ga-script');
        const inlineScript = document.getElementById('ga-inline-script');
        if (script) document.head.removeChild(script);
        if (inlineScript) document.head.removeChild(inlineScript);
    }
}

// Listen for changes to the Google Analytics enabled setting
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'googleAnalyticsEnabled') {
            updateAnalyticsScript(newValue);
        }
    }
});

// Check the current state of the Google Analytics setting and update the script accordingly
chrome.storage.sync.get('googleAnalyticsEnabled', (data) => {
    updateAnalyticsScript(data.googleAnalyticsEnabled);
});