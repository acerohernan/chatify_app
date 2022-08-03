class HttpError {
  constructor(response, code, message) {
    this.response = response;
    this.code = code;
    this.message = message;
  }

  send() {
    return this.response.status(this.code).json({
      message: this.message,
      success: false,
    });
  }
}

module.exports = HttpError;
