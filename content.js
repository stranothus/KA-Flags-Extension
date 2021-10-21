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
    let id = window.location.href.split("/").reverse()[0].replace(/\D/g, "");

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

if(window.location.href.includes("/projects") || window.location.href.includes("/computer-programming")) {
    let observeList = new MutationObserver(setListFlags);
    let onLoad = window.setInterval(() => {
        if(document.getElementsByClassName("_xu2jcg")[1]) {
            window.clearInterval(onLoad);
            observeList.observe(document.getElementsByClassName("_xu2jcg")[1], { childList : true });
        }
    }, 1);
    
    programFlags();
}
