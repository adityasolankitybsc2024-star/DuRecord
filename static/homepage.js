document.addEventListener("DOMContentLoaded", ()=>{
    let bodies = document.querySelectorAll(".body");
    let loginbody = Array.from(bodies).find((body => body.querySelector("h1").textContent.trim() === "Login"));
    let registerbody = Array.from(bodies).find((body => body.querySelector("h1").textContent.trim() === "Register"));
    let loading = document.querySelector("#loading");

    if (registerbody) {
        registerbody.style.display = "none";
        registerbody.style.visibility = "hidden";
        registerbody.style.opacity = "0";
    }

    let addLoading = ()=>{
        loading.style.display = "flex";
        loading.style.visibility = "visible";
        loading.style.opacity = "1";
    };

    let removeLoading = ()=>{
        loading.style.visibility = "hidden";
        loading.style.opacity = "0";
        setTimeout(()=>{
            loading.style.display = "none";
        }, 300);
    };

    bodies.forEach((body)=>{
        let change = body.querySelector("#change");
        change.addEventListener("mouseenter", ()=>{
            change.style.transition = "color 300ms linear";
            change.style.color = "greenyellow";
            change.style.cursor = "pointer";
        });
        
        change.addEventListener("mouseleave", ()=>{
            change.style.transition = "color 300ms linear";
            change.style.color = "orange";
        });

        let toggle = ()=>{
            if(getComputedStyle(loginbody).display === "none") {
                registerbody.style.transition = "visibility 300ms linear, opacity 300ms linear";
                loginbody.style.transition = "visibility 300ms linear, opacity 300ms linear";
                registerbody.style.visibility = "hidden";
                registerbody.style.opacity = "0";
                setTimeout(()=>{
                    registerbody.style.display = "none";
                    loginbody.style.display = "grid";
                    loginbody.style.visibility = "visible";
                    loginbody.style.opacity = "1";
                }, 300);
            }
            else {
                loginbody.style.transition = "visibility 300ms linear, opacity 300ms linear";
                registerbody.style.transition = "visibility 300ms linear, opacity 300ms linear";
                loginbody.style.visibility = "hidden";
                loginbody.style.opacity = "0";
                setTimeout(()=>{
                    loginbody.style.display = "none";
                    registerbody.style.display = "grid";
                    registerbody.style.visibility = "visible";
                    registerbody.style.opacity = "1";
                }, 300);
            }
        };

        change.addEventListener("click", ()=>{toggle()});

        let button = body.querySelector("button");
        let form = body.querySelector("form");

        let submitform = (fom, but)=>{
            let formData = new FormData(fom);
            let location = but.dataset.url;
            let inpu = fom.querySelectorAll(".inpu input, .inpu textarea");
            if (!fom.checkValidity()) {
                alert("Please fill all required fields.");
                return;
            }
            
            if (but.textContent.trim() === "Register") {
                addLoading();
                console.log("Addloading called");
                fetch(location, {method:"POST", body:formData, headers:{"X-CSRFToken":fom.querySelector("[name=csrfmiddlewaretoken]").value}}).then(res => res.json()).then((data)=>{
                    let status = data.status;
                    let message = data.message;
                    
                    if (status === "success") {
                        alert(message);
                        toggle();
                    }
                    else {
                        alert(message);
                        inpu.forEach((i)=>{
                            i.value = "";
                        });
                    }
                    removeLoading();
                })
                .catch((error)=>{
                    console.log(error);
                    alert("Some error occurred, look at console");
                    removeLoading();
                });
            }
            else {
                addLoading();
                console.log("Addloading called");
                fetch(location, {method:"POST", body:formData, headers:{"X-CSRFToken":fom.querySelector("[name=csrfmiddlewaretoken]").value}}).then(response=>response.json()).then((data)=>{
                    let status = data.status;
                    let message = data.message;
                    
                    alert(message);
                    if (status === "success") {
                        window.location.href = data.redirect;
                    }
                    else {
                        inpu.forEach((i)=>{
                            i.value = "";
                        });
                    }
                    removeLoading();
                })
                .catch(error=>{
                    console.log(error);
                    alert("Some error occured, look at console");
                    removeLoading();
                });
            }
        };
        
        form.addEventListener("submit", (event)=>{
            event.preventDefault();
            submitform(form, button);
        });
        
    });
    
    let Profile = document.querySelector("#UserProfile");
    Profile.addEventListener("click", ()=>{
        window.location.href = Profile.dataset.url;
    });
    
    let AddEntry = document.querySelector(".A form");
    let button = AddEntry.querySelector("button");
    
    let Adding = (fom, butt)=>{
        let formData = new FormData(fom);
        addLoading()
        console.log("Addloading called");
        fetch(button.dataset.url, {method:"POST", body:formData, headers:{"X-CSRFToken":fom.querySelector("[name=csrfmiddlewaretoken]").value}}).then(res=>res.json()).then((data)=>{
            let status = data.status;
            let message = data.message;

            alert(message);
            if (status === "success") {
                window.location.href = data.redirect;
            }
            else {
                let inputs = fom.querySelectorAll(".inpu input");
                inputs.forEach((inp)=>{
                    inp.value = "";
                });
            }
            removeLoading();
        })
        .catch((error)=>{
            alert("Something Went Wrong. Look at the Console.");
            console.log(error);
            removeLoading();
        });
    };
    
    AddEntry.addEventListener("submit", (e)=>{
        e.preventDefault();
        Adding(AddEntry, button);
    });
    
    let UniqueDatas = document.querySelectorAll("main table tbody tr");
    UniqueDatas.forEach((UD)=>{
        UD.addEventListener("click", (event)=>{
            let editbutton = UD.querySelector(".edit");
            if (editbutton.contains(event.target)) {
                window.location.href = editbutton.dataset.url;
            }
            else {
                window.location.href = UD.dataset.url;
            }
        });
    });

    let sentences = document.querySelectorAll(".workdone");
    sentences.forEach((sentence)=>{
        let Sentence = sentence.textContent;
        if (Sentence.length >= 35) {
            let replace = "...";
            let acceptable = Sentence.substring(0, 35);
            sentence.textContent = acceptable + replace;
        }
    });
});