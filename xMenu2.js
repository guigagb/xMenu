export default (function () {

    const versao = '2.0';

    function create(param) {

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

                    let divCheckbox = document.createElement('div');
                    if (props.checkbox) {
                        let inputHtml = document.createElement('input');
                        inputHtml.setAttribute('type', 'checkbox');
                        inputHtml.setAttribute('id', 'sw' + arg.id + countItems);
                        inputHtml.classList.add('xMenuCheckIn');

                        let label = document.createElement('label');
                        label.classList.add('xMenuCheckLa');

                        divCheckbox.appendChild(inputHtml);
                        divCheckbox.appendChild(label);
                    }

                    let divHtml = document.createElement('div');
                    let html = document.createElement('span');
                    divHtml.appendChild(html);
                    html.innerHTML = props.html === undefined ? name : props.html;

                    let divIcon = document.createElement('div');
                    let icon = document.createElement('i');
                    if (props.icon !== undefined)
                        icon.classList = props.icon;
                    divIcon.appendChild(icon);

                    let divShortkey = undefined;
                    if (props.shortkey !== undefined) {
                        divShortkey = document.createElement('div');
                        let shortkey = document.createElement('span');
                        let [keyName, keyCode] = Object.entries(props.shortkey)[0];
                        shortkey.classList.add('short');
                        shortkey.innerHTML = keyName;
                        keyDown[String(keyCode).toUpperCase()] = props.click;

                        divShortkey.appendChild(shortkey);

                    }

                    let li = document.createElement('li');
                    li.setAttribute('id', 'xMenu_' + name);

                    li.appendChild(divCheckbox)
                    li.appendChild(divIcon);
                    li.appendChild(divHtml);

                    if (divShortkey !== undefined) {
                        li.appendChild(divShortkey);
                    }

                    if (props.click)
                        li.addEventListener('click', props.click)

                    this.elList[name] = li
                    this.element.appendChild(li);

                });
            },

            setBackground() {
                ax.background = document.createElement('div');
                ax.background.setAttribute('id', 'pnBackgroudxMenu' + arg.id);
                ax.background.classList.add('pnBackgroudxMenu');
                ax.background.style.display = 'none';
            },

            appendBody() {
                document.body.append(this.element);
                document.body.append(this.background);
                elContainerMenu = document.querySelector(arg.el)
            },

            setOpenMenu(arg) {

                function openMenu(event) {
                    if (arg.onOpen)
                        arg.onOpen(ax.elList);

                    var op = {
                        top: event.pageY + 2,
                        left: event.pageX + 2,
                        heightMenu: parseInt(ax.element.height),
                        widthMenu: parseInt(ax.element.style.width),
                        innerHeight: window.innerHeight,
                        innerWidth: window.innerWidth
                    };

                    if (op.innerHeight - (op.heightMenu + op.top) < 0)
                        op.top = op.top - op.heightMenu - 2;

                    if (op.innerWidth - (op.widthMenu + op.left) < 0)
                        op.left = op.left - op.widthMenu - 2;

                    ax.element.style.top = op.top + 'px';
                    ax.element.style.left = op.left + 'px';
                    ax.element.style.display = 'block';
                    ax.element.classList.remove('hide');


                    if (arg.animate !== undefined)
                        elContainerMenu.classList.add('animated ' + arg.animate);

                    ax.background.style.display = 'block'

                    event.preventDefault();
                }

                let context = arg.buttonLeft === true ? 'click' : 'contextmenu';
                elContainerMenu.addEventListener(context, openMenu)
            },

            setCloseMenu() {
                ax.background.addEventListener('click', this.eventCloseClick);
                ax.element.addEventListener('click', this.eventCloseClick)
            },

            eventCloseClick() {
                ax.background.style.display = 'none';
                ax.element.classList.add('hide');
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
                    key = key.replace('+16','').replace('+17','').replace('+18','');
                    
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
            }

        }

        ax.setMain(arg);
        ax.setList(arg);
        ax.setBackground();
        ax.appendBody();
        ax.setOpenMenu(arg);
        ax.setCloseMenu(arg);
        ax.setDisable(arg);
        ax.setCreate(arg);
        ax.setkeyDown();

        this.disableAll = () => ax.disableAll(arg);

        this.enableAll = () => ax.enableAll(arg)

        this.disableItem = (item) => ax.disableItem(item, arg);

        this.enableItem = (item) => ax.enableItem(item, arg);

        this.enable = (item, boolean) => ax.enable(item, boolean);

        this.setHtml = (item, html) => ax.setHtml(item, html, arg)

        this.setIcon = (item, icon) => ax.setIcon(item, icon, arg);

    }

    function getVersion() {
        return versao;
    }

    return {
        create: create,
        getVersion: getVersion
    }

})();