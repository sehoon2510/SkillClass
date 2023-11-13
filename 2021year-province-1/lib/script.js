class History
{
    constructor() {

        // 연혁 데이터
        this.years = new Array();
        this.historys = new Array();
        this.active; // 마지막으로 선택된 탭

        this.target; // 선택된 연혁
        
        this.tabs = document.querySelector("#tabs");
        this.content = document.querySelector("#content");
        
        this.PopupDelete = document.querySelector("#popup__err");
        this.BtnDeleteBack = document.querySelector("#delete__back");
        this.BtnDeleteGo = document.querySelector("#delete__go");
        
        this.PopupEdit = document.querySelector("#popup__edit");
        this.BtnEditBack = document.querySelector("#edit__back");
        this.BtnEditGo = document.querySelector("#edit__go");
        
        this.PopupAdd = document.querySelector("#history__add");

        this.InputText = document.querySelector("#history__text");
        this.Inputdate = document.querySelector("#history__date");

        this.init();

    }

    init() {
        
        // 로컬 스토리지에서 연혁 가져오기
        this.years = JSON.parse(localStorage.getItem('year'));
        this.historys = JSON.parse(localStorage.getItem('data'));

        // 마지막으로 선택된 탭 가져오기
        this.active = JSON.parse(localStorage.getItem('active'));

        // 데이터 검사
        if(!this.years || !this.historys) {
            this.years = new Array();
            this.historys = new Array();

            // 없으면 리로드
            this.reload();
            return;
        }

        // 내림차순 정열
        this.years.sort(function(a, b) {
            return b - a;
        });

        // 마지막으로 선택된 탭이 없다면 가장 최신탭 선택
        if(!this.active) {
            this.active = this.years[0];
        }

        this.drow();
        this.event();
    }

    drow() {
        
        this.tabs.innerHTML = '';
        this.content.innerHTML = '';

        this.years.forEach(year => {
            this.tabs.innerHTML += `
                <div class="tab__item" data-tab="${year}">${year}년</div>
            `;

            if(year == this.active) {
                this.tabs.lastElementChild.classList.add("active");
            }
        });

        this.historys.forEach(history => {
            if(history.year == this.active)
            this.content.innerHTML += `
                <div class="history__item d-flex justify-content-between align-items-center" data-date="${history.date}">
                    <div class="date d-flex justify-content-center"><p>${history.date}</p></div>
                    <div class="text m">${history.text}</div>
                    <div class="control d-flex justify-content-center align-items-center">
                        <button class="edit m" data-id="${history.date}">수정</button>
                        <button class="delete m" data-id="${history.date}">삭제</button>
                    </div>
                </div>
            `;
        });

        return;
    }

    event() {

        // 탭 교체
        this.tabs.addEventListener("click", e => {
            if(e.target.classList.contains("tab__item")) {
                this.active = e.target.dataset.tab;
                this.tabs.querySelectorAll(".tab__item").forEach(element => {
                    element.classList.remove("active");
                    
                    if(this.active == element.dataset.tab)
                    element.classList.add("active");
                });

                // 로컬스토리지에 저장
                this.localSave();
                // 다시 출력
                this.drow();
            }
            
        });

        // 수정, 삭제
        this.content.addEventListener("click", e => {
            if(e.target.classList.contains("edit")) {
                this.PopupDelete.classList.remove("active");
                this.PopupEdit.classList.add("active");
                this.target = e.target.dataset.id;
            } else if(e.target.classList.contains("delete")) {
                this.PopupDelete.classList.add("active");
                this.PopupEdit.classList.remove("active");
                this.target = e.target.dataset.id;
            }
        });

        // 추가
        this.PopupAdd.addEventListener("click", e => {
            this.PopupDelete.classList.remove("active");
            this.PopupEdit.classList.add("active");
            this.target = null;
        });

        this.BtnEditBack.addEventListener("click", e => {
            this.PopupEdit.classList.remove("active");
            this.target = null;
        });

        this.BtnEditGo.addEventListener("click", e => {
            this.PopupEdit.classList.remove("active");

            let Newyear = this.Inputdate.value.split("-")[0];
            let Newdate = this.Inputdate.value.split("-")[1] + " . " + this.Inputdate.value.split("-")[2];

            if(this.target != null) {
                this.historys = this.historys.map(history => {
                    if (`${history.year}${history.date}` === `${this.active}${this.target}`) {
                        // 특정 조건에 해당하는 경우 내용 수정
                        return { ...history, text: this.InputText.value, date: Newdate, year: Newyear};
                    } else {
                        return history; // 조건에 해당하지 않는 경우 그대로 반환
                    }
                });
            } else {
                this.historys.push({"year": Newyear, "date": Newdate, "text": this.InputText.value});
                this.years.forEach((year, index) => {
                    if(index + 1 == this.years.length) this.years.push(Newyear);
                });
            }

            this.active = Newyear; // 추가한 년도의 탭 자동선택

            this.localSave();
            this.init();
        });

        this.BtnDeleteBack.addEventListener("click", e => {
            this.PopupDelete.classList.remove("active");
            this.target = null;
        });
        
        this.BtnDeleteGo.addEventListener("click", e => {
            this.PopupDelete.classList.remove("active");

            this.content.querySelectorAll(".history__item").forEach(element => {
                if(this.target == element.dataset.date) element.remove();
            });

            // 삭제된 연혁을 배열에서 삭제
            this.historys = this.historys.filter(history => 
                `${history.year}${history.date}` !== `${this.active}${this.target}`);

            // 저장
            this.localSave();
        });

    }

    localSave() {
        localStorage.setItem('year', JSON.stringify(this.years));
        localStorage.setItem('data', JSON.stringify(this.historys));
        localStorage.setItem('active', JSON.stringify(this.active));
        return;
    }

    reload() {
        let year = [2021, 2020, 2019, 2018, 2017];
    
        localStorage.setItem('year', JSON.stringify(year));

        let data = [
            {"year":2021, "date":"01 . 05", "text":"2021년 1월 연혁1"},
            {"year":2021, "date":"01 . 10", "text":"2021년 1월 연혁2"},
            {"year":2021, "date":"01 . 20", "text":"2021년 1월 연혁3"},
            {"year":2021, "date":"01 . 30", "text":"2021년 1월 연혁4"},
            {"year":2021, "date":"06 . 05", "text":"2021년 6월 연혁1"},
            {"year":2021, "date":"06 . 10", "text":"2021년 6월 연혁2"},
            {"year":2021, "date":"06 . 20", "text":"2021년 6월 연혁3"},
            {"year":2021, "date":"06 . 30", "text":"2021년 6월 연혁4"},
            {"year":2020, "date":"01 . 05", "text":"2020년 1월 연혁1"},
            {"year":2020, "date":"01 . 10", "text":"2020년 1월 연혁2"},
            {"year":2020, "date":"01 . 20", "text":"2020년 1월 연혁3"},
            {"year":2020, "date":"01 . 30", "text":"2020년 1월 연혁4"},
            {"year":2020, "date":"06 . 05", "text":"2020년 6월 연혁1"},
            {"year":2020, "date":"06 . 10", "text":"2020년 6월 연혁2"},
            {"year":2020, "date":"06 . 20", "text":"2020년 6월 연혁3"},
            {"year":2020, "date":"06 . 30", "text":"2020년 6월 연혁4"},
            {"year":2019, "date":"01 . 05", "text":"2019년 1월 연혁1"},
            {"year":2019, "date":"01 . 10", "text":"2019년 1월 연혁2"},
            {"year":2019, "date":"01 . 20", "text":"2019년 1월 연혁3"},
            {"year":2019, "date":"01 . 30", "text":"2019년 1월 연혁4"},
            {"year":2019, "date":"06 . 05", "text":"2019년 6월 연혁1"},
            {"year":2019, "date":"06 . 10", "text":"2019년 6월 연혁2"},
            {"year":2019, "date":"06 . 20", "text":"2019년 6월 연혁3"},
            {"year":2019, "date":"06 . 30", "text":"2019년 6월 연혁4"},
            {"year":2018, "date":"01 . 05", "text":"2018년 1월 연혁1"},
            {"year":2018, "date":"01 . 10", "text":"2018년 1월 연혁2"},
            {"year":2018, "date":"01 . 20", "text":"2018년 1월 연혁3"},
            {"year":2018, "date":"01 . 30", "text":"2018년 1월 연혁4"},
            {"year":2018, "date":"06 . 05", "text":"2018년 6월 연혁1"},
            {"year":2018, "date":"06 . 10", "text":"2018년 6월 연혁2"},
            {"year":2018, "date":"06 . 20", "text":"2018년 6월 연혁3"},
            {"year":2018, "date":"06 . 30", "text":"2018년 6월 연혁4"},
            {"year":2017, "date":"01 . 05", "text":"2017년 1월 연혁1"},
            {"year":2017, "date":"01 . 10", "text":"2017년 1월 연혁2"},
            {"year":2017, "date":"01 . 20", "text":"2017년 1월 연혁3"},
            {"year":2017, "date":"01 . 30", "text":"2017년 1월 연혁4"},
            {"year":2017, "date":"06 . 05", "text":"2017년 6월 연혁1"},
            {"year":2017, "date":"06 . 10", "text":"2017년 6월 연혁2"},
            {"year":2017, "date":"06 . 20", "text":"2017년 6월 연혁3"},
            {"year":2017, "date":"06 . 30", "text":"2017년 6월 연혁4"}
        ];

        localStorage.setItem('data', JSON.stringify(data));

        this.init();
        return;
    }

}

