// Create a clone of the menu, right next to original.
window.onscroll = function() {myFunction()};

function myFunction() {
    if (document.body.scrollTop >300 || document.documentElement.scrollTop > 300) {
        document.getElementById("cssmenu").className = 'fixed-header';
    } else {
        document.getElementById("cssmenu").className = '';
    }
}
