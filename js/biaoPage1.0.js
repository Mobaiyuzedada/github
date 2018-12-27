/*
|-------------------------------------------------------
| 将所有按钮都渲染出来然后显示要显示的一部分做法
|-------------------------------------------------------
*/


; (function () {
    'use strict';


    window.biaoPage = {
        boot,
    }


    let default_config = {

    }
    let pageList;
    let onChange;
    function boot(settings) {
        let config = Object.assign({}, settings, default_config);
        console.log(config);

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
        onChange = state.config.onChange;
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
                <button class="prev">上一页</button>
             </span>
            <span class="page-list"></span>
            <span class="shortcuts">
                <button class="next">下一页</button>
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

    /*
    |-------------------------------------------------------
    | 计算按钮总数并全部渲染出来
    |-------------------------------------------------------
    */
    function render(state) {
        let btnTotal = state.page.btnTotal = Math.ceil(state.page.amount / state.page.limit);//计算按钮总数
        let btnStart = state.page.btnStart;//初始开始按钮
        let btnEnd = state.page.btnEnd;//初始结束按钮
        state.page.pageEnd = btnTotal;//吧总页数记录到state.page里
        pageList = state.page.pageList;//要插入的位置


        onChange && onChange(state);

        pageList.innerHTML = '';
        for (let i = 1; i <= btnTotal; i++) {
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

        showBtn(state, btnStart, btnEnd);//初始显示的几个按钮
    }
    /*
    |-------------------------------------------------------
    | 思路：1.首先将全部按钮全部渲染出来(render),
    |       2.将所有按钮都隐藏
    |        3.将要显示的按钮取消隐藏
    |-------------------------------------------------------
    */
    function showBtn(state, btnStart, btnEnd) {
        if (state.page.pageEnd <= state.page.pageLim) {
            return;
        }

        let btns = state.page.buttons;
        btns.forEach(btn => {
            btn.hidden = true;
        })
        if (btnEnd > state.page.pageEnd) {//如果大于总按钮数
            btnEnd = state.page.pageEnd;//结束按钮为最大值
            btnStart = state.page.pageEnd - state.page.pageLim + 1;//开始按钮为最大值减去显示按钮数
        }
        if (btnStart <= 0) {//如果传入的开始按钮小于0
            btnStart = 1;//开始按钮为1
            btnEnd = state.page.pageLim;//结束按钮为显示按钮数
        }
        for (let i = btnStart; i <= btnEnd; i++) {
            btns[i - 1].hidden = false;
        }
    }
    /*
    |-------------------------------------------------------
    | 给整块区域绑定事件
    | 如果点击的是page-list区域，就把state和当前页数返回给用户
    | 如果点击的是首页、上一页、下一页、尾页，就进行相应翻页操作
    | 计算新的按钮开始和结束，通过调用showBtn来显示新一组的按钮
    |-------------------------------------------------------
    */
    function bindEvents(state) {
        state.page.el.addEventListener('click', e => {
            let page = e.target.$page;
            state.page.btnState = e.target;
            if (typeof page === 'number') {
                setCurrentPage(state, page);

            } else {
                pageTurning(state, page);
            }
            onChange && onChange(state);
            // showBtn(state);
            //向后翻页



            let cp = state.page.currentPage;
            state.page.btnStart = cp - Math.floor(state.page.pageLim / 2);//如果有奇数个按钮，那么even/2就是中间按钮左右的按钮数。开始按钮数=目前点击的页面-左侧按钮数
            //如果是偶数个按钮，按这种计算，显示的结果为：|左3|中间|右2|
            state.page.btnEnd = state.page.btnStart + state.page.pageLim - 1;
            showBtn(state, state.page.btnStart, state.page.btnEnd);
        })
    }

    /*
    |-------------------------------------------------------
    | 设置当前点击的页面为[clicked]
    |-------------------------------------------------------
    */
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

    /*
    |-------------------------------------------------------
    | 非主按钮区的四个按钮
    |-------------------------------------------------------
    */
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