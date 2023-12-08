"use strict";

const apickliModule = require("apickli");
const { Before, setDefaultTimeout } = require("@cucumber/cucumber");

setDefaultTimeout(5 * 1000); // this is in ms

Before(function () {
  const host = "localhost:3000";
  const basePath = "";
  const baseUri = `${host}${basePath}`;
  console.log(`Test Base URI: ${baseUri}`);
  this.apickli = new apickliModule.Apickli("http", baseUri);
  this.apickli.addRequestHeader("Cache-Control", "no-cache");
});