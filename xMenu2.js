export default (function () {

    const versao = '2.0';

    function create(param, owner) {

        if (this)
            owner = this;

        var countItems = 0;
        var elContainerMenu = undefined; // essa variável serve para armazenar a refencia do container do menu após ter sido adicionado no body;
        var keyDown = {};

        const argDefault = {
            el: '',
            itens: {},
            buttonLeft: false,
            icon: undefined,
            disable: false,
            animate: undefined,
            onOpen: undefined,
            onCreate: undefined,
            parent: undefined,
            callClick: {}
        };

        // validarParams

        let arg = Object.assign(argDefault, param);

        arg.el = arg.id;
        arg.id = arg.id.replace(/[#. ]/g, '');

        let ax = {
            element: '',    // popup
            list: [],       // itens do popup
            background: '',
            elList: {},

            createDivLeft(name, props) {
                let divLeft = document.createElement('div');

                let icon = document.createElement('i');
                if (props.icon !== undefined)
                    icon.classList = props.icon + ' icon';
                divLeft.appendChild(icon);

                if (props.checkbox && props.subMenu === undefined) {
                    let label = document.createElement('label');
                    label.classList.add('xMenuCheckLa');

                    let inputCheck = document.createElement('input');
                    inputCheck.setAttribute('type', 'checkbox');
                    inputCheck.setAttribute('id', 'sw' + name + countItems);

                    label.appendChild(inputCheck);
                    divLeft.appendChild(label);
                }

                return divLeft;
            },

            createDivCenter(name, props) {
                let divCenter = document.createElement('div');

                let html = document.createElement('span');
                html.innerHTML = props.html === undefined ? name : props.html;

                divCenter.appendChild(html);
                return divCenter;
            },

            createDivRight(name, props) {
                let divRight = document.createElement('div');
                let shortkey = document.createElement('span');

                if (props.shortkey !== undefined && props.subMenu === undefined) {
                    let [keyName, keyCode] = Object.entries(props.shortkey)[0];
                    shortkey.classList.add('short');
                    shortkey.innerHTML = keyName;
                    keyDown[String(keyCode).toUpperCase()] = props.click;
                }

                if (props.subMenu !== undefined){
                    shortkey.innerText = '►';
                    shortkey.classList.add('short');
                }

                divRight.appendChild(shortkey);
                return divRight;
            },

            setMain(arg) {
                this.element = document.createElement('ul');
                this.element.setAttribute('id', 'xMenu_' + arg.id);
                this.element.classList = "xMenu hide";
                this.element.setAttribute('hidden', 'hidden');
                if (arg.buttonLeft)
                    this.element.classList.add("pop_up_btn_left");
            },

            setList(arg) {
                //loop que adiciona os itens passados para o menu

                Object.entries(arg.itens).forEach(ln => {
                    let [name, props] = ln;

                    countItems++;

                    let divLeft = this.createDivLeft(name, props);
                    let divCenter = this.createDivCenter(name, props);
                    let divRight = this.createDivRight(name, props);

                    let li = document.createElement('li');
                    li.setAttribute('id', 'xMenu_' + name);

                    li.appendChild(divLeft);
                    li.appendChild(divCenter);
                    li.appendChild(divRight);

                    if (props.click)
                        li.addEventListener('click', props.click);

                    if (!props.subMenu) {
                        li.addEventListener('click', () => {
                            this.eventCloseClick(li);
                        })
                    }

                    if (props.checkbox) {
                        li.addEventListener('change', () => {
                            if (divLeft.querySelector('label').classList.contains('checked'))
                                divLeft.querySelector('label').classList.remove('checked')
                            else
                                divLeft.querySelector('label').classList.add('checked');
                        });
                    }

                    this.element.appendChild(li);
                    this.elList[name] = li

                });
            },

            setBackground(arg) {
                if (arg.backgroundParent) {
                    ax.background = arg.backgroundParent;
                    return;
                }

                ax.background = document.createElement('div');
                ax.background.setAttribute('id', 'pnBackgroudxMenu' + arg.id);
                ax.background.classList.add('pnBackgroudxMenu');
                ax.background.style.display = 'none';
            },

            append(arg) {
                if (arg.parent) {
                    arg.parent.appendChild(this.element);
                }
                else {
                    document.body.append(this.element);
                    document.body.append(this.background);
                }
                elContainerMenu = document.querySelector(arg.el)
            },

            setOpenMenu(arg) {

                const openMenu = (event) => {
                    if (arg.onOpen)
                        arg.onOpen(ax.elList);

                    let posParent = arg.parent ? arg.parent.getBoundingClientRect() : undefined;

                    var op = {
                        top: posParent ? posParent.y : event.pageY + 2,
                        left: posParent ? posParent.x + posParent.width : event.pageX + 2,
                        heightMenu: parseFloat(33 * countItems),
                        widthMenu: posParent ? posParent.width : 0,
                        innerHeight: window.innerHeight,
                        innerWidth: window.innerWidth
                    };

                    if (op.innerHeight - (op.heightMenu + op.top) < 0)
                        op.top = op.top - op.heightMenu - 2;

                    if (op.innerWidth - (op.left + op.widthMenu) < 0)
                        op.left = op.left - op.widthMenu

                    ax.element.style.top = op.top + 'px';
                    ax.element.style.left = op.left + 'px';
                    ax.element.style.display = 'block';
                    ax.element.classList.remove('hide');

                    if (arg.animate !== undefined)
                        elContainerMenu.classList.add('animated ' + arg.animate);

                    if (ax.background)
                        ax.background.style.display = 'block'

                    event.preventDefault();
                }

                const hideMenu = () => {
                    ax.element.classList.add('hide');
                }

                if (arg.parent) {
                    elContainerMenu.addEventListener('mouseover', openMenu)
                    elContainerMenu.addEventListener('mouseout', hideMenu);
                } else {
                    let context = arg.buttonLeft === true ? 'click' : 'contextmenu';
                    elContainerMenu.addEventListener(context, openMenu)
                }

            },

            setCloseMenu() {
                if (ax.background)
                    ax.background.addEventListener('click', this.eventCloseClick);
            },

            eventCloseClick(li = undefined) {
                ax.element.classList.add('hide');
                if (ax.background)
                    ax.background.style.display = 'none'

                if (li === undefined)
                    return

                let parentUL = li.parentNode.parentNode.parentNode;
                if (parentUL.nodeName === 'UL') {
                    parentUL.classList.add('hide');
                    this.eventCloseClick(li.parentNode.parentNode);
                }
            },

            disableAll(arg) {
                Object.keys(arg.itens).forEach(key => {
                    this.disableItem(key, arg);
                })
            },

            enableAll(arg) {
                Object.keys(arg.itens).forEach(key => {
                    this.enableItem(key, arg);
                })
            },

            disableItem(item, arg) {

                let element = this.elList[item];
                element.disable = true;

                if (element.className.indexOf('dis_ok') === -1) {
                    element.setAttribute('disable', true);

                    if (arg.itens[item].click)
                        element.removeEventListener('click', arg.itens[item].click)

                    element.classList.add('dis_ok');
                    element.classList.remove('ena_ok');

                    let checkbox = element.querySelector('input[type="checkbox"]');
                    if (checkbox)
                        checkbox.setAttribute('disabled', 'disabled');
                }

            },

            enableItem(item, arg) {
                let element = this.elList[item];
                arg.itens[item].disable = false;

                if (element.className.indexOf('ena_ok') === -1) {
                    element.setAttribute('disable', false);

                    if (arg.itens[item].click)
                        element.addEventListener('click', arg.itens[item].click)

                    element.classList.remove('dis_ok');
                    element.classList.add('ena_ok');

                    let checkbox = element.querySelector('input[type="checkbox"]');
                    if (checkbox)
                        checkbox.removeAttribute('disabled');

                }
            },

            enable(item, boolean) {
                if (boolean)
                    this.enableItem(item, arg)
                else
                    this.disableItem(item, arg)
            },

            setHtml(item, html) {
                let element = this.elList[item];
                if (element)
                    element.getElementsByTagName('span')[0].innerHTML = html;
            },

            setIcon(item, icon) {
                let element = this.elList[item];
                if (element) {
                    element.getElementsByTagName('i')[0].classList = ''
                    element.getElementsByTagName('i')[0].classList = icon;
                }
            },

            setDisable(arg) {
                Object.entries(arg.itens).forEach(el => {
                    let [key, props] = el;
                    if (arg.disable === true || props.disable === true)
                        this.disableItem(key, arg);
                })
            },

            setCreate(arg) {
                if (arg.onCreate)
                    arg.onCreate();
            },

            setkeyDown() {

                document.addEventListener('keydown', (e) => {

                    if (this.element.classList.contains('hide'))
                        return;

                    let ctrlKey = e.ctrlKey ? "CTRL+" : "";
                    let shiftKey = e.shiftKey ? "SHIFT+" : "";
                    let altKey = e.altKey ? "ALT+" : "";
                    let key = ctrlKey + shiftKey + altKey + e.keyCode;
                    key = key.replace('+16', '').replace('+17', '').replace('+18', '');

                    if (keyDown[key]) {
                        keyDown[key]();
                        this.eventCloseClick();
                        if (e.preventDefault)
                            e.preventDefault();
                        if (e.stopPropagation)
                            e.stopPropagation();
                        return false;
                    }

                })
            },

            subMenuCreate(owner, arg) {
                Object.entries(arg.itens).forEach(el => {
                    let [name, props] = el;
                    if (props.subMenu) {
                        create({
                            id: '#xMenu_' + name,
                            itens: props.subMenu.itens,
                            onOpen: props.subMenu.onOpen,
                            parent: ax.elList[name],
                            backgroundParent: ax.background
                        }, owner);
                    }
                })
            },

            getDimensionsMenu() {
                /* como a posição do menu é calculada antes do mesmo ser renderizado é
                necessário clonar o objeto pra saber sua largura e altura e depois destrui-lo.*/
                // let e = ax.element.lastChild;
                // e.clodeNode(false);
                // e.style.visibility = "hidden";
                // document.body.appendChild(e);
                // let height = e.offsetHeight + 0;
                // let width = e.offsetWidth + 0;
                // document.body.removeChild(e);
                // e.style.visibility = "visible";
                // return { height, width };
            }

        }

        ax.setMain(arg);
        ax.setBackground(arg);
        ax.setList(arg);
        ax.append(arg);
        ax.setOpenMenu(arg);
        ax.setCloseMenu(arg);
        ax.setDisable(arg);
        ax.setCreate(arg);
        ax.setkeyDown();
        ax.subMenuCreate(owner, arg);

        owner.disableAll = () => ax.disableAll(arg);

        owner.enableAll = () => ax.enableAll(arg)

        owner.disableItem = (item) => ax.disableItem(item, arg);

        owner.enableItem = (item) => ax.enableItem(item, arg);

        owner.enable = (item, boolean) => ax.enable(item, boolean);

        owner.setHtml = (item, html) => ax.setHtml(item, html, arg)

        owner.setIcon = (item, icon) => ax.setIcon(item, icon, arg);

    }

    function getVersion() {
        return versao;
    }

    return {
        create: create,
        getVersion: getVersion
    }

})();