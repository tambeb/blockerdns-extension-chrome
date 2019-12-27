chrome.webRequest.onBeforeRequest.addListener(
    function ( info ) {
        return { redirectUrl: redirectUrl };
    },
    {
        urls: adDomains
    },
    [ "blocking" ] );
