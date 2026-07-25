document.addEventListener("DOMContentLoaded", ()=>{
    let logout = document.querySelector("#logout");
    logout.addEventListener("click", ()=>{
        window.location.href = logout.dataset.url;
    });
    
    let back = document.querySelector("#bak span");
    back.addEventListener("click", ()=>{
        window.location.href = back.dataset.url;
    });
});