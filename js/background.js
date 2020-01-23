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

chrome.storage.local.set( { adDomainsVersion: adDomainsVersion, checkBlockListUpdate: false }, function () { } );

function checkForHostsUpdates() {
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', hostsAdsUrl );
    xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.onload = function () {
        var data = JSON.parse( xhr.responseText );
        if ( adDomainsVersion != data.version ) {
            let wasActive = active;
            if ( active ) {
                chrome.storage.sync.set( { active: false }, function () { } );
            }
            adDomains = data.adDomains;
            adDomainsVersion = data.version;
            chrome.storage.local.set( { adDomainsVersion: data.version }, function () { } );
            if ( wasActive ) {
                chrome.storage.sync.set( { active: true }, function () { } );
            }
        }
        chrome.storage.local.set( { checkBlockListUpdate: false }, function () { } );
    };
    xhr.send();
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
    if ( changes.checkBlockListUpdate ) {
        if ( changes.checkBlockListUpdate.newValue ) {
            checkForHostsUpdates();
        }
    }
} )

checkForHostsUpdates();