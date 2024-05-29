chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({ text: "OFF" });
});

chrome.action.onClicked.addListener(async (tab) => {
    try {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

        // Next state will always be the opposite
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });

        if (nextState === 'ON') {
            console.log('Inserting CSS');
            await chrome.scripting.insertCSS({
                files: ['inspect.css'],
                target: { tabId: tab.id },
            });
            // Execute the JS file
            await chrome.scripting.executeScript({
                files: ['inspect.js'],
                target: { tabId: tab.id },
            });
        } else if (nextState === 'OFF') {
            console.log('Removing CSS');
            await chrome.scripting.removeCSS({
                files: ['inspect.css'],
                target: { tabId: tab.id },
            });
        }
    } catch (error) {
        console.error('Error during onClicked event:', error);
    }
});
