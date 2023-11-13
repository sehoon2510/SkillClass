// 페이지네이션
class Page
{
    constructor(maxItem, nowPage = 1) {

        this.maxItem = maxItem; // 최대 글 수

        this.MaxPageCnt = Math.ceil(this.maxItem / 8); // 최대 페이지 수

        this.nowPage = nowPage; // 현재 페이지

        this.endId = Math.ceil(this.nowPage / 10) * 10; // 마지막 페이지 리스트
        this.satrtId = this.endId - 9; // 첫번째 페이지 리스트

        this.dataSid = (nowPage - 1) * 8; // 현 페이지의 시작 글 id
        this.dataEid = (this.dataSid + 8); // 현 페이지의 마지막 글 id

        this.StartBtn = this.nowPage > 10;
        this.EndBtn = this.nowPage < (Math.ceil(this.MaxPageCnt / 10) * 10) - 9;

        this.NextBtn = this.nowPage != this.MaxPageCnt;
        this.BackBtn = this.nowPage != 1;

    }
}

class History 
{
    constructor() {

        this.years = new Array();
        this.historys = new Array();
        this.active;
        
        this.addBtn = document.querySelector("#add");
        this.Tabs = document.querySelector(".history__tab");
        this.content = document.querySelector(".history__list");

        this.AddEdit = document.querySelector("#popup__edit");
        this.Delete = document.querySelector("#popup__err");

        this.target = null;
        this.ContentInput = document.querySelector("#history__text");
        this.DateInput = document.querySelector("#history__date");

        this.init();
    }

    init() {

        this.StorageLoad();

        if(!this.historys) this.reload();

        if(!this.active) this.active = this.years[0];

        this.drow();

        this.event();
    }

    drow() {

        this.Tabs.innerHTML = '';
        this.content.innerHTML = '';

        this.years.forEach(year => {
            this.Tabs.innerHTML += `<div class="tab__item" data-year="${year}">${year}년</div>`;
            if(this.active == year) this.Tabs.lastElementChild.classList.add("active");
        });

        this.historys.forEach(history => {
            if(this.active == history.year) this.content.innerHTML += `
                <div class="history__item d-flex align-items-center" data-date="${history.m}-${history.d}">
                    <div>${history.m} . ${history.d}</div>
                    <div>${history.content}</div>
                    <div class="btn-group">
                        <button class="edit" data-date="${history.m}-${history.d}">수정</button>
                        <button class="delete" data-date="${history.m}-${history.d}">삭제</button>
                    </div>
                </div>
            `;
        });

    }

    event() {
        this.Tabs.addEventListener("click", e => {
            if(!e.target.classList.contains("history__tab") && e.target.classList.contains("active")) return;
            this.active = e.target.dataset.year;

            this.StorageSave();
        });

        this.addBtn.addEventListener("click", e => {
            this.AddEdit.classList.add("active");
            this.Delete.classList.remove("active");
        });

        this.content.addEventListener("click", e => {
            if(e.target.classList.contains("edit")) {
                this.AddEdit.classList.add("active");
                this.Delete.classList.remove("active");
                this.target = e.target.dataset.date;
            } else if(e.target.classList.contains("delete")) {
                this.AddEdit.classList.remove("active");
                this.Delete.classList.add("active");
                this.target = e.target.dataset.date;
            }
        });

        this.AddEdit.addEventListener("click", e => {
            if(!e.target.classList.contains("go") && !e.target.classList.contains("back")) return;
            if(e.target.classList.contains("go")) {

                let dates = this.DateInput.value.split("-");
                
                let rope = true;

                this.years.forEach((year, index) => {
                    if(dates[0] == year) rope = false;
                    if(index + 1 == this.years.length && rope) this.years.push(dates[0]);
                });

                if(this.target == null) {
                    this.historys.push({"year":dates[0], "m":dates[1], "d":dates[2], "content":this.ContentInput.value});

                    this.active = dates[0];
                } else {

                    this.historys = this.historys.map(history => {
                        if (`${history.year}-${history.m}-${history.d}` === `${this.active}-${this.target}`) {
                            // 특정 조건에 해당하는 경우 내용 수정
                            return { ...history, content: this.ContentInput.value, m: dates[1], d: dates[2], year: dates[0]};
                        } else {
                            return history; // 조건에 해당하지 않는 경우 그대로 반환
                        }
                    });
                }

                this.StorageSave();
                this.AddEdit.classList.remove("active");
                this.target = null;

            } else {
                this.AddEdit.classList.remove("active");
                this.target = null;
            }
        });
        
        this.Delete.addEventListener("click", e => {
            if(!e.target.classList.contains("go") && !e.target.classList.contains("back")) return;
            if(e.target.classList.contains("go")) {

                this.content.querySelectorAll(".history__item").forEach(element => {
                    if(this.target == element.dataset.date) element.remove();
                });
    
                // 삭제된 연혁을 배열에서 삭제
                this.historys = this.historys.filter(history => 
                    `${history.year}-${history.m}-${history.d}` !== `${this.active}-${this.target}`);
                    
                this.StorageSave();
                this.Delete.classList.remove("active");
                this.target = null;
            } else {
                this.Delete.classList.remove("active");
                this.target = null;
            }
        });
    }

