
function get(url) {
    return new Promise((resolve, reject) => {
        send(url, 'get').then(data => {
            resolve(data);
        })
    })
}
function post(url, params) {
    return new Promise((res, rej) => {
        params = JSON.stringify(params);
        send(url, 'post', params)
            .then(data => res(data))
            .catch(err => rej(err))
    })
}
function send(url, type, params) {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        http.open(type, url, true);
        http.setRequestHeader('Content-Type', 'application/json');
        http.send(params);
        http.addEventListener('load', () => {
            let data = JSON.parse(http.responseText);
            resolve(data);
        })
    })
}

export default {
    post, get
};