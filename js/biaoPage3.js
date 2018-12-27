; (function () {
    'use strict';


    window.biaoPage = {
        boot,
    }

    let default_config = {

    }
    let pageList;
    function boot(settings) {
        let config = Object.assign({}, settings, default_config);

        let state = {
            config,//配置信息
            currentPage: config.currentPage,//当前页
            page: {
                root: document.querySelector(config.selector),
                amount: config.amount,
                limit: config.limit,
                pageLim: config.pageLim,
                currentPage: config.currentPage,
                btnStart: config.currentPage,
                btnEnd: config.pageLim,
            },//用于存储页面信息
        }
        console.log(state);
        prepare(state);
        render(state);
        bindEvents(state);
    }

    function prepare(state) {
        let el = document.createElement('div');
        el.classList.add('biao-page');
        el.innerHTML = `
            <span class="shortcuts">
                <button class="start">首页</button>
            </span>
            <span class="shortcuts">
                <button class="prev">上一页</button>
            </span>
            <span class="page-list"></span>
            <span class="shortcuts">
                <button class="next">下一页</button>
            </span>
            <span class="shortcuts">
                <button class="end">尾页</button>
            </span>
        `
        state.page.pageList = el.querySelector('.page-list');
        state.page.root.appendChild(el);
        state.page.el = el;
        // state.page.start = el.querySelector('.start');
        // state.page.end = el.querySelector('.end');
        // state.page.prev = el.querySelector('.prev');
        // state.page.next = el.querySelector('.next');
    }

    function render(state) {
        let btnTotal = state.page.btnTotal = Math.ceil(state.page.amount / state.page.limit);
        let btnStart = state.page.btnStart;
        let btnEnd = state.page.btnEnd;
        let pageLim = state.page.pageLim;
        state.page.pageEnd = btnTotal;
        pageList = state.page.pageList;

        pageList.innerHTML = '';
        console.log(btnStart, btnEnd);
        for (let i = btnStart; i <= btnEnd; i++) {
            let btn = document.createElement('button');
            btn.innerText = i;
            btn.$page = i;
            btn.classList.add('biao-page-item');

            if (state.currentPage === i) {
                btn.classList.add('clicked');
            }
            pageList.appendChild(btn);
            state.page.buttons = document.querySelectorAll('.biao-page-item');
        }
    }
    function hideBtn(state) {

    }
    function bindEvents(state) {
        state.page.el.addEventListener('click', e => {
            let page = e.target.$page;
            state.page.btnState = e.target;
            if (typeof page === 'number') {
                let onChange = state.config.onChange;
                setCurrentPage(state, page);
                console.log(state.page.currentPage);
                onChange && onChange(page, state);
            } else {
                pageTurning(state, page);
            }

            //向后翻页
            if (state.page.currentPage === state.page.btnEnd) {
                let cp = state.page.currentPage;
                state.page.btnStart = cp - Math.floor(state.page.pageLim / 2);
                state.page.btnEnd = state.page.btnStart + state.page.pageLim - 1;
                render(state);
            }

        })
    }

    function setCurrentPage(state, page) {
        let btns = state.page.buttons;
        state.page.currentPage = page;
        btns.forEach(btn => {
            if (btn.$page != page) {
                btn.classList.remove('clicked');
                return;
            }
            btn.classList.add('clicked');
        })
    }

    function pageTurning(state, page) {
        page = state.page.btnState;
        switch (page.textContent) {
            case '首页':
                page = state.page.currentPage = 1;
                setCurrentPage(state, page);
                break;
            case '尾页':
                page = state.page.currentPage = state.page.pageEnd;
                setCurrentPage(state, page);
                break;
            case '上一页':
                if (state.page.currentPage === 1)
                    return;
                page = state.page.currentPage -= 1;
                setCurrentPage(state, page);
                break;
            case '下一页':
                if (state.page.currentPage === state.page.pageEnd)
                    return;
                page = state.page.currentPage += 1;
                setCurrentPage(state, page);
                break;
        }
    }
})();