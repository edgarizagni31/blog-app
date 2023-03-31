class APIError {
  private type: string = '';
  private detail: string = '';
  private title: string;
  private instance: string;

  constructor(title: string, instance: string) {
    this.title = title;
    this.instance = instance;
  }

  public set setType(type: string) {
    this.type = type;
  }

  public set setDetail(detail: string) {
    this.detail = detail;
  }

  public getValue() {
    return {
      type: !!this.type ? this.type : 'Internal Server Error',
      title: this.title,
      detail: this.detail,
      instance: this.instance,
    };
  }
}

export default APIError;