    StorageLoad() {
        
        this.years = JSON.parse(localStorage.getItem('year'));
        this.historys = JSON.parse(localStorage.getItem('data'));
        this.active = JSON.parse(localStorage.getItem('active'));

        // 내림차순 정열
        if(this.years) this.years.sort(function(a, b) {
            return b - a;
        });

    }
    
    StorageSave() {

        localStorage.setItem('year', JSON.stringify(this.years));
        localStorage.setItem('data', JSON.stringify(this.historys));
        localStorage.setItem('active', JSON.stringify(this.active));

        this.StorageLoad();
        this.drow();

    }

    reload() {
        let year = [2021, 2020, 2019, 2018, 2017];
    
        localStorage.setItem('year', JSON.stringify(year));

        let data = [
            {"year":2021, "m":"01", "d":"05", "content":"2021년 1월 연혁1"},
            {"year":2021, "m":"01", "d":"10", "content":"2021년 1월 연혁2"},
            {"year":2021, "m":"01", "d":"20", "content":"2021년 1월 연혁3"},
            {"year":2021, "m":"01", "d":"30", "content":"2021년 1월 연혁4"},
            {"year":2021, "m":"06", "d":"05", "content":"2021년 6월 연혁1"},
            {"year":2021, "m":"06", "d":"10", "content":"2021년 6월 연혁2"},
            {"year":2021, "m":"06", "d":"20", "content":"2021년 6월 연혁3"},
            {"year":2021, "m":"06", "d":"30", "content":"2021년 6월 연혁4"},
            {"year":2020, "m":"01", "d":"05", "content":"2020년 1월 연혁1"},
            {"year":2020, "m":"01", "d":"10", "content":"2020년 1월 연혁2"},
            {"year":2020, "m":"01", "d":"20", "content":"2020년 1월 연혁3"},
            {"year":2020, "m":"01", "d":"30", "content":"2020년 1월 연혁4"},
            {"year":2020, "m":"06", "d":"05", "content":"2020년 6월 연혁1"},
            {"year":2020, "m":"06", "d":"10", "content":"2020년 6월 연혁2"},
            {"year":2020, "m":"06", "d":"20", "content":"2020년 6월 연혁3"},
            {"year":2020, "m":"06", "d":"30", "content":"2020년 6월 연혁4"},
            {"year":2019, "m":"01", "d":"05", "content":"2019년 1월 연혁1"},
            {"year":2019, "m":"01", "d":"10", "content":"2019년 1월 연혁2"},
            {"year":2019, "m":"01", "d":"20", "content":"2019년 1월 연혁3"},
            {"year":2019, "m":"01", "d":"30", "content":"2019년 1월 연혁4"},
            {"year":2019, "m":"06", "d":"05", "content":"2019년 6월 연혁1"},
            {"year":2019, "m":"06", "d":"10", "content":"2019년 6월 연혁2"},
            {"year":2019, "m":"06", "d":"20", "content":"2019년 6월 연혁3"},
            {"year":2019, "m":"06", "d":"30", "content":"2019년 6월 연혁4"},
            {"year":2018, "m":"01", "d":"05", "content":"2018년 1월 연혁1"},
            {"year":2018, "m":"01", "d":"10", "content":"2018년 1월 연혁2"},
            {"year":2018, "m":"01", "d":"20", "content":"2018년 1월 연혁3"},
            {"year":2018, "m":"01", "d":"30", "content":"2018년 1월 연혁4"},
            {"year":2018, "m":"06", "d":"05", "content":"2018년 6월 연혁1"},
            {"year":2018, "m":"06", "d":"10", "content":"2018년 6월 연혁2"},
            {"year":2018, "m":"06", "d":"20", "content":"2018년 6월 연혁3"},
            {"year":2018, "m":"06", "d":"30", "content":"2018년 6월 연혁4"},
            {"year":2017, "m":"01", "d":"05", "content":"2017년 1월 연혁1"},
            {"year":2017, "m":"01", "d":"10", "content":"2017년 1월 연혁2"},
            {"year":2017, "m":"01", "d":"20", "content":"2017년 1월 연혁3"},
            {"year":2017, "m":"01", "d":"30", "content":"2017년 1월 연혁4"},
            {"year":2017, "m":"06", "d":"05", "content":"2017년 6월 연혁1"},
            {"year":2017, "m":"06", "d":"10", "content":"2017년 6월 연혁2"},
            {"year":2017, "m":"06", "d":"20", "content":"2017년 6월 연혁3"},
            {"year":2017, "m":"06", "d":"30", "content":"2017년 6월 연혁4"}
        ];

        localStorage.setItem('data', JSON.stringify(data));

        this.init();
        return;
    }
}

