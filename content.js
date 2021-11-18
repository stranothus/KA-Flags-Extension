function setListFlags(idk, observer) {
    let onLoad = window.setInterval(() => {
        console.log(true);
        var programs = document.getElementsByClassName("_eof4m4b");

        if(programs.length) {
            window.clearInterval(onLoad);
            for(var i = 0; i < programs.length; i++) {
                if(programs[i].getElementsByClassName("_kt2szrr")[0].textContent.includes("Flag")) {
                    continue;
                }
                var link = programs[i].getElementsByTagName("a")[0].href;

                var id = link.split("/")[link.split("/").length - 1];

                programs[i].dataset.id = id;
                
                function update(id, x) {
                    fetch("https://www.khanacademy.org/api/internal/scratchpads/" + id)
                    .then(response => response.json())
                    .then(data => {
                        var programs = document.getElementsByClassName("_eof4m4b");
            
                        for(var i = 0; i < programs.length; i++) {
                            if(Number(programs[i].dataset.id) === data.id) {
                                if(programs[i].getElementsByClassName("_kt2szrr")[0].textContent.includes("Flag")) {
                                    break;
                                }
                                programs[i].getElementsByClassName("_kt2szrr")[0].textContent = `${data.sumVotesIncremented + (data.sumVotesIncremented === 1 ? " Vote" : " Votes")} ${data.spinoffCount + (data.spinoffCount === 1 ? " Spin-Off" : " Spin-Offs")} ${data.flags.length + (data.flags.length === 1 ? " Flags" : " Flags")}`;
                                x(data.id, x);
                                break;
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }

                update(id, update);
            }
        }
    }, 1);
}

function programFlags() {
    let id = window.location.href.split("/").reverse()[0].replace(/\?\S*/, "").replace(/\D/g, "");

    if(id) {
        fetch("https://www.khanacademy.org/api/internal/scratchpads/" + id)
        .then(response => response.json())
        .then(data => {
            var checkLoad = window.setInterval(() => {
                if(document.getElementsByClassName("_wmull6").length > 0) {
                    window.clearInterval(checkLoad);

                    var beforeNode = document.getElementsByClassName("_wmull6")[0];

                    var flagBox = document.createElement("ul");

                    var flags = data.flags;

                    for(var i = 0; i < flags.length; i++) {
                        var flagElement = document.createElement("li");

                        var p = document.createElement("p");

                        p.classList.add("flag");

                        p.textContent = flags[i];

                        flagElement.appendChild(p);

                        flagBox.appendChild(flagElement);
                    }

                    beforeNode.parentNode.insertBefore(flagBox, beforeNode.nextSibling);
                }
            })
        })
        .catch(err => {
            console.log(err);
        });
    }
}

function postFlags() {
    let id = window.location.href.split("/").reverse()[0].replace(/\?\S*/, "").replace(/\D/g, "");

    let timer = setInterval(() => {
        let postsCont = document.getElementsByClassName("_3p5c27i");

        if(postsCont.length) {
            clearInterval(timer);
            let observePosts = new MutationObserver(async () => {
                let posts = document.querySelectorAll("._1t544yo9");
                let tab = ["questions", "comments", "projectfeedback"][["Questions", "Tips & Thanks", "Help Requests"].indexOf(document.querySelector("._1jd6hj4p").textContent)];

                if(posts.length) {
                    let data = (await fetch("https://www.khanacademy.org/api/internal/discussions/scratchpad/" + id + "/" + tab + "?limit=" + posts.length).then(response => response.json())).feedback;

                    if(tab !== "comments") {
                        data = data.map(e => [e, ...e.answers]).flat(1);
                    }

                    posts.forEach(async e => {
                        let links = e.querySelectorAll("._dwmetq");
                        if(!links.length) return;
                        let qa_expand_key = links[2].href.replace(/^[\S]+qa_expand_key=/, "");
                        let flagModel = e.querySelector("._cjmzx82");
                        if(!(flagModel.parentElement.textContent.indexOf("flags") + 1)) {
                            let info = data.filter(e => e.expandKey === qa_expand_key)[0];

                            let flags = info.flags;

                            let element = document.createElement("span");
                            element.classList.add("_nfki200");
                            element.textContent = `(${flags.length} flags)`;

                            flagModel.before(element);
                        }

                        let commentCont = e.querySelector("._144t4sy");
                        if(!commentCont) return;
                        let commentList = commentCont.querySelector("._1bjanhbe");
                        if(!commentList) return;
                        let comments = commentList.querySelectorAll("._1bjanhbe");

                        if(comments.length) {
                            let data = await fetch("https://www.khanacademy.org/api/internal/discussions/" + qa_expand_key + "/replies?limit=" + comments.length).then(response => response.json());

                            comments.forEach(e => {
                                let links = e.querySelectorAll("._dwmetq");
                                if(!links.length) return;
                                let qa_expand_key = links[2].href.replace(/^[\S]+qa_expand_key=/, "");
                                let flagModel = e.querySelector("._cjmzx82");
                                console.log(qa_expand_key, flagModel);
                                if(flagModel.parentElement.textContent.indexOf("flags") + 1) return;
        
                                let info = data.filter(e => e.expandKey === qa_expand_key)[0];
        
                                let flags = info.flags;
        
                                let element = document.createElement("span");
                                element.classList.add("_nfki200");
                                element.textContent = `(${flags.length} flags)`;
        
                                flagModel.before(element);
                            });
                        }
                    });
                }
            });
            observePosts.observe(postsCont[0], { childList: true, subtree: true });
        }
    });
}

if(window.location.href.includes("/projects") || window.location.href.includes("/computer-programming")) {
    let observeList = new MutationObserver(setListFlags);
    let onLoad = window.setInterval(() => {
        if(document.getElementsByClassName("_xu2jcg")[1]) {
            window.clearInterval(onLoad);
            observeList.observe(document.getElementsByClassName("_xu2jcg")[1], { childList : true });
        }
    }, 1);
    programFlags();
    postFlags();
}