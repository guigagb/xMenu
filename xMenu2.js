export default (function () {

    const versao = '2.0';
    let countMenu = 0;

    function create(param) {
        countMenu++;
        var countItems = 0;
        var elementMenu = undefined; // essa variável serve para armazenar a referência do menu após ter sido adicionado no body;

        const argDefault = {
            el: '',
            itens: {},
            buttonLeft: false,
            icon: undefined,
            shortKey: undefined,
            disable: false,
            animate: undefined,
            open: false,
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
            shortKeyEnable: false,

            setMain(arg) {
                this.element = document.createElement('ul');
                this.element.setAttribute('id', 'xMenu_' + arg.id);
                this.element.classList.add("xMenu");
                this.element.setAttribute('hidden', 'hidden');
                if (arg.buttonLeft)
                    this.element.classList.add("pop_up_btn_left");
            },

            setList(arg) {
                //loop que adiciona os itens passados para o menu
                Object.entries(arg.itens).forEach(ln => {
                    let [name, props] = ln;

                    countItems++;

                    let divHtml = document.createElement('div');
                    let html = document.createElement('span');
                    divHtml.appendChild(html);
                    html.innerHTML = props.html === undefined ? name : props.html;

                    let divIcon = document.createElement('div');
                    let icon = document.createElement('i');
                    if (props.icon !== undefined)
                        icon.classList.add(props.icon);
                    divIcon.appendChild(icon);


                    let divShortKey = undefined;
                    if (props.shortKey !== undefined) {
                        divShortKey = document.createElement('div');
                        let shortKey = document.createElement('span');
                        shortKey.classList.add('short');
                        shortKey.innerText = props.shortKey;
                        divShortKey.appendChild(shortKey);
                        this.shortKeyEnable = true;
                    }

                    let li = document.createElement('li');
                    li.setAttribute('id', 'xMenu_' + name);

                    if (divIcon !== undefined)
                        li.appendChild(divIcon);

                    li.appendChild(divHtml);

                    if (divShortKey !== undefined)
                        li.appendChild(divShortKey);

                    if(props.click)
                        li.addEventListener('click',props.click)

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

                elementMenu = document.querySelector(arg.el)
            },

            setOpenMenu(arg) {

                function openMenu(event) {
                    if (arg.open)
                        arg.open();

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
                        elementMenu.classList.add('animated ' + arg.animate);

                    ax.background.style.display = 'block'

                    event.preventDefault();
                }

                let context = arg.buttonLeft === true ? 'click' : 'contextmenu';
                elementMenu.addEventListener(context, openMenu)
            },

            setCloseMenu(arg) {

                ax.background.addEventListener('click', this.eventCloseClick);
                ax.element.addEventListener('click', this.eventCloseClick)

            },

            eventCloseClick() {
                ax.background.style.display = 'none';
                ax.element.classList.add('hide');
            },

            disableItem(item, arg) {

                let idItem = '#xMenu_' + arg.id + ' #xMenu_' + item;
                let element = document.querySelector(idItem);
                arg.itens[item].disable = true;

                if (element.className.indexOf('dis_ok') === -1) {
                    element.setAttribute('disable', true);

                    if(arg.itens[item].click)
                        element.removeEventListener('click', arg.itens[item].click)

                    element.classList.add('dis_ok');
                    element.classList.remove('ena_ok');

                    let checkbox = element.querySelector('input[type="checkbox"]');
                    if (checkbox)
                        checkbox.setAttribute('disabled', 'disabled');
                }

            },

            enableItem(item, arg) {
                let idItem = '#xMenu_' + arg.id + ' #xMenu_' + item;
                let element = document.querySelector(idItem);
                arg.itens[item].disable = false;

                if (element.className.indexOf('ena_ok') === -1) {
                    element.setAttribute('disable', false);

                    if(arg.itens[item].click)
                        element.addEventListener('click', arg.itens[item].click)

                    element.classList.remove('dis_ok');
                    element.classList.add('ena_ok');

                    let checkbox = element.querySelector('input[type="checkbox"]');
                    if (checkbox)
                        checkbox.removeAttribute('disabled');

                }
            }
        }

        ax.setMain(arg);
        ax.setList(arg);
        ax.setBackground();
        ax.appendBody();
        ax.setOpenMenu(arg);
        ax.setCloseMenu(arg);

        this.disableItem = (item) => ax.disableItem(item, arg);

        this.enableItem = (item) => ax.enableItem(item, arg);

    }

    return {
        create: create
    }

})();