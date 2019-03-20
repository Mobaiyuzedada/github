// document.write('<script src="./lib/rq.js"></script>');
let form = document.getElementById('search-form');
let input = form.querySelector('[name=keyword]');
let userList = document.querySelector('.user-list');
// let $ = rq;
import $ from '../lib/rq';
import pagination from '../lib/pagination';
let pageLimit = 30;//每页显示的用户数
let load;



function start() {
    bindEvents();
}
function bindEvents() {
    form.addEventListener('submit', e => {
        e.preventDefault();
        let keyWord = input.value;
        search(keyWord);
    })
    function search(keyWord, current = 1) {
        if (!keyWord) {
            alert('请输入搜索内容');
            return;
        }
        userList.innerHTML = '';
        renderLoad();
        let url = `https://api.github.com/search/users?q=${keyWord}&page=${current}&per_page=${pageLimit}`;
        // let pagina = document.getElementById('pagination');
        // pagina.innerHTML = '';
        $.get(url).then(data => {

            //创建翻页组件
            pagination.start({
                limit: 7,
                amount: data.total_count > 1000 ? 1000 : data.total_count,
                el: '.footer',
                current,
                onChange(page) {
                    if (current == page)
                        return;
                    current = page;
                    search(keyWord, current);
                }
            }).then(state => {
                renderPageTip(state);
            })
            load.hidden = true;
            render(data);
        });
    }
    function renderLoad() {
        load = document.createElement('div');
        load.innerHTML = '';
        load.classList.add('loading');
        load.innerHTML = `
                <i class="fa fa-spinner fa-spin"></i>数据加载中
            `
        userList.prepend(load);
    }
    function render(data) {
        renderResultTip(data);
        renderUsers(data);
    }

    function renderResultTip(data) {
        let result = document.createElement('div');
        let total = data.total_count;
        result.classList.add('result-count');
        result.innerHTML = `
                <p>
                    共<strong>${total}</strong>条搜索结果，可显示<strong>${total > 1000 ? 1000 : total}</strong>条搜索结果
                </p>
            `
        userList.appendChild(result);
    }
    function renderUsers(data) {
        let users = data.items;
        users && users.forEach(user => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <div class="avatar">
                    <img src=${user.avatar_url} alt="用户头像">
                </div>
                <div class="detail">
                    <strong><a target="_blank" href=${user.html_url}>${user.login}</a></strong>
                    <div><a target="_blank" href=${user.html_url}>${user.html_url}</a></div>
                </div>
                `
            userList.appendChild(item);
        })
    }
    function renderPageTip(state) {
        let insert = state.el;
        let tip = document.createElement('div');
        tip.classList.add('page-tip');
        tip.innerHTML = `
            <span>共<strong>${state.page.Max}</strong>页 &nbsp &nbsp &nbsp当前在第<strong>${state.page.current}</strong>页</span>
            `
        insert.prepend(tip);
    }
}
export default {
    start
}