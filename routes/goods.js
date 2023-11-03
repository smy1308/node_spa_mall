const express = require('express');
const router = express.Router();

const Goods = require('../schemas/goods.js');

//상품 조회 API
router.get('/goods', async (req,res) => {
  const temp = await Goods.find();
  res.status(200).json(temp);
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


router.post('/goods/', async (req,res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  //goodsId가 중복되는 값이 없는지 찾고 확인하는 작업
  const goods = await Goods.find({goodsId});

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