class Enum {
  constructor(map) {
    this.map = map;
  }

  getOptions() {
    let options = [];
    for (let key in this.map) {
      options.push({ key: key, value: this.map[key] });
    }
    return options;
  }

  getValue(key) {
    return this.map[key];
  }
}

const CourseType = new Enum({
  1: '一对一',
  2: '大班课',
  3: '小班课',
  4: '公开课',
  5: '点播课',
  7: '面授课',
  8: '音频课',
  9: '系统课',
  10: '图文课',
  11: '会员课'
});

const ShopType = new Enum({
  1: '一对一',
  2: '大班课',
  3: '小班课',
  4: '公开课',
  5: '视频课',
  7: '面授课',
  8: '音频课',
  9: '系统课',
  10: '图文课',
  11: '充值余额',
  12: '图书',
  13: '文库',
  14: '会员'
});

const LiveStatus = new Enum({
  0: '未开始',
  1: '直播中',
  2: '已结束'
});

const SexType = new Enum({
  0: '男',
  1: '女',
  3: '保密'
});

const OrderStatus = new Enum({
  1: '待支付',
  2: '交易完成',
  3: '交易关闭'
});

const PayStatus = new Enum({
  1: '待支付',
  2: '已支付',
  3: '退款申请中',
  4: '退款中',
  5: '退款成功',
  6: '退款失败'
});

const PayType = new Enum({
  1: '微信',
  2: '支付宝',
  3: '虚拟币支付',
  4: '苹果支付',
  5: '兑换',
  6: '赠送',
  7: '优惠券支付',
  8: '线下支付'
});

const ScopeType = new Enum({
  1: '全部课程可用',
  2: '指定分类可用',
  3: '指定课程可用'
});

const PlayType = new Enum({
  1: '未开始',
  2: '开课中',
  3: '暂无回放',
  4: '回放'
});

const OrderType = new Enum({
  1: '约课订单',
  2: '课程订单',
  3: '会员订单'
});

const QuesType = new Enum({
  1: '单选',
  2: '多选',
  3: '判断',
  4: '连线',
});

const CorrectType = new Enum({
  1: '错别字',
  2: '答案解析不匹配',
  3: '解析错误',
  4: '其他',
});

export {
  CourseType,
  ShopType,
  LiveStatus,
  SexType,
  OrderStatus,
  PayStatus,
  PayType,
  ScopeType,
  PlayType,
  OrderType,
  QuesType,
  CorrectType,
};
