// Given a UserAgent object, will replace the "User-Agent" header in the
// map provided as requestHeaders.
function replaceHeader(user_agent, requestHeaders) {
  if (!user_agent || !user_agent.ua_string)
    return requestHeaders;
  var newHeaders = [];
  for (var i = 0; i < requestHeaders.length; i++) {
    if (requestHeaders[i].name != "User-Agent") {
      newHeaders.push(requestHeaders[i]);
    } else {
      var new_value = requestHeaders[i].value;
      if (user_agent.ua_string != "")
        new_value = (user_agent.append_to_default_ua ? new_value + " " + user_agent.ua_string : user_agent.ua_string);
      newHeaders.push({"name"  : "User-Agent",
                       "value" : new_value});
    }
  }
  return newHeaders;
}

// Adds listeners that handle modifying headers on any request that comes through.
// Really only needs to be called once.
// The Listener can *not* be a callback.  It *must* be blocking.
function updateListeners() {
  if (!listener) {
    listener = function(details) {
      // We only want to modify requests that have a URL, and that have headers.
      // Any others are not interesting enough to have their headers modified.
      var header_map = { requestHeaders : details.requestHeaders };
      if (details && details.url && details.requestHeaders && details.requestHeaders.length > 0) {
        header_map = {requestHeaders : replaceHeader(getCacheSpoofValues(details.url, details.tabId), details.requestHeaders)};
      }
      return header_map;
    };
  }
  chrome.webRequest.onBeforeSendHeaders.addListener(listener,
    {"urls": ["http://*/*", "https://*/*"]},
    ["requestHeaders", "blocking"]);
}

var listener = null;
updateListeners();