class Phone
{
    constructor() {

        this.categorys = new Array();
        this.datas = new Array();

        this.active = "전체"

        this.Tabs = document.querySelector(".phone__tab");
        this.content = document.querySelector(".phone__content");

        this.init();
    }

    init() {
        this.load();
    }

    drowTabs() {

        this.Tabs.innerHTML = '<div class="tab__item all" data-tab="전체">전체</div>';

        this.categorys.forEach(category => {
            this.Tabs.innerHTML += `<div class="tab__item" data-tab="${category.deptNm}">${category.deptNm}</div>`;
        });

    }

    event() {
        this.Tabs.querySelector(".all").classList.add("active");

        this.Tabs.addEventListener("click", e => {
            if(e.target.classList.contains("tab__item")) {
                this.active = e.target.dataset.tab;
                this.Tabs.querySelectorAll(".tab__item").forEach(element => {
                    
                    element.classList.remove("active");
                    
                    if(this.active == element.dataset.tab) {
                        element.classList.add("active");
                    }
                });

                this.drowList();
            
            }
            
        });
    }

    drowList() {

        this.content.innerHTML = '';

        if(this.active == "전체") {
            this.categorys.forEach(category => {
                this.content.innerHTML += `
                    <div class="list__title">
                        <p>${category.deptNm}</p>
                    </div>
                    <div class="phone__list d-flex flex-wrap"></div>
                `;

                this.datas.items.forEach(data => {
                    if(category.deptNm == data.deptNm)
                    this.content.lastElementChild.innerHTML += `
                        <div class="phone__item d-flex align-items-center justify-content-between">
                            <p>${data.name}</p>
                            <div class="d-flex align-items-center justify-content-end">
                                ${data.telNo}
                            </div>
                        </div>
                    `;
                });
            });
        } else {
            this.content.innerHTML = `
                <div class="list__title">
                    <p>${this.active}</p>
                </div>
                <div class="phone__list d-flex flex-wrap"></div>
            `;

            this.datas.items.forEach(data => {
                if(this.active == data.deptNm)
                this.content.lastElementChild.innerHTML += `
                    <div class="phone__item d-flex align-items-center justify-content-between">
                        <p>${data.name}</p>
                        <div class="d-flex align-items-center justify-content-end">
                            ${data.telNo}
                        </div>
                    </div>
                `;
            });
        }

    }

    async load() {
        let json = await ajax("GET", "/restAPI/phone.php");

        try {

            this.datas = json;

            this.categorys = this.datas.items.filter((obj, index, self) =>
                index === self.findIndex(t => t && obj && t.deptNm === obj.deptNm)
            );

        } catch(e) {
            console.log(e);
        }
        
        this.drowTabs();
        this.drowList();
        this.event();

    }    
}

class Situation
{
    constructor() {

        this.pager;

        this.datas = new Array();

        this.content = document.querySelector(".ih__content");
        this.pagerNode = document.querySelector(".page");
        this.pageName = document.querySelector(".head > p");

        this.pageTarget = 1;

        this.init();
    }

    init() {    

        this.XmlControlLoad();
    }

