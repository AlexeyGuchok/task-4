const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    // const [users] = await router.conn.query(
    //   `SELECT id, name, surname, email, registration, last, status FROM users`,
    //   function (error, result) {
    //     if (error) console.log(error);
    //     return res.json({ users: result });
    //   }
    // );
    const result = await User.findAll({});
    return res.json({ users: result });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова" });
  }
});

router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  const idsString = id.reduce((acc, element, i) => {
    if (i < id.length - 1) return acc + element + ",";
    return acc + element;
  }, "");
  try {
    await User.destroy({
      where: {
        id: idsString,
      },
    });
    res.status(201).json({ message: "Пользователь Удален", id: id });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова" });
  }
});

router.put("/block", async (req, res) => {
  const { id, status } = req.body;
  const idsString = id.reduce((acc, element, i) => {
    if (i < id.length - 1) return acc + element + ",";
    return acc + element;
  }, "");

  try {
      // await router.conn.query(
      //   `UPDATE users SET status = ${status ? 1 : 0} WHERE id IN (${idsString})`,
      //   function (err, result) {
      //     if (err) {
      //       console.log(err);
      //       return res.status(500).json({ message: err });
      //     }
      //     if (result) {
      //       return res.status(201).json({
      //         message: `Пользовате(ль/ли) ${
      //           status ? "Блокирован(/ны)" : "Разблокирован(/ны)"
      //         }`,
      //         ids: id,
      //         status: status,
      //       });
      //     }
      //   }
      // );
    status = status ? 1 : 0;
    await User.update({
      status: status,
      where: {
        id: [idsString],
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова" });
  }
});

module.exports = router;
