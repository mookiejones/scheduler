/**
 * @class RowColorRule
 */
export default class RowColorRule {

    constructor(obj) {
        if (obj === undefined) {
            this.id = null;
            this.title = null;
            this.value = null;
            this.contains = true;
            this.element = null;
            this.color = '#FFF';
            return;
        }

        this.id = obj.id;
        this.title = obj.title;
        this.value = obj.value;
        this.contains = obj.contains === 1;
        this.color = obj.color;
        this.element = obj.element;
    }


}