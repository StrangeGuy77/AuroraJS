const moment = require("moment");
const mongoose = require("mongoose");
const { DefaultLocale } = require("../keys");
const path = require("path");

const reduceOp = function(args, reducer) {
  args = Array.from(args);
  args.pop(); // => options
  const first = args.shift();
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

helpers.toUpperCase = string => {
  let str = string[0];
  if (str.length > 3) str = string[0];
  if (str.length <= 3) str = string;
  return str.toUpperCase();
};

helpers.gtz = string => {
  let str = string;
  if (str > 0) {
    return true;
  }
  return false;
};

module.exports = helpers;
