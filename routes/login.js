const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Pasien = require("../models/pasien");

router.post("/login", async (req, res) => {
  const { email_pasien, password } = req.body;
  try {
    const user = await Pasien.findOne({
      where: { email_pasien: email_pasien },
    });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Set status login di session
        req.session.isLoggedIn = true;
        req.session.userId = user.id_pasien;
        req.session.email_pasien = user.email_pasien;
        res.redirect("/index2");
      } else {
        const errorMessage = "Password Anda salah";
        res.redirect(`/login?errorMessage=${encodeURIComponent(errorMessage)}`);
      }
    } else {
      const errorMessage = "Email tidak ditemukan";
      res.redirect(`/login?errorMessage=${encodeURIComponent(errorMessage)}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan dalam proses login");
  }
});

module.exports = router;
