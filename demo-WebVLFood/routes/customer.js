var express = require('express');
var router = express.Router();
// middleware
var multer = require('multer');
var upload = multer({});
// daos
var ProductsDAO = require('../daos/ProductsDAO.js');
var OrderDAO = require('../daos/OrderDAO.js');
var CustomersDAO = require('../daos/CustomersDAO.js');
// routes
router.get('/', function (req, res) {
  res.redirect('/home');
});
router.get('/home', function (req, res) {
  res.render('customer/home.ejs');
});

router.get('/customer/viewProducts', async function (req, res) {
  var products = await ProductsDAO.getAll();
  res.render('customer/viewProducts.ejs', { products: products });
});
router.get('/detailProducts/:id', async function (req, res) {
  var id = req.params.id;
  var products = await ProductsDAO.getDetails(id);
  res.render('customer/detailProducts.ejs', { products: products });
});


router.get('/customer/addCustomers', function (req, res) {
  res.render('customer/addCustomers.ejs');
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
    var customers = { name: name, phone: phone, gmail: gmail };
    var result = await CustomersDAO.insert(customers);
    if (result) {
      res.send('OK BABY!');
    } else {
      res.send('SORRY BABY!');
    }
  }
});

router.get('/customer/viewTeams', function (req, res) {
  res.render('customer/viewTeams.ejs');
});


router.post('/add2cart', async function (req, res) {
  var id = req.body.txtID;
  var products = await ProductsDAO.getDetails(id);
  var quantity = parseInt(req.body.txtQuantity);
  // create empty mycart
  var mycart = [];
  // get mycart from session if exist
  if (req.session.mycart) {
    mycart = req.session.mycart;
  }
  // check exist product from mycart
  var index = mycart.findIndex(x => x.products._id == id);
  if (index == -1) {
    var newItem = { products: products, quantity: quantity };
    mycart.push(newItem);
  } else {
    mycart[index].quantity += quantity;
  }
  // put mycart back into the session
  req.session.mycart = mycart;
  // for DEBUG
  /*console.log('-------------');
  for (var item of req.session.mycart) {
    console.log(item.product.name + " | " + item.quantity);
  }*/
  res.redirect('/customer/viewProducts');
});
router.get('/mycart', function (req, res) {
  if (req.session.mycart && req.session.mycart.length > 0) {
    res.render('customer/mycart.ejs');
  } else {
    res.redirect('/customer/viewProducts');
  }
});
router.get('/remove2cart/:id', function (req, res) {
  var id = req.params.id;
  if (req.session.mycart) {
    var mycart = req.session.mycart;
    var index = mycart.findIndex(x => x.products._id == id);
    if (index != -1) { // found, remove item
      mycart.splice(index, 1);
      req.session.mycart = mycart;
    }
  }
  res.redirect('/mycart');
});
router.get('/checkout', function (req, res) {
  if (req.session.mycart && req.session.mycart.length > 0) {
    res.render('customer/checkout.ejs');
  } else {
    res.redirect('/customer/viewProducts');
  }
});
router.post('/checkout', async function (req, res) {
  var custName = req.body.txtCustName;
  var custPhone = req.body.txtCustPhone;
  var now = new Date().getTime(); // milliseconds
  var total = 0;
  for (var item of req.session.mycart) {
    total += item.products.price * item.quantity;
  }
  var order = { custName: custName, custPhone: custPhone, datetime: now, 
    items: req.session.mycart, total: total, status: 'PENDING'};
  var result = await OrderDAO.insert(order);
  if (result) {
    delete req.session.mycart;
    res.redirect('/customer/viewProducts');
  } else {
    res.redirect('/mycart');
  }
});
module.exports = router;