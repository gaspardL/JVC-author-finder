var topic = {};
var page;
var posts;

function process(){
    getAllTopics().then(items => {
        console.log(items);
    });

    // Contrôle si la sentence 410 n'a pas frappé
    if(document.querySelector("img.img-erreur") != null) return;

    // Récupère des infos de l'url
    parseUrl(window.location.pathname);

    getSavedTopic(topic.id).then((res) => {
        posts = document.querySelectorAll(".bloc-message-forum");

        // Si le topic n'est pas en mémoire
        if(res == null){
            // On vérifie qu'il s'agit bien de la première page du topic
            if(page != "1"){
                authorNotFound();
                return;
            }

            getTopicTitle();
            topic.author = {};
            getAuthorName();
            topic.author.posts = {};
        }else{
            topic = res;
        }

        topic.visitedTime = new Date().getTime();

        // On effectue la recherche des posts de l'auteur si ils n'ont pas encore été trouvés ou si la page actuelle était précédemment incomplète
        if(topic.author.posts[page] == undefined || topic.uncompletePage == page){
            getAuthorPosts();
            if(posts.length < 20){
                topic["uncompletePage"] = page;
            } else {
                delete topic["uncompletePage"];
            }
        }
        updateTopic(topic.id, topic);

        //location.href = '#post_'+topic.author.posts[page][0];
    
        colorAuthorPosts();

        // console.log("topic : ", topic);

        getNextPages();
 
    });
}

function getNextPages(){
    var ipage = parseInt(page);
    var dashTab = topic.url.split('-');
    topic.id = dashTab[2];
    dashTab[3] = ipage + 1;
    var url = dashTab.join("-");

    callPage(url).then((res) => {
        res = res.substring(res.indexOf('<div class="conteneur-messages-pagi">'));
        var doc = new DOMParser().parseFromString(res, "text/html");
        console.log("brut : ", res);
        console.log("doc : ", doc);
    })
    .catch((err) => {
        console.log("Error while requeting next pages : ", err);
    });
}


function parseUrl(pathname){
    topic.url = pathname.split('/')[2];
    var dashTab = topic.url.split('-');
    topic.id = dashTab[2];
    page = dashTab[3];
}

function authorNotFound(){
    var bloc = document.querySelector("div.bloc-outils-top");
    var para = document.createElement("p");
    var message = document.createTextNode("JVC author finder : L'auteur du topic n'as pas été trouvé. Pour le récupérer, retourner à la première page.");
    para.appendChild(message);
    para.style.border = "2px solid black";
    para.style.backgroundColor = "red";
    para.style.textAlign = "center";
    para.style.color = "white";
    document.querySelector("#forum-main-col").insertBefore(para, bloc);
}

function getTopicTitle(){
    topic.title = document.getElementById("bloc-title-forum").innerHTML;
}

function getAuthorName(){
    var authorLink = posts[0].querySelector(".bloc-pseudo-msg");
    topic.author.pseudo = authorLink.innerHTML.trim();
    topic.author.url = authorLink.href;
}

function getAuthorPosts(){
    topic.author.posts[page] = [];
    document.querySelectorAll(".bloc-pseudo-msg[href='"+topic.author.url+"']").forEach((i) => {
        topic.author.posts[page].push(i.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id"));
    });
}

function colorAuthorPosts(){
    getChosenColor().then(color => {
        topic.author.posts[page].forEach((i) => {
            document.querySelector(".bloc-message-forum[data-id='"+i+"']").style.backgroundColor = color;
        });
    });
    
}

console.log("content_script injected");
process();
