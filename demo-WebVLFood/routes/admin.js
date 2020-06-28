var express = require('express');
var router = express.Router();
// middleware
var multer = require('multer');
var upload = multer({});
// daos
var ProductsDAO = require('../daos/ProductsDAO.js');
var AdminDAO = require('../daos/AdminDAO.js');
var OrderDAO = require('../daos/OrderDAO.js');
var CustomersDAO = require('../daos/CustomersDAO.js');
// routes
router.get('/', function (req, res) {
  res.redirect('/admin/login');
});

router.get('/login', function (req, res) {
  res.render('admin/login.ejs');
});

router.post('/login', async function (req, res) {
  var username = req.body.txtUsername;
  var password = req.body.txtPassword;
  var admin = await AdminDAO.get(username, password);
  if (admin) {
    req.session.admin = admin;
    res.redirect('/admin/home');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/home', function (req, res) {
  if (req.session.admin) {
    res.render('admin/home.ejs');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/viewCustomers', async function (req, res) {
  var customers = await CustomersDAO.getAll();
  res.render('admin/viewCustomers.ejs', { customers: customers });
});

router.get('/addCustomers', function (req, res) {
  res.render('admin/addCustomers.ejs');
});

router.post('/addCustomers', upload.single('fileImage'), async function (req, res) {
  var name = req.body.txtName;
  var phone = parseInt(req.body.txtPhone);
  var gmail = req.body.txtGmail;

  if (req.file) {
    var image = req.file.buffer.toString('base64');
    var customers = { name: name, phone: phone, gmail: gmail, image: image };
    var result = await CustomersDAO.insert(customers);
    if (result) {
      res.send('OK BABY!');
    } else {
      res.send('SORRY BABY!');
    }
  } else {
    var customers = { name: name, phone: phone, gmail: gmail, image: image };
    var result = await CustomersDAO.insert(customers);
    if (result) {
      res.send('OK BABY!');
    } else {
      res.send('SORRY BABY!');
    }
  }
});

router.get('/addProducts', function (req, res) {
  res.render('admin/addProducts.ejs');
});

router.post('/addProducts', upload.single('fileImage'), async function (req, res) {
  var name = req.body.txtName;
  var phone = parseInt(req.body.txtPhone);
  var description = req.body.txtDescription;
  var slot = parseInt(req.body.txtSlot);

  if (req.file) {
    var image = req.file.buffer.toString('base64');
    var products = { name: name, phone: phone, description: description, slot: slot, image: image};
    var result = await ProductsDAO.insert(products);
    if (result) {
      res.send('OK BABY!');
    } else {
      res.send('SORRY BABY!');
    }
  } else {
    var products = { name: name, phone: phone, description: description, slot: slot, image: image};
    var result = await ProductsDAO.insert(products);
    if (result) {
      res.send('OK BABY!');
    } else {
      res.send('SORRY BABY!');
    }
  }
});

router.get('/listorders', async function (req, res) {
  var orders = await OrderDAO.getAll();
  var id = req.query.id; // /listorders?id=XXX
  var order = await OrderDAO.getDetails(id);
  res.render('admin/listorders.ejs', { orders: orders, order: order });
});

router.get('/updatestatus', async function (req, res) {
  var id = req.query.id;
  var status = req.query.status;
  var result = await OrderDAO.update(id, status);
  res.redirect('/admin/listorders');
});

module.exports = router;