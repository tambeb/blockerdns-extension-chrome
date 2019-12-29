var active;
const MDCSwitch = mdc.switch.MDCSwitch;
const MDCSwitchFoundation = mdc.switch.MDCSwitchFoundation;
const switchControl = new MDCSwitch( document.querySelector( '.mdc-switch' ) );

function update() {
    chrome.storage.sync.get( [ 'active' ], function ( result ) {
        active = result.active;
        if ( result.active ) {
            document.getElementById( 'active' ).innerHTML = 'Ad blocking is ON';
            switchControl.checked = true;
        }
        else {
            document.getElementById( 'active' ).innerHTML = 'Ad blocking is OFF';
            switchControl.checked = false;
        }
    } )
}

function toggleActive() {
    chrome.storage.sync.set( { active: !active }, function () { } );
    active = !active;
    update();
}

document.getElementById( 'activeToggle' ).addEventListener( 'click', toggleActive )

update();