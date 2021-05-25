const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = `https://xosodaiphat.com/xsmb-xo-so-mien-bac.html`;

const options = {
    uri: URL,
    transform: function (body) {
      //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
      return cheerio.load(body);
    },
  };

  (async function crawler() {
    try {
      // Lấy dữ liệu từ trang crawl đã được parseDOM
      var $ = await rp(options);
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
        
    //Tìm bài viết ở mỗi chương
    let kqxsValue = []
    const trTags = currentKqxs.find("tbody").find("tr");
    //const names = currentKqxs.find("tbody").find("td span");

    for (let i = 0; i < trTags.length; i++) {
      if (i == 0) {
        continue;
      }

      const post = $(trTags[i]);
      const tdTag = post.find("td");

      var name = $(tdTag[0]).text();
      var value = $(tdTag[1]).text();
      console.log("chaperLink : " + $(tdTag[0]).text() + "\n");
      console.log("chaperLink : " + $(tdTag[1]).text() + "\n");
      kqxsValue.push({
        name,
        value
      });
    }
    // Lưu dữ liệu về máy
    fs.writeFileSync('data.json', JSON.stringify(kqxsValue))
  })();