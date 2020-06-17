const qiniu = require('qiniu');
const fs = require('fs');
const path = require('path');
const PUBLIC_PATH = path.join(__dirname, '/');

// 上传凭证
var accessKey = 'i7U1jRpEN_bF9U9zrJvdcYERX_hdRYXuiDPq8ZSJ';
var secretKey = 'pHuNplx_E9tDDuWIVZhQQZF1toJyVjDLihw5JYnn';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
  scope: 'paintingstudio',
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
// 是否使用https域名
config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;

/**
 * 遍历文件夹递归上传
 * @param {path} src 本地路径
 * @param {string} dist oos文件夹名
 * @param {boolean} isDir 是否为文件夹下文件
 */
async function addFileToOSSSync(src, dist, isDir, foldName) {
  let docs = fs.readdirSync(src);
  docs.forEach(function(doc) {
    let _src = src + '/' + doc,
      _dist = dist + '/' + doc;
    let st = fs.statSync(_src);

    // 判断是否为文件
    if (st.isFile() && dist !== 'LICENSES`') {
      putOSS(_src, !isDir ? doc : `${foldName}/${doc}`); //如果是文件夹下文件，文件名为 fonts/文件名
    }
    // 如果是目录则递归调用自身
    else if (st.isDirectory()) {
      addFileToOSSSync(_src, _dist, true, foldName);
    }
  });
}
/**
 *单个文件上传至oss
 */
async function putOSS(src, dist) {
  try {
    var localFile = src;
    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = dist;
    // 文件上传
    await formUploader.putFile(uploadToken, key, localFile, putExtra, function(
      respErr,
      respBody,
      respInfo,
    ) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        console.log(key + '上传oss成功');
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });
  } catch (e) {
    console.log('上传失败'.e);
  }
}
/**
 *上传文件启动
 */
async function upFile(foldName) {
  try {
    let src = PUBLIC_PATH + 'dist';
    let docs = fs.readdirSync(src);
    await addFileToOSSSync(src, docs, false, foldName);
  } catch (err) {
    console.log('上传oss失败', err);
  }
}
async function upFolder() {
  const folderList = ['img', 'css', 'js'];
  for (let i = 0; i < folderList.length; i++) {
    upFile(folderList[i]);
  }
}
upFolder();
