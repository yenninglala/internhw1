//DOM 客制變數
const content = document.querySelector('#content');
const btnselect = document.querySelector('#btnselect');
const countrycheck = document.querySelector('.countrycheck');
const container = document.querySelector('.container');
const choosezone = document.querySelector('.choosezone');
var dataTotal;
var jsondata = {};
var arrdata = [];
var xhr = new XMLHttpRequest();
var requestURL = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';
const pageid = document.getElementById('pageid');
xhr.open('get', requestURL);
xhr.send();
xhr.onload = function () {
  // handle success
  jsondata = JSON.parse(xhr.responseText).result.records;
  console.log(jsondata);
  pagination(jsondata, 1);
  addList();
}


// 過濾成乾淨的區域陣列到 areaList
function addList() {
  const zonelist = [];
  for (let i = 0; jsondata.length > i; i++) {
    zonelist.push(jsondata[i].Zone);
  }

  // 再用 foreach 去判斷陣列裡面所有值是否有吻合
  const zone = Array.from(new Set(zonelist));
  console.log(zone)

  let str = '<option value="---請選擇地區---" selected disabled>---請選擇地區---</option>';
  for (let i = 0; i < zone.length; i++) {
    str += `<option value ="${zone[i]}">${zone[i]}</option>`
  };
  countrycheck.innerHTML = str;
}

//新增下拉選單
//下拉選單-選擇地區
function updata(e) {
  const select = e.target.value;
  //  const str = select;
  //  container.innerHTML='';
  choosezone.innerHTML = select;

  arrdata = [];

  jsondata.forEach(function (item) {
    if (select === item.Zone) {
      arrdata.push(item);
    }
  })
  pagination(arrdata, 1);
}
countrycheck.addEventListener('change', updata, false);


function pagination(jsondata, nowPage) {
  dataTotal = jsondata.length; //總筆數
  console.log(dataTotal);
  const perpage = 6; //每頁六筆
  const pageTotal = Math.ceil(dataTotal / perpage) //總頁數=總資料/每頁筆數->無條件進位Math.ceil
  // console.log(pageTotal)
  let currentPage = nowPage; // 當前頁數 

  // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }

  const minData = (currentPage * perpage) - perpage + 1; //每頁的第一筆
  const maxData = currentPage * perpage; //每頁的最後一筆

  const data = [];

  jsondata.forEach(function (item, index) {
    const num = index + 1;
    if (num >= minData && num <= maxData) {
      data.push(item);
    }

  })
  var page = {
    pageTotal,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal,
  }
  console.log(page)
  //執行
  pageBtn(page);
  displayData(data)
}

function pageBtn(page) {
  let str = '';
  const total = page.pageTotal;

  for (let i = 1; i <= total; i++) {
    if (Number(page.currentPage) === i) {
      str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    } else {
      str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
  };
  pageid.innerHTML = str;
}
//選染畫面
function displayData(data) {
  let str = '';
  data.forEach(function (item) {
    str += `  
    <div class="col-md-6 py-2 px-1">
        <div class="card">
          <div class="card  text-white text-left">
            <img class="card-img-top bg-cover" height="180px" src="${item.Picture1}">
            <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3" style="background-color: rgba(0, 0, 0, .2)">
             <h5 class="card-img-title-lg">${item.Name}</h5><h5 class="card-img-title-sm">${item.Zone}</h5>
           </div>
          </div>
          <div class="card-body text-left">
              <p class="card-p-text"></i>&nbsp;${item.Opentime}</p>
              <p class="card-p-text"></i>&nbsp;${item.Add}</p>
              <p class="card-p-text"></i>&nbsp;${item.Ticketinfo}</p>
          </div>
        </div>
      </div>
    `;
  })
  content.innerHTML = str;
}
//切換
function switchPage(e) {
  e.preventDefault();
  const page = e.target.firstChild.data;
  //判斷顯示全區資料或去特定區域資料
  switch (true) {
    case countrycheck.value === "---請選擇地區---":
      jsondata
      pagination(jsondata, page);
      break
    default:
      pagination(page);
      break
  }

} //監聽
pageid.addEventListener('click', switchPage);
btnselect.addEventListener('click', updataList, false);
// 按鈕選地區
function updataList(e) {
  var select = e.target.value;
  console.log(jsondata.length)
  var allthing = '';
  for (var i = 0; i < jsondata.length; i++) {
    if (select == jsondata[i].Zone) {
      allthing +=
        `<div class="col-md-6 py-2 px-1">
        <div class="card">
          <div class="card  text-white text-left">
            <img class="card-img-top bg-cover" height="180px" src="${jsondata[i].Picture1}">
            <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3" style="background-color: rgba(0, 0, 0, .2)">
             <h5 class="card-img-title-lg">${jsondata[i].Name}</h5><h5 class="card-img-title-sm">${jsondata[i].Zone}</h5>
           </div>
          </div>
          <div class="card-body text-left">
              <p class="card-p-text"></i>&nbsp;${jsondata[i].Opentime}</p>
              <p class="card-p-text"></i>&nbsp;${jsondata[i].Add}</p>
              <p class="card-p-text"></i>&nbsp;${jsondata[i].Ticketinfo}</p>
          </div>
        </div>
      </div>`
      content.innerHTML = allthing;
      choosezone.innerHTML = select;
    }
    pageBtn(jsondata);
  }
}