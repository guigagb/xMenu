import xMenu from "../xMenu2.js";

var menu1 = new xMenu.create({
    id: '#meuMenu1',
    buttonLeft: false,
    open: ()->{

    },
    itens: {
        oi: {
            click: function () {  
                console.log('oi');
            }
        },
        teste2: {
        }
    }
});

var menu2 = new xMenu.create({
    id: '#meuMenu2',
    itens: {
        teste: {
            html: 'abcd',
            icon: 'fa-arrow-left'
        },
        teste2: {
        }
    }
});

window.menu1 = menu1;