import $ from 'jquery'

//支持采集的平台
const ruleInfo = {
  'aliexpress.com': "{\"detect\": \"if ((/\\\\/item\\\\/.+?\\\\/[\\\\d_]+\\\\.html/).test(url)) {\\n  return 'detail';\\n}\\nif ((/\\\\/item\\\\/[\\\\d_]+\\\\.html/).test(url)) {\\n  return 'detail';\\n}\\nif ((/\\\\/store\\\\/product\\\\/.+?\\\\/[\\\\d_]+\\\\.html/).test(url)) {\\n  return 'detail';\\n}\\nif (url.indexOf('/store/other-products/') !== -1 || url.indexOf('/store/group/') !== -1 || url.indexOf('/all-wholesale-products/') !== -1) {\\n  return 'category';\\n}\\nif ((/\\\\/category\\\\/\\\\d+/).test(url) || url.indexOf('wholesale') !== -1) {\\n  return 'sortlist';\\n}\\nif ((/store\\\\/\\\\d+\\\\/search/).test(url)) {\\n  return 'category';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('aliexpress.com/item/') !== -1 ||  url.indexOf('store/product') !== -1 || url.indexOf('aliexpress.com?spm') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"category\": \"category\"\n" +
      "}}",
  '1688.com': "{\"detect\":\"if ((/1688\\\\.com\\\\/offer\\\\/\\\\d+\\\\.html/).test(url)) {\\n  return 'detail';\\n}\\nif ((/\\\\/page\\\\/offerlist/).test(url)) {\\n  return 'category';\\n}\\nif(url.indexOf('selloffer/offer_search') !== -1 ){return 'sortlist';}\",\"detail\":\"if(url.indexOf('1688.com/offer') !== -1 || url.indexOf('1688.com/ci_bb') !== -1 || url.indexOf('1688.com/ci_king') !== -1 ){return true;}\",\"map\":{\"detail\":\"single\",\"category\":\"category\"}}",
  'alibaba.com': "{\n" +
      "\"detect\": \"if (url.indexOf('product-detail') !== -1) {\\n  return 'detail';\\n}\\nif (url.indexOf('/product/') !== -1) {\\n  return 'detail';\\n}\\nif (url.indexOf('/products/') !== -1) {\\n  //unsupported, lazyload\\n  return 'search';\\n}if (url.indexOf('/product/') !== -1) {\\n  return 'detail';\\n}\\nif (url.indexOf('decals.en.alibaba.com/productgrouplist') !== -1) { \\n  return 'category';\\n}\",\n" +
      "\"detail\": \" if(url.indexOf('alibaba.com/product-detail') !== -1 || url.indexOf('/product/') !== -1){return true;};\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopdetail\": \"single\",\n" +
      "\"shopcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'amazon': "{\n" +
      "\"detect\": \"if (url.indexOf('/dp/') !== -1 && url.indexOf('www.amazon.com.au') == -1 ) {\\n  return 'detail';\\n}\\nif (url.indexOf('/gp/product/') !== -1) {\\n  return 'detail';\\n}\\nif(url.indexOf('amazon.com/s?marketplaceID') != -1){return 'category';}\\nif(url.indexOf('s?k=') != -1){return 'sortlist';}\",\n" +
      "\"detail\": \"if (url.indexOf('/dp/') !== -1 && url.indexOf('www.amazon.com.au') == -1 ) {\\n  return true;\\n}\\nif (url.indexOf('amazon.com/gp/product/') !== -1 || url.indexOf('/gp/slredirect/picassoRedirect.html/') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\"\n" +
      "}\n" +
      "}",
  'taobao.com': "{\n" +
      "\"detect\": \"\\n\if (url.indexOf('taobao.com/list') !== -1 || url.indexOf('//s.taobao.com/search') !== -1) {\\n    return 'sortlist';\\n}\\n\\nif (url.indexOf('item.taobao.com/item.htm') !== -1) {\\n   return 'detail';\\n}\\n\\nif (url.indexOf('taobao.com/category') !== -1 || url.indexOf('taobao.com/search.htm?spm') !== -1) {\\n    return 'category';\\n}\\n\",\n" +
      "\"detail\": \"if (url.indexOf('item.taobao.com/item.htm') !== -1 || url.indexOf('srd.simba.taobao.com/rd')  !== -1) {\\n    return true;\\n}  if (url.indexOf('click.mz.simba.taobao.com/necpm') !== -1)  {\\n      return true;\\n  } if(url.indexOf('tmall.com/item.htm') !== -1){return true;}if(url.indexOf('click.simba.taobao.com/cc_im') !== -1){return true;}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"category\": \"category\"\n" +
      "}\n" +
      "}",
  'youhui.pinduoduo.com': "{\n" +
      "\"detect\": \"\\n\if (url.indexOf('youhui.pinduoduo.com/search/landing') !== -1) {\\n  return 'sortlist';\\n}\\n\\nif (url.indexOf('youhui.pinduoduo.com/goods/goods-detail?goodsId') !== -1) {\\n   return 'detail';\\n}\\n\",\n" +
      "\"detail\": \"if (url.indexOf('youhui.pinduoduo.com/goods/goods-detail?goodsId') !== -1 ) {\\n    return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"category\": \"category\"\n" +
      "}\n" +
      "}",
  'ebay': "{\n" +
      "\"detect\": \"if ((/\\\\/itm(\\\\/.*)?\\\\/\\\\d+/).test(url)) {\\n  return 'detail';\\n}\\nif (url.indexOf('stores.ebay') !== -1) {\\n  return 'category';\\n}\",\n" +
      "\"detail\": \"return (/\\\\/itm(\\\\/.*)?\\\\/\\\\d+/).test(url); \",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"storecategory\": \"category\"\n" +
      "}\n" +
      "}",
  'tmall.com': "{\n" +
      "\"detect\": \"if (url.indexOf('tmall.com/search_product') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('item.htm') !== -1 || url.indexOf('tmall.hk/hk/item') !== -1) {\\n  return 'detail';\\n}\\nif (url.indexOf('tmall.com/category') !== -1 || url.indexOf('tmall.com/search.htm') !== -1 ) {\\n  return 'category';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('tmall.hk/item') !== -1) {\\n  return true;\\n}\\n if (url.indexOf('item.taobao.com/item.htm') !== -1 || url.indexOf('srd.simba.taobao.com/rd')  !== -1) {\\n  return true;\\n}\\n if (url.indexOf('tmall.com/item.htm') !== -1) {\\n  return true;\\n}\\n if (url.indexOf('click.simba.taobao.com/cc_im') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'wish.com': "{\n" +
      "\"detect\": \"if (url.indexOf('wish.com/#category_id') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('wish.com/#cid=') !== -1  ||  url.indexOf('www.wish.com/product/') !=-1) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('wish.com/c') !== -1 || url.indexOf('www.wish.com/product/') != -1 ) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'joom.com': "{\n" +
      "\"detect\": \"if (url.indexOf('www.joom.com/en/search/c.') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('/en/products/') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('/en/products/') !== -1 ) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'jd.com': "{\n" +
      "\"detect\": \"if (url.indexOf('jd.com/Search') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('item.jd.com') !== -1 ) {\\n  return 'detail';\\n}\\nif (url.indexOf('.jd.com/view_search') !== -1 ) {\\n  return 'category';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('jd.com/dsp/nc') !== -1 || url.indexOf('item.jd.com') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'dhgate.com': "{\n" +
      "\"detect\": \"if (url.indexOf('dhgate.com/wholesale') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('dhgate.com/product') !== -1 || url.indexOf('dhgate.com/store/product') !== -1) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('dhgate.com/product') !== -1 || url.indexOf('dhgate.com/store/product') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'etsy.com': "{\n" +
      "\"detect\": \"\\nif (url.indexOf('etsy.com/listing') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('etsy.com/listing') !== -1 ) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'banggood.com': "{\n" +
      "\"detect\": \"\\nif (url.indexOf('rmmds=category') !== -1 || url.indexOf('rmmds=search') != -1 || url.indexOf('rmmds=home') != -1 || url.indexOf('rmmds=collection') {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('rmmds') !== -1 ) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'gearbest.com': "{\n" +
      "\"detect\": \"\\nif (url.indexOf('gearbest.com') !== -1 && url.indexOf('pp_') != -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('gearbest.com') !== -1 && url.indexOf('pp_') != -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'chinabrands.com': "{\n" +
      "\"detect\": \"\\nif (url.indexOf('chinabrands.com/item/dropship') !== -1 || url.indexOf('wid=') !== -1) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('chinabrands.com/item/dropship') !== -1 || url.indexOf('wid=') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'chinabrands.cn': "{\n" +
      "\"detect\": \"\\nif (url.indexOf('chinabrands.cn/item/dropship') !== -1 || url.indexOf('wid=') !== -1) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('chinabrands.cn/item/') !== -1 || url.indexOf('wid=') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'yixuanpin.cn': "{\n" +
      "\"detect\": \"\\nif (url.indexOf('app2/goodsDetail?goodsId') !== -1) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('app2/goodsDetail?goodsId') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",
  'www.haiyingshuju.com': "{\n" +
      "\"detect\": \"\\nif (url.indexOf('www.haiyingshuju.com/wish/index.html#/detail/') !== -1) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.includes('www.haiyingshuju.com/wish/index.html#/detail/')) {return true;}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "},\n" +
      "\"selectors\":[{\"css\":\"#table1 img\",\"fn\":\"var ids = $hy.parent().next().html().match(/wishID:(\\\\w+)/);↵if (ids) {↵  return 'http://www.haiyingshuju.com/wish/detail.html?pid=' + ids[1];↵}\"}]\n" +
      "}",
  'tophatter.com': "{\n" +
      "\"detect\": \"if (url.indexOf('tophatter.com/catalogs/category/') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('tophatter.com/lots/') !== -1 || url.indexOf('tophatter.com/catalogs/category/') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('tophatter.com/lots/') !== -1 url.indexOf('tophatter.com/catalogs/category/') !== -1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",

  'shopee.': "{\n" +
      "\"detect\": \"if (url.indexOf('/search?keyword') !== -1 || url.indexOf('-cat.') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('/shop/') !== -1 && url.indexOf('followers?other=true') === -1 && url.indexOf('/following?_') === -1 ) {\\n  return 'category';\\n}\\nif (url.indexOf('-i.') !== -1 || url.indexOf('/product/') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('-i.')!==-1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",

  'tw.shopeesz.com': "{\n" +
      "\"detect\": \"if (url.indexOf('/search/?') !== -1 || url.indexOf('-cat.') !== -1 || url.indexOf('-col.') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('-i.') !== -1 || url.indexOf('/product/') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('-i.')!==-1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",

  'xiapibuy.com': "{\n" +
      "\"detect\": \"if (url.indexOf('/search?') !== -1 || url.indexOf('-cat.') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('/shop/') !== -1 && url.indexOf('/followers?other=true') === -1 && url.indexOf('/following?_') === -1 ) {\\n  return 'category';\\n}\\nif (url.indexOf('-i.') !== -1 || url.indexOf('/product/') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('-i.')!==-1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",

  'lazada.': "{\n" +
      "\"detect\": \"if (url.indexOf('/catalog/?') !== -1 || url.indexOf('.cate_') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('All-Products') !== -1 ) {\\n  return 'category';\\n}\\nif (url.indexOf('/products/') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('/products')!==-1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",

  'yangkeduo.com': "{\n" +
      "\"detect\": \"if ((url.indexOf('search_result') !== -1 || url.indexOf('search_catgoods') !== -1) && url.indexOf('/goods.html?') === -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('/goods.html?') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('yangkeduo.com')!==-1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",

      'lightinthebox.com': "{\n" +
      "\"detect\": \"if (url.indexOf('search_in_description') !== -1 || url.indexOf('/c/') !== -1 || url.indexOf('/promotions/') !== -1) {\\n  return 'sortlist';\\n}\\nif (url.indexOf('/en/p/') !== -1 ) {\\n  return 'detail';\\n}\",\n" +
      "\"detail\": \"if (url.indexOf('/en/p/')!==-1) {\\n  return true;\\n}\",\n" +
      "\"map\": {\n" +
      "\"detail\": \"single\",\n" +
      "\"shopcategory\": \"category\",\n" +
      "\"globalcategory\": \"category\"\n" +
      "}\n" +
      "}",



}

export const getRule = (url) => {
  if (!url) {
    return 'Invalid url...'
  }
  //天猫处理
  if (url.indexOf('tmall.hk') !== -1) {
    url = url.replace('tmall.hk', 'tmall.com')
  }
  var rule = ''
  $.each(ruleInfo, function(key, value) {
    if (url.indexOf(key) != -1) {
      rule = value
      return
    }
  })

  if (!rule) {
    return 'The platform does not support the collection, we will deal with as soon as possible'
  }
  return rule
}