class Phone
{
    constructor() {
        
        // 데이터, 소속부서
        this.datas = new Array();
        this.categorys = new Array();

        // 선택된 탭
        this.active = "전체";

        this.tabs = document.querySelector("#tabs");
        this.content = document.querySelector("#content");

        this.init();
    }

    init() {

        this.load();

        this.event();
    }

    drowTabs() {

        this.tabs.innerHTML = '<div class="tab__item active" data-tab="전체">전체</div>';

        this.categorys.forEach(category => {
            this.tabs.innerHTML += `<div class="tab__item" data-tab="${category.deptNm}">${category.deptNm}</div>`;
        });
    }

    drowList() {

        this.content.innerHTML = '';

        if(this.active == "전체") {
            this.categorys.forEach(category => {
                this.content.innerHTML += `
                    <div class="phone__item">
                        <div class="phone__title">
                            <p class="m-bd">${category.deptNm}</p>
                        </div>
                        <div class="phone__list d-flex flex-wrap">
                        </div>
                    </div>
                `;
                this.datas.items.forEach(value => {
                    if(value.deptNm == category.deptNm) {
                        this.content.lastElementChild.querySelector(".phone__list").innerHTML += `
                            <div class="phone__data d-flex justify-content-between align-items-center">
                                <p class="m">${value.name}</p>
                                <div>
                                    <p>${value.telNo}</p>
                                </div>
                            </div>
                        `;
                    }
                });
            });
        } else {
            this.content.innerHTML += `
                <div class="phone__item">
                    <div class="phone__title">
                        <p class="m-bd">${this.active}</p>
                    </div>
                    <div class="phone__list d-flex flex-wrap">
                    </div>
                </div>
            `;


            this.datas.items.forEach(value => {
                if(value.deptNm == this.active) {
                    this.content.lastElementChild.querySelector(".phone__list").innerHTML += `
                        <div class="phone__data d-flex justify-content-between align-items-center">
                            <p class="m">${value.name}</p>
                            <div>
                                <p>${value.telNo}</p>
                            </div>
                        </div>
                    `;
                }
            });
        }


    }

