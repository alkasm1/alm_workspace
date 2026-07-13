export class ALMError extends Error {
  constructor(
    code = "ALM_ERROR",
    message = "ALM Error",
    details = null
  ) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.details = details;

    Error.captureStackTrace?.(
      this,
      this.constructor
    );
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}
