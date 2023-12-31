const express = require('express');
const router = express.Router();

// /routes/goods.js
const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

//상품 조회 API
router.get('/goods', (req,res) => {
  res.status(200).json({goods});
})

//상품 상세 조회 API
router.get('/goods/:goodsId', (req, res) => {
	const { goodsId } = req.params;
  for(const good of goods) {
    if ( Number(goodsId) === good.goodsId ) {
      result = good;
    }
  }

  //위와 동일하게 작동하는 코드
  // const [result] = goods.filter((good) => {    
  //   Number(goodsId) === good.goodsId 
  // })
	
	res.json({ detail: result });
});

//장바구니 추가 API
const Cart = require("../schemas/cart");
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  //Cart에 중복된 goods가 존재하는지 확인
  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 장바구니에 존재하는 상품입니다." });
  }

  //중복된 goods가 없다면 Cart에 goods를 추가
  await Cart.create({ goodsId: Number(goodsId), quantity: quantity });

  res.json({ result: "success" });
});

//장바구니 상품 수량 수정 API
router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  //Cart에 존재하는 goods면 수량을 수정하도록
  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    await Cart.updateOne({ goodsId: Number(goodsId) },
    { $set: { quantity } });
  }

  res.status(200).json({ success: true });
})

//장바구니 상품 제거 API
router.delete("/goods/:goodsId/cart", async (req, res) => {
  //제거하는 기능임으로 수량은 필요가 없음
  const { goodsId } = req.params;

  //Cart에 존재하는 goods면 제거하도록
  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length > 0) {
    await Cart.deleteOne({ goodsId });
  }

  res.json({ result: "success" });
});

//상품 추가 API
const Goods = require('../schemas/goods.js');
router.post('/goods/', async (req,res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  //goodsId가 중복되는 값이 없는지 찾고 확인하는 작업
  const goods = await Goods.find({ goodsId });

  if ( goods.length ) {
    return res.status(400).json({ 
      success: false,
      errorMsg: "이미 존재하는 GoodsId입니다."
    });
  }

  //db에 접근해서 생성해야 함으로 await 처리
  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });
  res.json({ createdGoods });
})

module.exports = router;