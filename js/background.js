var active;

const redirector = function () {
    return { redirectUrl: redirectUrl };
}

function activate() {
    active = true;
    chrome.browserAction.setIcon( { path: 'img/icon_16.png' } );
    chrome.browserAction.setTitle( { title: 'blockerDNS is currently running' } );
    activateRedirector();
}

function deactivate() {
    active = false;
    chrome.browserAction.setIcon( { path: 'img/icon_bw_16.png' } );
    chrome.browserAction.setTitle( { title: 'blockerDNS is turned off' } );
    deactivateRedirector();
}

function activateRedirector() {
    chrome.webRequest.onBeforeRequest.addListener(
        redirector,
        {
            urls: adDomains
        },
        [ "blocking" ] );
}

function deactivateRedirector() {
    chrome.webRequest.onBeforeRequest.removeListener( redirector );
}

chrome.storage.sync.get( [ 'active' ], function ( result ) {
    if ( result.active == true ) {
        activate();
    }
    else if ( result.active == false ) {
        deactivate();
    }
    else {
        chrome.storage.sync.set( { active: true }, function () {
            activate();
        } );
    }
} )

chrome.storage.onChanged.addListener( function ( changes, areaName ) {
    if ( changes.active ) {
        if ( changes.active.newValue ) {
            activate();
        }
        else {
            deactivate();
        }
    }
} )

chrome.runtime.onInstalled.addListener( function () {
    chrome.tabs.create( { url: 'https://blockerdns.com/extension' } );
} )