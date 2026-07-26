document.addEventListener("DOMContentLoaded", ()=>{
    let back = document.querySelector("#Back");
    back.addEventListener("click", ()=>{
        window.location.href = back.dataset.url;
    });

    let edit = document.querySelector("#Edit span");
    if (edit.textContent.trim() === "Edit?") {
        edit.addEventListener("click", ()=>{
            window.location.href = edit.dataset.url;
        });
    }
    else {
        let Forms = document.querySelectorAll("form");
        let FormSubmit = ()=>{
            let Newdata = new FormData()
            Forms.forEach((Form)=>{
                let inputs = Form.querySelectorAll("input, textarea");
                inputs.forEach((inp)=>{
                    Newdata.append(inp.name, inp.value);
                });
            });    

            fetch(edit.dataset.url, {method:"POST", body:Newdata, headers:{"X-CSRFToken":document.querySelector("[name=csrfmiddlewaretoken]").value}}).then(res=>res.json()).then((data)=>{
                let status = data.status;
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

        Forms.forEach((Form)=>{
            Form.addEventListener("submit", (event)=>{
                event.preventDefault();
                FormSubmit();
            });
        });

        edit.addEventListener("click", (event)=>{
            event.preventDefault();
            FormSubmit();
            
        });
    }

});