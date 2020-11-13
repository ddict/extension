const ex = chrome || browser

exports.closeTab = closeTab

function closeTab() {
    ex.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() {})
    })
}
