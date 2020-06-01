const Mock = require('mockjs');

const baseData = require('./baseData');

const BaseInfoData = Mock.mock({
  // id
  // 图片描述
  // 图片地址
  // 图片权重
  // 点击图片跳转路由
  // 是否禁用
  // 更新时间
  // 创建时间
  // 状态  0未处理 已经处理
  'list|10': [{
    id: '@id',
    imgDesc: '@cname',
    imgUrl: '@url',
    order: '@number',
    routerUrl: '@url',
    is_disable: '@boolean',
    updated_time: '@datetime',
    createTime: '@datetime',
  }],
});

let database = BaseInfoData.list;

module.exports = {
  bannerList(req, res) {
    let {
      pageSize,
      pageNum,
      ...other
    } = req.body;
    pageSize = pageSize || 10;
    pageNum = pageNum || 1;
    other = {
      ...other,
    };

    let newData = database;
    for (const key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1);
            }
            if (key === 'startTime' || key === 'endTime') {
              const start = new Date(other.startTime).getTime();
              const end = new Date(other.endTime).getTime();
              const now = new Date(item[key]).getTime();

              if (start && end) {
                return now >= start && now <= end;
              }
              return true;
            }
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1;
          }
          return true;
        });
      }
    }
    const list = {
      data: newData.slice((pageNum - 1) * pageSize, pageNum * pageSize),
      total: newData.length,
    };
    const data = baseData('success', '查询成功');
    data.entity = list;
    setTimeout(() => {
      res.status(200).json(data);
    }, 1000);
  },
  delete(req, res) {
    const {
      id,
    } = req.body;
    database = database.filter((item) => item.id !== id);
    res.status(200).json(baseData('success', '删除成功'));
  },
  update(req, res) {
    const editItem = req.body;
    let isExist = false;

    database = database.map((item) => {
      if (item.id === editItem.id) {
        isExist = true;
        return Object.assign({}, item, editItem);
      }
      return item;
    });

    if (isExist) {
      res.json(baseData('success', '更新成功！'));
    } else {
      res.json(baseData('error', '未找到对应数据！'));
    }
  },
  add(req, res) {
    const newData = req.body;
    newData.createTime = Mock.mock('@now');
    newData.id = Mock.mock('@id');
    newData.createName = Mock.mock('@cname');
    database.unshift(newData);
    res.json(baseData('success', '新增成功！'));
  },
};