    event() {

        this.tabs.addEventListener("click", e => {
            if(e.target.classList.contains("tab__item")) {
                this.active = e.target.dataset.tab;
                this.tabs.querySelectorAll(".tab__item").forEach(element => {
                    
                    element.classList.remove("active");
                    
                    if(this.active == element.dataset.tab) {
                        element.classList.add("active");
                    }
                });

                this.drowList();
            
            }
            
        });

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

        return;
    }
}

// 페이지네이션
class Page
{
    constructor(maxPage, nowPage = 1) {

        this.maxPage = maxPage; // 최대 글 수

        this.MaxPageCnt = Math.ceil(this.maxPage / 8); // 최대 페이지 수

        this.nowPage = nowPage; // 현재 페이지

        this.endId = Math.ceil(this.nowPage / 10) * 10; // 마지막 페이지 리스트
        this.satrtId = this.endId - 9; // 첫번째 페이지 리스트

        this.dataSid = (nowPage - 1) * 8; // 현 페이지의 시작 글 id
        this.dataEid = (this.dataSid + 8); // 현 페이지의 마지막 글 id

    }
}

class Situation
{
    constructor() {

        this.pager;

        this.datas = new Array();

        this.content = document.querySelector("#content");
        this.pagerNode = document.querySelector("#pager");
        this.pageName = document.querySelector("#pageName");

        this.pageTarget = 1;

        this.init();
    }

