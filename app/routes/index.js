var express = require("express");
var router = express.Router();

const mysql2 = require("mysql2");
const mysql = mysql2.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "db_nodepos",
});

/* GET home page. */
router.get("/", function (req, res, next) {
        res.render("index", { title: "Express" });
});

router.get("/product", (req, res) => {
        // res.render('product');
        mysql.query("SELECT * FROM tb_product", (err, rs) => {
                if (err) {
                        res.send(err);
                } else {
                        res.render("product", { products: rs });
                }
        });
});

router.get("/productForm", (req, res) => {
        res.render("productForm", { data: {} });
});

router.post("/productForm", (req, res) => {
        let sql = "INSERT INTO tb_product SET ?";
        let data = req.body;

        mysql.query(sql, data, (err, rs) => {
                if (err) {
                        res.send(err);
                } else {
                        res.redirect("product");
                }
        });
});

router.get("/productEdit/:id", (req, res) => {
        let sql = "SELECT * FROM tb_product WHERE id = ?";
        let params = [req.params.id];
        mysql.query(sql, params, (err, rs) => {
                if (err) {
                        res.send(err);
                } else {
                        res.render("productForm", { data: rs[0] });
                }
        });
});

router.post("/productEdit/:id", (req, res) => {
        let sql =
                "UPDATE tb_product SET barcode = ?, name = ? , price = ? , cost = ? WHERE id = ?";
        let data = req.body;
        let params = [
                data.barcode,
                data.name,
                data.price,
                data.cost,
                req.params.id,
        ];

        mysql.query(sql, params, (err, rs) => {
                if (err) {
                        res.send(err);
                } else {
                        res.redirect("/product");
                }
        });
});

router.get("/productDelete/:id", (req, res) => {
        let sql = "DELETE FROM tb_product WHERE id = ?";
        let params = [req.params.id];
        mysql.query(sql, params, (err, rs) => {
                if (err) {
                        res.send(err);
                } else {
                        res.redirect("/product");
                }
        });
});

router.get("/sale", (req, res) => {
        res.render("sale", { product: {} });
});

router.post("/sale", (req, res) => {
        if (req.body.barcode != null) {
                let params = [req.body.barcode];
                let sql = "SELECT * FROM tb_product WHERE barcode = ?";

                mysql.query(sql, params, (err, rs) => {
                        if (err) {
                                res.send(err);
                        } else {
                                let product = {};
                                if (rs.length > 0) {
                                        product = rs[0];
                                }

                                //save to bill salse

                                res.render("sale", { product: product });
                        }
                });
        } else {
                res.render("sale", { product: {} });
        }
});

module.exports = router;
