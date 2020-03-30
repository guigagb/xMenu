import xMenu from "../xMenu2.js";

let menu1 = new xMenu.create({
    id: '#meuMenu1',
    buttonLeft: false,
    itens: {
        teste: {
            id: 'oi'
        },
        teste2: {
        }
    }
});

let menu2 = new xMenu.create({
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