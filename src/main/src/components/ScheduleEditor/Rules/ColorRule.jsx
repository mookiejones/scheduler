/**
 * @description Color Rule
 */
export default class ColorRule {
  constructor(id, element = 'id', name, value, color, contains) {
    this.id = id;
    this.Element = element;

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
    return this.element;
  }

  set Element(value) {
    this.element = value;
  }

  /**
   * Name for class
   */
  get Name() {
    return this.name;
  }

  /** Value to Evaluate agains */
  get Value() {
    return this.value;
  }

  set Value(value) {
    this.value = value;
  }

  set Name(value) {
    if (/-/.test(value)) throw new Error('Value must not contain any hyphens');

    this.name = value;
  }

  /** Color */
  get Color() {
    return this.color;
  }

  set Color(value) {
    this.color = value;
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
    return this.contains;
  }

  set Contains(value) {
    this.contains = value;
  }

  get Id() {
    return this.id;
  }
}
