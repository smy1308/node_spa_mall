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
    if ( Number(goodsId) === good.goodsId) {
      result = good;
    }
  }

  //위와 동일하게 작동하는 코드
  // const [result] = goods.filter((good) => {    
  //   Number(goodsId) === good.goodsId 
  // })
	
	res.json({ detail: result });
});

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