/**
 * @description Color Rule
 */
export default class ColorRule {
  constructor(id, element = 'id', name, value, color, contains) {
    this._id = id;
    this._element = element;

    this.Name = name;
    this.Value = value;
    this.Color = color;
    this.Contains = contains;
  }

  IsValid(value) {
    const expression = value[this.Element];

    if (this.Contains === null) {
      return this.Name === 'bgSuccess'
        ? value.id.substring(0, 4) === this.Value
        : value.id.substring(0, 4) !== this.Value;
    }
    if (this.Contains === true) {
      const rrr = new RegExp(this.Value, 'i').test(expression);
      return rrr;
    }
    return false;
  }

  Evaluate(value) {
    switch (this.Name) {
      case 'bgSuccess':
        return value.id.substring(0, 4) === this.Value;
      case 'bgNormal':
        return value.id.substring(0, 4) !== this.Value;

        break;
      default:
        debugger;
        break;
    }
    debugger;
  }

  /**
   * Element to evaluate against
   */
  get Element() {
    return this._element;
  }

  set Element(value) {
    this._element = value;
  }

  /**
   * Name for class
   */
  get Name() {
    return this._name;
  }

  /** Value to Evaluate agains */
  get Value() {
    return this._value;
  }

  set Value(value) {
    this._value = value;
  }

  set Name(value) {
    if (/-/.test(value)) throw new Error('Value must not contain any hyphens');

    this._name = value;
  }

  /** Color */
  get Color() {
    return this._color;
  }

  set Color(value) {
    this._color = value;
  }

  asClass() {
    return { backgroundColor: this.Color };
  }

  evaluate(row) {
    const result = this.Contains
      ? new RegExp(this.Value, 'i').test(row[this.Element])
      : row[this.Element] === this.Value;

    if (result) {
      return { backgroundColor: this.Color };
    }
    return null;
  }

  /** Contains
   * @description true if value is expected to contain value, if false, then value is expected to be equal
   */
  get Contains() {
    return this._contains;
  }

  set Contains(value) {
    this._contains = value;
  }

  get Id() {
    return this._id;
  }
}