    init() {    

        this.XmlControlLoad();
    }

    drowPager() {
        
        this.pagerNode.innerHTML = '';
        this.pageName.innerHTML = `총 ${this.pager.maxPage}건 [ ${this.pager.nowPage}P / ${this.pager.MaxPageCnt}P ]`;

        if(this.pager.nowPage > 10) {
            this.pagerNode.innerHTML += `
                <div class="page__item type__btn d-flex justify-content-center align-items-center" data-id="start"><<</div>
            `;
        } else {
            this.pagerNode.innerHTML += `
                <div class="page__item type__null d-flex justify-content-center align-items-center" data-id="start"><<</div>
            `;
        }

        if(this.pager.nowPage > 1) {
            this.pagerNode.innerHTML += `
                <div class="page__item type__btn d-flex justify-content-center align-items-center" data-id="left"><</div>    
            `;
        } else {
            this.pagerNode.innerHTML += `
                <div class="page__item type__null d-flex justify-content-center align-items-center" data-id="left"><</div>    
            `;
        }
        
        for(let i = this.pager.satrtId; i <= this.pager.endId; i++) {
            console.log(this.pager.satrtId, this.pager.endId);
            this.pagerNode.innerHTML += `<div class="page__item type__id d-flex justify-content-center align-items-center" data-id="${i}">${i}</div>`;
            if(this.pageTarget == i) this.pagerNode.lastElementChild.classList.add("active");
        }

        if(this.pager.nowPage < this.pager.MaxPageCnt) {
            this.pagerNode.innerHTML += `
                <div class="page__item type__btn d-flex justify-content-center align-items-center" data-id="right">></div>
            `;
        } else {
            this.pagerNode.innerHTML += `
                <div class="page__item d-flex type__null justify-content-center align-items-center" data-id="right">></div>
            `;
        }

        if(this.pager.satrtId < this.pager.MaxPageCnt - 9) {
            this.pagerNode.innerHTML += `
                <div class="page__item type__btn d-flex justify-content-center align-items-center" data-id="end">>></div>    
            `;
        } else {
            this.pagerNode.innerHTML += `
                <div class="page__item type__null d-flex justify-content-center align-items-center" data-id="end">>></div>    
            `;
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
            <li class="d-flex flex-column justify-content-center align-items-center">
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
