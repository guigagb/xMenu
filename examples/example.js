import xMenu from "../xMenu2.js";

const menu = new xMenu.create({
    el: '#minhaDiv',
    buttonLeft: false,
    disable: false,
    onCreate: () => {
        // console.log('abcde');
    },
    onOpen: (/*btn*/) => {

    },
    items: {
        item1:{
            html: 'Item simples',
            click: ()=>{
                alert('item simples');
            }
        },
        item2:{
            html: 'Item desabilitado',
            disable: true,
            click: ()=>{
                alert('item desabilitado');
            }
        },
        item3:{
            html: 'Item com ícone',
            icon: 'fa fa-trash',
            click: ()=>{
                alert('item com ícone');
            }
        },
        item4:{
            html: 'Item com submenu',
            subMenu: {
                items: {
                    item5: {
                        html: 'Item com ícone e submenu',
                        icon: 'fa fa-list',
                        subMenu: {
                            items: {
                                item6: {
                                    click: ()=>{
                                        alert('item simples!')
                                    },
                                    html: 'Item simples'
                                }
                            }
                        }
                    },
                    item7:{
                        click: ()=>{
                            alert('item simples!')
                        },
                        html: 'Item simples'
                    }
                },
            }
        },
        item8: {
            html: 'Item com checkbox',
            checkbox: true,
            click: function () {
                alert('Item com checkbox');
            }
        },
        item9:{
            html: 'Item com atalho',
            shortkey: {
                F3: 114
            },
            click: ()=>{
                alert('item com atalho!')
            }
        },
        item10: {
            html: 'Item com ícone e atalho',
            icon: 'fa fa-trash',
            shortkey: {
                'F6': 117
            },
            click: ()=>{
                alert('item com ícone e atalho');
            }
        }
    }
});

window.menu = menu;