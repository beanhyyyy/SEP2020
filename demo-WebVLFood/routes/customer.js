var express = require('express');
var router = express.Router();
// middleware
var multer = require('multer');
var upload = multer({});
// daos
var CustomersDAO = require('../daos/CustomersDAO.js');
// routes
// router.get('/', function (req, res) {
//   res.redirect('/admin/login');
// });

// router.get('/login', function (req, res) {
//   res.render('admin/login.ejs');
// });

router.get('/', function (req, res) {
  res.redirect('/home');
});

router.get('/home', function (req, res) {
  res.render('customer/home.ejs');
});

router.get('/customer/addCustomers', function (req, res) {
  res.render('customer/addCustomers.ejs');
});

router.post('/customer/addCustomers', upload.single('fileImage'), async function (req, res) {
  var name = req.body.txtName;
  var phone = parseInt(req.body.txtPhone);
  var gmail = req.body.txtGmail;

  if (req.file) {
    var image = req.file.buffer.toString('base64');
    var customers = { name: name, phone: phone, gmail: gmail, image: image };
    var result = await CustomersDAO.insert(customers);
    if (result) {
      res.send('SUCCESSFULL');
    } else {
      res.send('FAIL');
    }
  } else {
    var customers = { name: name, phone: phone, gmail: gmail, image: image };
    var result = await CustomersDAO.insert(customers);
    if (result) {
      res.send('SUCCESSFULL');
    } else {
      res.send('FAIL');
    }
  }
});

router.get('/customer/viewTeams', function (req, res) {
  res.render('customer/viewTeams.ejs');
});


module.exports = router;