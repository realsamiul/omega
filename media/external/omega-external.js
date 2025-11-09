let EXTERNAL_CSS_LOADED = false;
let EXTERNAL_DOM_LOADED = false;
let VENDOR_SCRIPTS_LOADED = false;
let EXTERNAL_DOM = null;

class OmegaExternal extends HTMLElement {
    /**
     * @return {OmegaExternal}
     */
    constructor() {
        super();
        this.htmlContent = null;
        this.connected = false;
        this.rendered = false;
        this.slots = [];
        this.scripts = [];
        this.vendorScripts = ['focus-visible'];

        this.classList.add('ow_ext');
        document.addEventListener('external-dom-loaded', this.domLoadedCallback.bind(this));

        const baseUrl = this.getAttribute('base-url') || 'https://www.omegawatches.com/';
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

        const url = new URL(this.baseUrl);
        this.serverUrl = `${url.origin}/`;
        this.baseSlug = url.pathname.replace(/^\/+/, '');

        this.isDevMode = this.getAttribute('dev-mode') === 'true';
        const theme = this.isDevMode ? 'Omega/default/en_US' : 'Omega/default/default';
        this.minified = this.isDevMode ? '' : '.min';

        const now = new Date();
        const ms = 30 * 60 * 1000; // 30 minutes in milliseconds
        const rounded = Math.floor(now.getTime() / ms) * ms;
        const timestamp = rounded / 1000;

        this.staticUrl = `${this.serverUrl}static/version${timestamp}/frontend/${theme}/`;

        if (!EXTERNAL_CSS_LOADED) {
            EXTERNAL_CSS_LOADED = true;

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = `${this.staticUrl}css/styles-external${this.minified}.css`;
            document.head.appendChild(link);
        }

        if (!EXTERNAL_DOM_LOADED) {
            EXTERNAL_DOM_LOADED = true;
            fetch(`${this.baseUrl}reflet/ajax/content`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    EXTERNAL_DOM = data;
                    document.dispatchEvent(new CustomEvent('external-dom-loaded'));
                })
                .catch(error => {
                    console.error('Error fetching JSON:', error);
                });
        }

        if (!VENDOR_SCRIPTS_LOADED) {
            VENDOR_SCRIPTS_LOADED = true;

            if (this.vendorScripts.length) {
                this.vendorScripts.forEach(fileName => {
                    this._loadJsFile(`vendor/${fileName}`);
                });
            }
        }

        return this;
    };

    connectedCallback() {
        this.connected = true;
        const slotElements = this.querySelectorAll('[slot]');
        if (slotElements.length) {
            this.slots = [...slotElements];
            slotElements.forEach(slot => slot.remove());
        }

        if (this.scripts.length) {
            this.scripts.forEach(fileName => {
                this._loadJsFile(fileName);
            });
        } else {
            this.shouldRender();
        }
    };

    /**
     * @param {string} fileName
     */
    _loadJsFile(fileName) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `${this.staticUrl}Magento_Theme/js/external/${fileName}${this.minified}.js`;
        script.async = true;
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    this._scriptLoadedCallback(fileName);
                }
            }.bind(this);
        } else {
            script.onload = function() {
                this._scriptLoadedCallback(fileName);
            }.bind(this);
        }
        document.head.appendChild(script);
    };

    /**
     * @param {string} fileName
     */
    _scriptLoadedCallback(fileName) {
        const temp = this.scripts;
        this.scripts = temp.filter(name => name !== fileName);

        this.shouldRender();
    };

    getAttributes() {
        const obj = {};
        for (let i = 0; i < this.attributes.length; i++) {
            const attr = this.attributes[i];
            obj[this._toCamelCase(attr.name)] = attr.value;
        }
        return {
            ...obj,
            external: true,
            baseUrl: this.baseUrl,
            serverUrl: this.serverUrl,
            baseSlug: this.baseSlug,
        };
    };

    /**
     * @param {string} str
     * @return {string}
     * @private
     */
    _toCamelCase(str) {
        return str.replace(/[_-](.)/g, (_, char) => char.toUpperCase());
    };

    domLoadedCallback() {
        this.shouldRender();
    };

    shouldRender() {
        if (this.connected && EXTERNAL_DOM && this.scripts.length === 0 && !this.rendered) {
            this.rendered = true;
            this.render();
        }
    };

    render() {
    };

    replaceSlots() {
        const remainingSlots = [];
        this.slots.map((slot) => {
            const name = slot.getAttribute('slot');
            const container = this.querySelector(`[data-slot="${name}"]`);

            if (container) {
                container.innerHTML = slot.innerHTML;
            } else {
                remainingSlots.push(slot);
            }
        });
        this.slots = [...remainingSlots];
    };
}

class OmegaHeader extends OmegaExternal {
    constructor() {
        super();
        this.scripts = ['header-nav', 'header-menu'];
    };

    render() {
        const content = EXTERNAL_DOM?.html?.header || '';
        if (!content) {
            return;
        }

        this.innerHTML = content;
        this.replaceSlots();

        const header = this.querySelector('.ow-page-header');
        if (header) {
            new OwHeaderNav(header, this.getAttributes(), this.slots);
            new OwHeaderMenu(header, this.getAttributes(), this.slots);
        }
    };
}

class OmegaFooter extends OmegaExternal {
    constructor() {
        super();
        this.scripts = ['external-footer'];
    };

    render() {
        const content = EXTERNAL_DOM?.html?.footer || '';
        if (!content) {
            return;
        }

        this.classList.add('ow-footer');
        this.innerHTML = content;
        this.replaceSlots();

        const elem = this.querySelector('[data-role=footer-bottom]');
        if (elem) {
            new OwExternalFooter(elem, this.getAttributes(), this.slots);
        }
    };
}

class OmegaCookies extends OmegaExternal {
    constructor() {
        super();
        this.scripts = ['cookies'];
    };

    render() {
        const content = EXTERNAL_DOM?.html?.cookies || '';
        if (!content) {
            return;
        }

        this.innerHTML = content;
        this.replaceSlots();

        const elem = this.querySelector('[data-role="cookie-notice"]');
        if (elem) {
            new OwCookies(elem, this.getAttributes(), this.slots);
        }
    };
}

class OmegaLegal extends OmegaExternal {
    constructor() {
        super();
    };

    render() {
        const content = EXTERNAL_DOM?.html?.legal || '';
        if (!content) {
            return;
        }

        this.innerHTML = content;
        this.replaceSlots();

        const cookieLink = this.querySelector('#notice-cookie-link');
        const cookieBanner = document.querySelector('omega-cookies');
        if (cookieLink && cookieBanner) {
            cookieLink.style.removeProperty('display');
        }
    };
}

customElements.define('omega-header', OmegaHeader);
customElements.define('omega-footer', OmegaFooter);
customElements.define('omega-cookies', OmegaCookies);
customElements.define('omega-legal', OmegaLegal);
