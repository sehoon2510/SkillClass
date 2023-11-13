class sopa
{
    constructor() {
        this.soapList = document.querySelector(".sopa_table");
        this.buyPopupBtn = document.querySelector("#buy_popup");
        this.buyCheckPopupBtn = document.querySelector("#buy_check_popup");
        this.searchInput = document.querySelector("#find");
        this.searchBox = document.querySelector("#find-btn");
        this.searchList = document.querySelector(".find-box");

        this.buyPopup = {"active":false, "target":document.querySelector(".sub_login")};
        this.buyCheckPopup = {"active":false, "target":document.querySelector(".buy_check")};
        this.DetailsPopup = {"active":false, "target":document.querySelector(".details")};

        this.category = [];

        this.Data = [];

        this.targetArr = [];

        this.prototype;

        this.findText;

        this.time;
        this.ani;

        this.JsonGet();
        this.Event();
    }

    Event()
    {
        this.buyPopupBtn.addEventListener('click', e => {
            console.log(this.buyPopup);
            this.buyPopup.active = true;
            this.buyPopup.target.classList.add("active");
        });

        this.buyPopup.target.addEventListener('click', e => {
            if(this.buyPopup.active) {
                if(e.target == this.buyPopup.target || e.target.id == "buy_back") {
                    console.log(this.buyPopup, e.target);
                    this.buyPopup.active = false;
                    this.buyPopup.target.classList.remove("active");
                }
            }
        });
        
        this.buyCheckPopupBtn.addEventListener('click', e => {
            console.log(this.buyCheckPopup);
            this.buyCheckPopup.active = true;
            this.buyCheckPopup.target.classList.add("active");
        });

        this.buyCheckPopup.target.addEventListener('click', e => {
            if(this.buyCheckPopup.active) {
                if(e.target == this.buyCheckPopup.target || e.target.id == "check_back") {
                    console.log(this.buyCheckPopup, e.target);
                    this.buyCheckPopup.active = false;
                    this.buyCheckPopup.target.classList.remove("active");
                }
            }
        });
        
        this.DetailsPopup.target.addEventListener('click', e => {
            if(this.DetailsPopup.active) {
                if(e.target == this.DetailsPopup.target || e.target.id == "details_back") {
                    console.log(this.DetailsPopup, e.target);
                    this.DetailsPopup.active = false;
                    this.DetailsPopup.target.classList.remove("active");
                }
            }
        });

        this.searchInput.addEventListener('click', e => {
            this.searchList.classList.add("active");
            this.searchList.innerHTML = '';
        });
        
        this.searchInput.addEventListener('input', e => {
            this.searchList.classList.add("active");
            this.searchList.innerHTML = '';

            let findstart = [];
            let findData = [];
            let valueInput = 0;
            
            // let findIndex = 0;
            // console.log(e.target.value.split(" "))

            if(e.target.value.split(" ").length >= 2) {
                valueInput = 1;
                // 1. 검색어 0번 값과 같은 index위치를 찾는다.
                console.log('-------------------------');
                e.target.value.split(" ").forEach(findText => {
                    
                });
                for(let i = 0; i < this.prototype.length; i++) {
                    this.prototype[i].soapName.split(" ").forEach((text, index) => {
                        if(text == e.target.value.split(" ")[0]) {
                            console.log(e.target.value.split(" "), this.prototype[i].soapName, index);
                            findstart.push({'index':index, 'list':this.prototype[i]});
                        }
                    })
                }
                console.log('-------------------------');
            }

            for(let y = valueInput; y < e.target.value.split(" ").length; y++) {
                for(let i = 0; i < findstart.length; i++) {

                    let texts = [];
    
                    let index = 1;
    
                    if(findstart[i].index != undefined) {
                        index = findstart[i].index + 1;
                    }
    
                    for(let z = index; z < findstart[i].list.soapName.split(" ").length; z++) {
                        texts.push(findstart[i].list.soapName.split(" ")[z])
                    }
    
                    // console.log(findData[i].list.soapName.split(" "));
                    // console.log(e.target.value.split(" "), this.prototype[i].soapName.split(" "));
                    texts.forEach(text => {
                        console.log(texts, e.target.value.split(" ")[y], text.length, e.target.value.split(" ")[y].length);
                        for(let z = 0; z < text.length - (e.target.value.split(" ")[y].length - 1); z++) { // 2 1:2 2:1   3 1:3 2:2 3:1  4 1:4 2:3 3:2 4:1
                            let start = z;
                            let end = z + 1 + (e.target.value.split(" ")[y].length - 1);
                            console.log(start, end, text.substr(start, end));
                            if(text.substr(start, end) == e.target.value.split(" ")[y]) {
                                
                                console.log('-----비교시작-----');
                                // console.log(text.substr(start, end), this.prototype[i].soapName);
                                findData.push(findstart[i].list);
                                // this.searchList.innerHTML += `<li><p class="n-medium">${this.prototype[i].soapName.replace(`${e.target.value}`, `<span style="color: red;">${e.target.value}</span>`)}</p></li>`;
                                console.log('------------------');
    
                            }
                            
                        }
    
                    });
                }
            }

            console.log(findData);

            // console.log(findData);
            // this.findText = e.target.value;
            // this.CategoryAdd(findData);
        });
        
        this.searchInput.addEventListener('blur', e => {
            this.searchList.classList.remove("active");
        });
    }

    CategoryAdd(list) {

        this.category = [];
        this.Data = [];

        list.forEach(category => {
            if(this.category.length <= 0 ) {
                this.category.push(category.category);
            } else { 
                for(let i = 0; i < this.category.length; i++) {
                    if(this.category[i] == category.category) {
                        break;
                    }
                    if(i == this.category.length - 1) {
                        this.category.push(category.category);
                    }
                }
            }
        }); 

        this.category.forEach(category => {
            var Dlist = [];
            for(let i = 0; i < list.length; i++) {
                if(category == list[i].category) {
                    Dlist.push(list[i]);
                }
            }

            this.Data.push({"category":category, "list":Dlist, "count":2});
        }); 

        this.Drow();
    }

    Drow() {

        this.soapList.innerHTML = '';

        this.category.forEach((category, index) => {
            this.soapList.innerHTML += 
            `<div class="item">
                <p class="n-medium">${category}</p>
                <ul class="sopa_list" data-id="${index}">
                    <li class="no-data">
                        <div class="img-arr"></div>
                        <div class="text-arr"></div>
                    </li>
                </ul>
            </div>`;
        });

        this.Data.forEach((data, index) => {
            let targetUl = this.soapList.querySelectorAll("ul")[index];
            
            targetUl.innerHTML = '';

            for(let i = 0; i < data.list.length; i++) {
                if(targetUl.childElementCount <= 3) {
                    targetUl.innerHTML += 
                    `<li>
                        <div class="img-arr">
                            <img src="./image/img/${data.list[i].Image}" alt="list-img${index}-${data.list[i].category}-${i}">
                        </div>
                        <div class="text-arr">
                            <div class="list-title">
                                <p class="n-medium">${data.list[i].soapName.replace(`${this.findText}`, `<span style="color: red;">${this.findText}</span>`)}</p>
                            </div>
                            <p class="n-regular"><span class="n-bold">${this.ForMetPrice(data.list[i].price)}</span>원</p>
                            <p class="n-regular">제작일자 : ${data.list[i].release}</p>
                            <div>
                                <button class="n-medium add">장바구니</button>
                                <button class="n-medium find">상세보기</button>
                            </div>
                        </div>
                    </li>`;
                } else if(targetUl.childElementCount == 4) {
                    targetUl.innerHTML += 
                    `<li class="no-data">
                        <div class="img-arr">
                        </div>
                        <div class="text-arr">
                        </div>
                        <div class="loding">
                            <i class="fa fa-refresh" aria-hidden="true"></i>
                            <span><p class="n-regular">로딩중.</p></span>
                        </div>
                    </li>`;
                }
            }
        });

        this.soapList.querySelectorAll("ul").forEach(target => {
            target.addEventListener('scroll', e => {
                const maxScrollLeft = target.scrollWidth - target.clientWidth;
                if (target.scrollLeft === maxScrollLeft) {
                    console.log('가로 스크롤 끝에 도달했습니다!', maxScrollLeft);
                    target.querySelector("li:last-child").querySelector(".loding p").innerText = '로딩중.';
                    target.querySelector("li:last-child").querySelector(".loding i").classList = ['fa fa-refresh'];
                    this.ListReload(target);
                }
            });
        });
    }

    ListReload(target) {
        console.log(target, this.Data[target.dataset.id]);
        let AddData = this.Data[target.dataset.id];

        let range = [];

        const pTag = target.querySelector("li:last-child").querySelector(".loding p");
        let dotCnt = 1;
        this.time = setInterval(() => {
            pTag.innerText = `로딩중${ ".".repeat((dotCnt++) % 3 + 1 )}`;
        }, 300);
        
        this.ani = target.querySelector("li:last-child").querySelector(".loding i").animate({
            transform: 'rotate(360deg)'
        }, {
            duration: 1300,
            easing: "ease",
            iterations: Infinity,
            fill: "both"
        });   

        if(target.childElementCount <= AddData.list.length) {
            setTimeout(() => {
                this.ani.finish();
                clearInterval(this.time);
                target.querySelector("li:last-child").remove();
                console.log(target.childElementCount, (AddData.count * 4) - 1);
                for(let i = target.childElementCount; i < AddData.list.length; i++) {
                    if(target.childElementCount <= (AddData.count * 4) - 1) {
                        target.innerHTML += 
                        `<li>
                            <div class="img-arr">
                                <img src="./image/img/${AddData.list[i].Image}" alt="list-img${target.dataset.id}-${AddData.list[i].category}-${i}">
                            </div>
                            <div class="text-arr">
                                <div class="list-title">
                                    <p class="n-medium">${AddData.list[i].soapName}</p>
                                </div>
                                <p class="n-regular"><span class="n-bold">${this.ForMetPrice(AddData.list[i].price)}</span>원</p>
                                <p class="n-regular">제작일자 : ${AddData.list[i].release}</p>
                                <div>
                                    <button class="n-medium add">장바구니</button>
                                    <button class="n-medium find">상세보기</button>
                                </div>
                            </div>
                        </li>`;
                    }
                }

                AddData.count++;

                target.innerHTML += 
                `<li class="no-data">
                    <div class="img-arr">
                    </div>
                    <div class="text-arr">
                    </div>
                    <div class="loding">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                        <span><p class="n-regular">로딩중.</p></span>
                    </div>
                </li>`;

            }, 5000);     

        } else {
            setTimeout(() => {
                target.querySelector("li:last-child").querySelector(".loding i").remove();
                target.querySelector("li:last-child").querySelector(".loding").innerHTML += '<i class="fa fa-exclamation" aria-hidden="true"></i>';
                clearInterval(this.time);
                target.querySelector("li:last-child").querySelector(".loding p").innerText = '데이터가 없습니다.';
            }, 5100);
        }
    }

    CreateDoM(category, id) {
        document.querySelectorAll(".sopa_table > .item")[id].innerHTML = `<p class="n-medium">${category}</p>`;

        let DOM = document.createElement("ul");
        DOM.classList.add("sopa_list");

        return DOM;
    }

    ForMetPrice(input) {
        const numericString = input.match(/\d+/);
        if (numericString) {
            const formattedNumber = numericString[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return formattedNumber;
        }
        return "Invalid Input";
    }

    JsonGet() {
        $.ajax({
            method: "GET",
            url: `http://127.0.0.1:5500/js/soap.json`,
            success: res => {
                console.log(res);
                this.prototype = res.data;
                this.CategoryAdd(res.data);
                // this.Drow(res.data);
            }
        });
    }
}

window.onload = function() {
    var app = new sopa();
};