    drowPager() {
        
        this.pagerNode.innerHTML = '';
        this.pageName.innerHTML = `총 ${this.pager.maxItem}건 [ ${this.pager.nowPage}P / ${this.pager.MaxPageCnt}P ]`;

        this.pagerNode.innerHTML += `
            <div class="page__item type__null d-flex justify-content-center align-items-center" data-id="start"><<</div>
        `;

        if(this.pager.StartBtn) {
            this.pagerNode.lastElementChild.classList.remove("type__null");
            this.pagerNode.lastElementChild.classList.add("type__btn");
        }

        this.pagerNode.innerHTML += `
            <div class="page__item type__null d-flex justify-content-center align-items-center" data-id="left"><</div>    
        `;

        if(this.pager.BackBtn) {
            this.pagerNode.lastElementChild.classList.remove("type__null");
            this.pagerNode.lastElementChild.classList.add("type__btn");
        }
        
        for(let i = this.pager.satrtId; i <= this.pager.endId; i++) {
            this.pagerNode.innerHTML += `<div class="page__item type__id d-flex justify-content-center align-items-center" data-id="${i}">${i}</div>`;
            if(this.pageTarget == i) this.pagerNode.lastElementChild.classList.add("active");
        }

        this.pagerNode.innerHTML += `
            <div class="page__item type__null d-flex justify-content-center align-items-center" data-id="right">></div>
        `;

        if(this.pager.NextBtn) {
            this.pagerNode.lastElementChild.classList.remove("type__null");
            this.pagerNode.lastElementChild.classList.add("type__btn");
        }   

        this.pagerNode.innerHTML += `
            <div class="page__item type__null d-flex justify-content-center align-items-center" data-id="end">>></div>    
        `;

        if(this.pager.EndBtn) {
            this.pagerNode.lastElementChild.classList.remove("type__null");
            this.pagerNode.lastElementChild.classList.add("type__btn");
        }

        this.ElementReload();
    }

    ElementReload() {
        this.content.innerHTML = '';

        for(let i = this.pager.dataSid; i < this.pager.dataEid; i++) {
            this.XmlLoad(this.datas[i].path);
        }
    }
    
    ElementDrow(name, image) {

        this.content.innerHTML += `
            <li class="d-flex flex-column align-items-center">
                <div class="img__box d-flex justify-content-center align-items-center">
                    ${image != '' ? `<img src="./xml/image/${image}" alt="image">` : `<p class="t">NO IMAGE</p>`}
                </div>
                <p class="m">${name}</p>
            </li>
            `;
    }

    event() {

        this.pagerNode.addEventListener("click", e => {
            if(e.target.classList.contains("type__id")) {

                if(e.target.dataset.id == this.pageTarget) return; 

                this.pageTarget = e.target.dataset.id;
                this.pager = new Page(this.datas.length, this.pageTarget);
                this.drowPager();

            } else if(e.target.classList.contains("type__btn")) {

                if(e.target.dataset.id == "start") {

                    this.pageTarget = 1;
                    this.pager = new Page(this.datas.length, this.pageTarget);
                    this.drowPager();

                } else if(e.target.dataset.id == "end") {

                    this.pageTarget = this.pager.MaxPageCnt;
                    this.pager = new Page(this.datas.length, this.pageTarget);
                    this.drowPager();

                } else if(e.target.dataset.id == "left") {

                    this.pageTarget = (this.pageTarget * 1) - 1;
                    this.pager = new Page(this.datas.length, this.pageTarget);
                    this.drowPager();

                } else if(e.target.dataset.id == "right") {

                    this.pageTarget = (this.pageTarget * 1) + 1;
                    this.pager = new Page(this.datas.length, this.pageTarget);
                    this.drowPager();

                }
            }
        });

    }

    async XmlLoad(path) {
        let json = await xml("GET", `/xml/detail/${path}.xml`);

        try {

            let name = this.getCDATAText(json, "ccbaMnm1");
            let image = json.querySelector("imageUrl").innerHTML;

            this.ElementDrow(name, image);
        } catch(e) {
            return console.log(e);
        }
    }

    async XmlControlLoad() {
        let json = await xml("GET", "/xml/nihList.xml");

        try {
            let items = json.querySelectorAll("item");

            items.forEach(data => {
                let id = data.querySelector("sn").innerHTML;
                let name = this.getCDATAText(data, "ccbaMnm1");
                let Kcode = data.querySelector("ccbaKdcd").innerHTML;
                let Ccode = data.querySelector("ccbaCtcd").innerHTML;
                let number = data.querySelector("ccbaAsno").innerHTML;
    
                this.datas.push({"id":id, "name":name, "path":`${Kcode}_${Ccode}_${number}`});
            });
        } catch(e) {

            return console.log(e);

        }

        this.pager = new Page(this.datas.length, this.pageTarget);

        this.drowPager();

        this.event();
    }

    getCDATAText(xmlDoc, tagName) {

        let cdataNode = xmlDoc.getElementsByTagName(tagName)[0];

        if (cdataNode && cdataNode.childNodes[0].nodeType === Node.CDATA_SECTION_NODE) {

            return cdataNode.childNodes[0].data;

        }

        return null;
    }
}