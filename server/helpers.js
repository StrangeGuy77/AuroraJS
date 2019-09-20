const moment = require("moment");
const { DefaultLocale } = require("../keys");
const Handlebars = require("express-handlebars");

const reduceOp = function(args, reducer) {
  args = Array.from(args);
  args.pop(); // => options
  var first = args.shift();
  return args.reduce(reducer, first);
};

const helpers = {
  eq: function() {
    return reduceOp(arguments, (a, b) => a === b);
  },
  ne: function() {
    return reduceOp(arguments, (a, b) => a !== b);
  },
  lt: function() {
    return reduceOp(arguments, (a, b) => a < b);
  },
  gt: function() {
    return reduceOp(arguments, (a, b) => a > b);
  },
  lte: function() {
    return reduceOp(arguments, (a, b) => a <= b);
  },
  gte: function() {
    return reduceOp(arguments, (a, b) => a >= b);
  },
  and: function() {
    return reduceOp(arguments, (a, b) => a && b);
  },
  or: function() {
    return reduceOp(arguments, (a, b) => a || b);
  }
};

helpers.timeago = timestamp => {
  return moment(timestamp)
    .startOf("minute")
    .fromNow();
};

helpers.languageFinder = () => {
  return DefaultLocale.preferedUserLanguage;
};

module.exports = helpers;
