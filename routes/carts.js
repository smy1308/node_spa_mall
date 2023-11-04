const express = require("express");
const router = express.Router();

const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods.js");

// 장바구니 조회 API
router.get("/carts", async (req, res) => {
    //장바구니에 있는 모든 데이터 조회
  const carts = await Cart.find({});
    //carts에서 나온 배열데이터에서 goodsId만 반환
  const goodsIds = carts.map((cart) => cart.goodsId);
    //위 변수 goodsIds 에서 찾은 값과 carts에서의 goodsId가 일치하면 데이터를 가져오도록
  const goods = await Goods.find({ goodsId: goodsIds });
    //cart에서의 quantity와 위 goods에서 찾은 값을 합쳐 하나의 results 객체로 만들어준다
  const results = carts.map((cart) => {
    return {
      "quantity": cart.quantity,
      "goods": goods.find((item) => item.goodsId === cart.goodsId)
    };
  });

  res.json({
    "carts": results,
  });
});


module.exports = router;