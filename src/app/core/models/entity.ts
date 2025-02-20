export interface IEntity {
  id?: any;
}

export class BaseObject {
  asPlainObject(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
