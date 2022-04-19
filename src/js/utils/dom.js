
export class ShowHideElement {
    constructor(e, display_type = 'block') {
        this.e = e;
        this.display_type = display_type;
    }

    show = () => this.e.forEach(e => e.style.display = this.display_type);
    hide = () => this.e.forEach(e => e.style.display = 'none');
}
