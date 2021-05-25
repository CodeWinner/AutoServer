'use strict';

const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const URLMB = `https://xosodaiphat.com/xsmb-xo-so-mien-bac.html`;
const URLMT = `https://xosodaiphat.com/xsmt-xo-so-mien-trung.html`;
const URLMN = `https://xosodaiphat.com/xsmn-xo-so-mien-nam.html`;

var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks');

exports.list_all_tasks = async function(req, res) {

    var kqxsMB = await crawlDataKqxsMB();
    var kqxsMT = await crawlDataKqxsMT();
    var kqxsMN = await crawlDataKqxsMN();

    let reruls = {};
    reruls = {
      "KQXSMB" : {
        "data" : kqxsMB,
        "count": 1
      },
      "KQXSMT" : {
        "data" : kqxsMT,
        "count": kqxsMT.length
      },
      "KQXSMN" : {
        "data" : kqxsMN,
        "count": kqxsMN.length
      },
    }

    res.json(reruls);
};

async function crawlDataKqxsMN() {
  try {
    // Lấy dữ liệu từ trang crawl đã được parseDOM
    var $ = await rp(optionsMN);
  } catch (error) {
    return error;
  }
  
  /* Phân tích các table và sau đó lấy các posts.
      Mỗi table là một chương 
  */
  const tableContent = $(".block-main-content table");
  console.log("Length : " + tableContent.length);
  // Lay table dau tien ( ngay moi nhat)
  let currentKqxs = $(tableContent[0]);
        
  const theadTag = currentKqxs.find("thead").find("th");
  const trTags = currentKqxs.find("tbody").find("tr");

  // Get date
  const listLink = $(".class-title-list-link");
  let dateKqxs = $(listLink[0]).text();

  let kqxs = [];
  for (let i = 0; i < trTags.length; i++) {
    const post = $(trTags[i]);
    const tdTag = post.find("td");

     // Get tinh
     if (i == 0) {
      for (let n = 0; n < tdTag.length - 1; n++) {
        var childLocation = [];
        kqxs.push(childLocation);
      }
    }

    var name = ""
    for (let j = 0; j < tdTag.length; j++) {
      if (j == 0) {
        name = $(tdTag[0]).text();
        continue;
      }

      var resultKqxs = $(tdTag[j]).find("span");
      var values = "";
      for (let k = 0; k < resultKqxs.length; k++) {
        values = values + $(resultKqxs[k]).text();
        if (k != resultKqxs.length - 1) {
          values += ",";
        }
      }

      var location = $(theadTag[j]).text();
      kqxs[j-1].push({
        name,
        values,
        dateKqxs,
        location
      });
    }
  }

  // Lưu dữ liệu về máy
 // fs.writeFileSync('data.json', JSON.stringify(chaperData))
 return kqxs;
}

async function crawlDataKqxsMT() {
  try {
    // Lấy dữ liệu từ trang crawl đã được parseDOM
    var $ = await rp(optionsMT);
  } catch (error) {
    return error;
  }
  
  /* Phân tích các table và sau đó lấy các posts.
      Mỗi table là một chương 
  */
  const tableContent = $(".block-main-content table");
  console.log("Length : " + tableContent.length);
  let data = [];

  // Lay table dau tien ( ngay moi nhat)
  let currentKqxs = $(tableContent[0]);
        
  const theadTag = currentKqxs.find("thead").find("th");
  const trTags = currentKqxs.find("tbody").find("tr");

  // Get date
  const listLink = $(".class-title-list-link");
  let dateKqxs = $(listLink[0]).text();

  let kqxs = [];

  for (let i = 0; i < trTags.length; i++) {
    const post = $(trTags[i]);
    const tdTag = post.find("td");

    // Get tinh
    if (i == 0) {
      for (let n = 0; n < tdTag.length - 1; n++) {
        var childLocation = [];
        kqxs.push(childLocation);
      }
    }
    
    var name = ""
    for (let j = 0; j < tdTag.length; j++) {
      if (j == 0) {
        name = $(tdTag[0]).text();
        continue;
      }

      var resultKqxs = $(tdTag[j]).find("span");
      var values = "";
      for (let k = 0; k < resultKqxs.length; k++) {
        values = values + $(resultKqxs[k]).text();
        if (k != resultKqxs.length - 1) {
          values += ",";
        }
      }

      var location = $(theadTag[j]).text();
      // kqxsValue.push({
      //   name,
      //   values,
      //   dateKqxs,
      //   location
      // });

      kqxs[j-1].push({
        name,
        values,
        dateKqxs,
        location
      });
    }
  }

  // Lưu dữ liệu về máy
 // fs.writeFileSync('data.json', JSON.stringify(chaperData))
 return kqxs;
}

async function crawlDataKqxsMB() {
  try {
    // Lấy dữ liệu từ trang crawl đã được parseDOM
    var $ = await rp(optionsMB);
  } catch (error) {
    return error;
  }
  
  /* Phân tích các table và sau đó lấy các posts.
      Mỗi table là một chương 
  */
  const tableContent = $(".block-main-content table");
  console.log("Length : " + tableContent.length);

  // Lay table dau tien ( ngay moi nhat)
  let currentKqxs = $(tableContent[0]);
        
  //Tìm bài viết ở mỗi chương
  const trTags = currentKqxs.find("tbody").find("tr");
  const listLink = $(".class-title-list-link");
  let dateKqxs = $(listLink[0]).text();

  let kqxs = [[]];
  for (let i = 0; i < trTags.length; i++) {
    if (i == 0) {
      continue;
    }

    const post = $(trTags[i]);
    const tdTag = post.find("td");

    var name = $(tdTag[0]).text();
    var resultKqxs = $(tdTag[1]).find("span");

    var values = "";
    for (let j = 0; j < resultKqxs.length; j++) {
      values = values + $(resultKqxs[j]).text();
      if (j != resultKqxs.length - 1) {
        values += ",";
      }
    }

    // kqxsValue.push({
    //   name,
    //   values,
    //   dateKqxs
    // });

    let location = "Miền Bắc"
    kqxs[0].push({
      name,
      values,
      dateKqxs,
      location
    });
  }
  // Lưu dữ liệu về máy
 // fs.writeFileSync('data.json', JSON.stringify(chaperData))
 return kqxs;
}

const optionsMB = {
  uri: URLMB,
  transform: function (body) {
    //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
    return cheerio.load(body);
  },
};

const optionsMT = {
  uri: URLMT,
  transform: function (body) {
    //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
    return cheerio.load(body);
  },
};

const optionsMN = {
  uri: URLMN,
  transform: function (body) {
    //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
    return cheerio.load(body);
  },
};


exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_a_task = function(req, res) {

  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};