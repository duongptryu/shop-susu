const express = require("express");
const app = express();
const session = require('express-session');
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://duongpt:201085@cluster0-ppw04.mongodb.net/test";

exports.getHomePage = (req, res) => {
  res.render("home", { img: true, nav: true, name: "/home" });
};

exports.getDisplayPage = (req, res) => {
  if (req.originalUrl === "/import") {
    getDisplayPage(
      req,
      res,
      "SusuManager",
      "product",
      true,
      true,
      "/import/display"
    );
  }
  if (req.originalUrl === "/export") {
    getDisplayPage(
      req,
      res,
      "SusuManager",
      "exportProduct",
      true,
      false,
      "/export/display"
    );
  }
};

exports.getAddProductPage = (req, res) => {
  if (req.originalUrl === "/import/add-product") {
    res.render("add", { addProduct: true, nav: true, routerImport: true });
  }
  if (req.originalUrl === "/export/add-product") {
    res.render("add", { addProduct: true, nav: true, routerExport: true });
  }
};

exports.addProductImport = async (req, res) => {
  let newProduct = getDateAddProduct(req);
  let client = await MongoClient.connect(url);
  let dbo = client.db("SusuManager");
  await dbo.collection("product").insertOne(newProduct);
  res.redirect("/import");
};

exports.addProductExport = async (req, res) => {
  let newProduct = getDateAddProduct(req);
  let client = await MongoClient.connect(url);
  let dbo = client.db("SusuManager");
  await dbo.collection("exportProduct").insertOne(newProduct);
  res.redirect("/export");
};

exports.getDataByDate = (req, res) => {
  const date = req.query.date;
  const path = req.query.path;
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db("SusuManager");
    let table = "";
    if (path === "/import") {
      table = "product";
    } else {
      table = "exportProduct";
    }
    var query = { date: date };
    dbo
      .collection(table)
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        let bill = 0;
        let totalPaid = 0;
        let totalUnpaid = 0;
        result.forEach((data) => {
          bill++;
          if (data.paid === "yes") {
            totalPaid += data.total;
          } else {
            totalUnpaid += data.total;
          }
        });
        let totalMoney = totalPaid + totalUnpaid;
        res.json({
          result: result,
          bill: bill,
          totalMoney: totalMoney,
          totalPaid: totalPaid,
          totalUnpaid: totalUnpaid,
        });
        db.close();
      });
  });
};

exports.getUpdatePage = (req, res) => {
  let table = "";
  let name = "";
  const id = req.params.id;
  let routerExport = false;
  let routerImport = false;
  if (req.originalUrl.includes("/import")) {
    table = "product";
    name = "/import/update/" + id;
    routerImport = true;
  }
  if (req.originalUrl.includes("/export")) {
    table = "exportProduct";
    name = "/export/update/" + id;
    routerExport = true;
  }

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbo = db.db("SusuManager");
    const ObjectID = require("mongodb").ObjectID;
    const query = { _id: ObjectID(id) };
    dbo
      .collection(table)
      .find(query)
      .toArray((err, result) => {
        if (err) throw err;
        res.render("update", {
          routerExport: routerExport,
          routerImport: routerImport,
          name: name,
          data: result,
          nav: true,
        });
        db.close();
      });
  });
};

exports.updateDataImport = async (req, res) => {
  const id = req.body.idCustomer;
  const newInfo = getDataUpdate(req);
  await MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("SusuManager");
    const mongodb = require("mongodb");
    var query = { _id: new mongodb.ObjectID(id) };
    await dbo
      .collection("product")
      .updateOne(query, newInfo, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
  });
  res.redirect("/import");
};

exports.updateDataExport = async (req, res) => {
  const id = req.body.idCustomer;
  const newInfo = getDataUpdate(req);
  await MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("SusuManager");
    const mongodb = require("mongodb");
    var query = { _id: new mongodb.ObjectID(id) };
    await dbo
      .collection("exportProduct")
      .updateOne(query, newInfo, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
  });
  res.redirect("/export");
};

exports.deleteData = (req, res) => {
  let table = "";
  if (req.originalUrl.includes("/import")) {
    table = "product";
  }
  if (req.originalUrl.includes("/export")) {
    table = "exportProduct";
  }
  const id = req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("SusuManager");
    const mongodb = require("mongodb");
    var myquery = { _id: mongodb.ObjectID(id) };
    dbo.collection(table).deleteOne(myquery, function (err, obj) {
      if (err) {
        res.json({ check: false });
        throw err;
      }
      console.log("1 document deleted");
      res.json({ check: true });
    });
  });
};

function getDisplayPage(
  req,
  res,
  database,
  table,
  routerExport,
  routerImport,
  name
) {
  var utc = new Date().toJSON().slice(0, 10);
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db(database);
    var query = { date: utc };
    dbo
      .collection(table)
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        let bill = 0;
        let totalPaid = 0;
        let totalUnpaid = 0;
        result.forEach((data) => {
          bill ++;
          if (data.paid === "yes") {
            totalPaid += data.total;
          } else {
            totalUnpaid += data.total;
          }
        });
        let totalMoney = totalPaid + totalUnpaid;
        res.render("display", {
          displayCSS: true,
          routeExport: routerExport,
          routerImport: routerImport,
          name: name,
          nav: true,
          product: result,
          check: result.length < 1,
          bill: bill,
          totalPaid: totalPaid,
          totalUnpaid: totalUnpaid,
          totalMoney: totalMoney,
        });
        db.close();
      });
  });
}

function getDataUpdate(req) {
  const name = req.body.name;
  const tel = req.body.phone;
  const address = req.body.address;
  const price = req.body.price;
  const amount = req.body.amount;
  const paid = req.body.paid;
  const date = req.body.date;
  const total = price * amount;
  var newInfo = {
    $set: {
      name: name,
      address: address,
      phone: tel,
      price: price,
      amount: amount,
      total: total,
      paid: paid,
      date: date,
    },
  };
  return newInfo;
}

function getDateAddProduct(req) {
  const name = req.body.name;
  const tel = req.body.phone;
  const address = req.body.address;
  const price = req.body.price;
  const amount = req.body.amount;
  const paid = req.body.paid;
  const date = req.body.date;
  const total = price * amount;
  let newProduct = {
    name: name,
    address: address,
    phone: tel,
    price: price,
    amount: amount,
    total: total,
    paid: paid,
    date: date,
  };
  return newProduct;
}

