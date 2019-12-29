var active;

function update() {
    chrome.storage.sync.get( [ 'active' ], function ( result ) {
        active = result.active;
        if ( result.active ) {
            document.getElementById( 'active' ).innerHTML = 'blockerDNS is currently running';
            document.getElementById( 'toggleActive' ).innerHTML = 'Turn Off';
        }
        else {
            document.getElementById( 'active' ).innerHTML = 'blockerDNS is currently not running';
            document.getElementById( 'toggleActive' ).innerHTML = 'Turn On';
        }
    } )
}

function toggleActive() {
    chrome.storage.sync.set( { active: !active }, function () { } );
    active = !active;
    update();
}

document.getElementById( 'toggleActive' ).addEventListener( 'click', toggleActive );

update();