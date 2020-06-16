const { Router } = require("express");
const router = Router();
const bcypt = require("bcryptjs");
const { check, validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../client/src/config/default");
// const User = require("../models/User");

router.post(
  "/registration",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длина пароля 1 символ").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Некорректные данные" });
      }
      const { name, surname, password, email } = req.body;

      const [
        candidate,
      ] = await router.conn.execute(
        "SELECT * FROM `users` WHERE `email` = ? ",
        [email]
      );

      if (candidate.length) {
        return res.status(400).json({
          message: "Пользователь с такой почтой уже зарегистрирован.",
        });
      }
      const hashedPassword = await bcypt.hash(password, 12);
      const newUser = await router.conn.query(
        `INSERT INTO users (name,surname,password, email, registration, last) VALUES ( '${name}', '${surname}', '${hashedPassword}', '${email}', NOW(), NOW() )`,
        function (error, result) {
          if (error) console.log(error);
          return res.status(201).json({ message: "Пользователь создан" });
        }
      );
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Что-то пошло не так. попробуйте снова", e });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при входе в систему",
        });
      }
      const { email, password } = req.body;
      const [
        user,
      ] = await router.conn.execute(
        "SELECT * FROM `users` WHERE `email` = ? ",
        [email]
      );
      console.log(user);
      if (user.length <= 0) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      const isMatch = await bcypt.compare(password, user[0].password);

      if (!isMatch) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const token = jwt.sign({ userId: user[0].id }, config.jwtSecret, {
        expiresIn: "1h",
      });

      await router.conn.query(
        `UPDATE users SET last = NOW() WHERE email = '${email}'`
      );

      return res.json({ token, userId: user[0].id });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Something went wrong, try again" });
    }
  }
);

module.exports = router;
