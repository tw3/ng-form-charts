class User {
  name: string;
  friends: string;
  age: number;
  weight: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
