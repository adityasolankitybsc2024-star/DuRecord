document.addEventListener("DOMContentLoaded", ()=>{
    let logout = document.querySelector("#logout");
    logout.addEventListener("click", ()=>{
        window.location.href = logout.dataset.url;
    });
    
    let back = document.querySelector("#bak span");
    back.addEventListener("click", ()=>{
        window.location.href = back.dataset.url;
    });

    let edit = document.querySelector("#edit span");

    let form = document.querySelector("form");
    let FormSubmit = ()=>{
        let formdata = new FormData(form);
        fetch(edit.dataset.url, {method:"POST", body:formdata, headers:{"X-CSRFToken":form.querySelector("[name=csrfmiddlewaretoken]").value}}).then(response=>response.json()).then((data)=>{
            let status =  data.status;
            let message = data.message;

            alert(message);

            if (status === "success") {
                window.location.href = data.redirect;
            }
            
        })
        .catch((error)=>{
            alert("Something went wrong. Check the Console.");
            console.log(error);
        });
    };

    if (form) {
        form.addEventListener("submit", (event)=>{
            event.preventDefault();
            FormSubmit();
        });
    }

    edit.addEventListener("click", (event)=>{
        if (edit.dataset.type === "view") {
            window.location.href = edit.dataset.url;
        }
        else {
            event.preventDefault();
            FormSubmit();
        }
    });
});