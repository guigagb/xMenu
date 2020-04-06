import xMenu from "../xMenu2.js";

var menu1 = new xMenu.create({
    id: '#meuMenu1',
    buttonLeft: false,
    disable: false,
    onCreate: () => {
        // console.log('abcde');
    },
    onOpen: (/*btn*/) => {
    },
    itens: {
        oi: {
            // icon: 'fa fa-search',
            // disable: true,
            checkbox: true,
            shortkey: {
                'ctrl1': 'ctrl+shift'
            },
            click: function () {
                console.log('menu1');
            }
        },
        hojee:{

        },
        testeeeeeee2: {
            html: 'teste teste teste aaa',
            icon: 'fa fa-trash',
            shortkey: {
                'enter': '13'
            },
            click: ()=>{
                console.log('toy toy');
            }
        },
        lala:{
            // icon: 'fa fa-link',
            checkbox: true,
            shortkey: {
                'abc': '12'
            },
            click: ()=>{
                console.log('menu2');
            },
            subMenu: {
                onOpen: ()=>{
                    // console.log('abriuuuuuuuu',a,b.offsetTop, b.offsetLeft);
                },
                itens: {
                    a: {
                        html: 'teste',
                        subMenu: {
                            itens: {
                                c: {
                                    html: 'c'
                                }
                            }
                        }
                    },
                    b:{
                        html: 'hoje'
                    }
                },
            }
        }
    }
});

// var menu2 = new xMenu.create({
//     id: '#meuMenu2',
//     itens: {
//         teste: {
//             html: 'abcd',
//             icon: 'fa-arrow-left'
//         },
//         teste2: {
//         }
//     }
// });

window.menu1 = menu1;
// window.menu2 = menu2;
window.xMenu = xMenu;