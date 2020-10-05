const RenderPage = require("../renderPage");

class NormalError extends Error {
  constructor(msg) {
    super();
    this.message = msg;
  }

  getStatus() {
    if (this instanceof BadRequest) {
      return 400;
    } else if (this instanceof NotFound) {
      return 404;
    } else {
      return 500;
    }
  }
}

class BadRequest extends NormalError {};
class NotFound extends NormalError {};

function handleErrors (err, req, res, next) {
  if (err instanceof NormalError) {
    const statusCode = err.getStatus();
    res.status(statusCode);

    return RenderPage(res, "404.html", {
      error: {
        message: err.message || "Page not found!"
      }
    });
  }

  if (!err) {
    res.status(404);
    return RenderPage(res, "404.html", {
      error: {
        message: "Page does not exist!"
      }
    });
  }

  res.status(500);
  return RenderPage(res, "404.html", {
    error: {
      message: err.message || "Internal Server Error!"
    }
  });
};

function handle404(req, res, next) {
  res.status(404);
  return RenderPage(res, "404.html", {
    error: {
      message: "Page does not exist!"
    }
  });
}

module.exports = {
  NormalError,
  BadRequest,
  NotFound,
  handleErrors,
  handle404
}