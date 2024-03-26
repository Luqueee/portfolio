// Detectamos cuando el usuario desplace la pantalla
window.onscroll = function () {
    // Obtenemos la posicion del scroll en pantall
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    // Realizamos alguna accion cuando el scroll este entre la posicion 300 y 400
    if (scroll > 83) {
        console.log('Pasaste la posicion 300 del scroll');
        document.querySelector('nav').style =
            'background: rgba(15, 15, 15, 0.3); backdrop-filter: blur(1px);';
    } else {
        document.querySelector('nav').style = '';
    }
};
