/*
|-------------------------------------------------------
| 翻页插件
|-------------------------------------------------------
*/
//默认配置
const Deafult_config = {
    limit: 11,
    current: 1,
}




function start(custom) {
    // let config = Object.assign({}, Deafult_config, custom)
    let config = { ...Deafult_config, ...custom }//es6
    //存放所有的页面相关信息，由prepare准备
    let page = {};
    let state = {
        config,
        page,
    };
    prepare(state);
    init(state);
    bindEvents(state);
    return new Promise((resolve, reject) => {
        resolve(state);
    })
}

function prepare(state) {
    //创建元素
    let el = state.el = document.createElement('div');
    //插入位置
    let insert = state.insert = document.querySelector(state.config.el);
    //计算页数
    state.page.Max = Math.ceil(state.config.amount / state.config.limit);
    //显示的按钮的个数
    state.page.length = parseInt(state.config.limit);
    //当前页
    state.page.current = parseInt(state.config.current);
    el.classList.add('pagination');
    el.innerHTML = `<div class="pageList">
            <span class='shortcuts'><a href="#">&laquo</a></span>
            <span class="primary-buttons">
            </span>
            <span class='shortcuts'><a href="#">&raquo</a></span>
            </div>
        `
    insert.innerHTML = '';
    insert.appendChild(el);
    state.page.insert = el.querySelector('.primary-buttons');
    //缓存上一页、下一页
    state.page.shortcuts = el.querySelectorAll('.shortcuts');
}

//生成页数
function init(state) {
    let max = state.page.Max;//总页数
    let current = state.page.current = state.config.current;//当前页
    let length = state.page.length//显示的按钮个数
    let left = Math.max(1, current - Math.floor(Number(length) / 2));//启始页


    //根据left生成length个按钮，范围是[left,left+length]
    let pages = new Array(length)
        .fill(0)
        .map((dummy, index) => index + left)
        .filter(i => i <= max);

    //当left+length>max的时候，即，pages里的个数少于length的时候，补全缺失的部分
    if (pages.length < Number(length)) {
        const padCount = Number(length) - pages.length;//计算缺少页数
        const missing = pages[0] - padCount;//从多少页开始缺失的
        let missingPages = new Array(padCount)
            .fill(0)
            .map((dummy, index) => missing + index)
            .filter(el => el > 0);
        pages = [...missingPages, ...pages];//完整的pages
    }
    //按要求显示按钮个数
    //处理左侧省略
    //pages[0]==left,即左端点为2时候,current已经到了中间:current=left+Math.floor(Number(length) / 2)
    if (pages[0] && pages[0] > 1) {
        pages.shift();//删除左侧一页
        pages.unshift(null);//添加左侧省略页数标识
        pages.unshift(1);//添加左侧首页
    }
    //处理右侧省略
    if (pages[pages.length - 1] < Number(max)) {
        pages.pop();
        pages.push(null);
        pages.push(Number(max));
    }
    state.page.pages = pages;//记录到state.page
    render(state);
}
//渲染到html
function render(state) {
    let pages = state.page.pages;
    let current = state.page.current;
    let insert = state.page.insert;//插入位置

    insert.innerHTML = '';
    pages.forEach(page => {
        if (!page) {
            let span = document.createElement('span');
            span.innerHTML = '...';
            insert.appendChild(span);
            return;
        }
        let btn = document.createElement('a');
        btn.href = `#`;
        btn.innerHTML = page;
        insert.appendChild(btn);
        //把按钮上的页数记录在当前按钮中
        btn.$page = page;
        if (current == page) {
            btn.classList.add('active');
        }
    })
    state.page.buttons = insert.querySelectorAll('a');
}
function bindEvents(state) {
    state.el.addEventListener('click', e => {
        let et = e.target;
        let page = et.$page;
        if (page) {
            setCurrent(state, page);
        }
        if (et.innerHTML == "«") {
            setCurrent(state, state.page.current - 1);
        } else if (et.innerHTML == "»") {
            setCurrent(state, state.page.current + 1);
        }
    })
}
function setCurrent(state, page) {
    if (page < 1)
        return setCurrent(state, 1);
    if (page > state.page.Max)
        return setCurrent(state, state.page.Max);
    state.page.current = page;
    state.page.buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.$page == page)
            btn.classList.add('active');
    })
    // //返回给用户组件的状态和当前页
    let onChange = state.config.onChange;
    onChange && onChange(state.page.current, state);
}

export default {
    start, init
};


