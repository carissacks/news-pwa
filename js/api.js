var base_url= "https://readerapi.codepolitan.com/";

//akan dipanggil pas fetch ok
function status(response){
    if(response.status!=200){
        console.log("Error :" + response.status);

        //method reject buat catch dipanggil
        return Promise.reject(new Error(response.statusText));
    }else{
        //ubah objek jadi promise supaya bisa pake then 
        return Promise.resolve(response);
    }
}

//untuk parse json jadi array js
function json(response){
    return response.json();
}

function error(error){
    //parameter berasal dari promise.reject()
    console.log("Error : "+error);
}

//untuk request data json
function getArticles(){
    fetch(base_url + "articles")
        .then(status)
        .then(json)
        .then(function(data){
            //obj atau array js dari response.json() masuk lewat data.
            
            //susun komponen card secara dinamis

            var articlesHTML="";
            data.result.forEach(function (article){
                articlesHTML+= `
                    <div class="card">
                        <a href="./article.html?id=${article.id}">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${article.thumbnail}"/>
                            </div>
                        </a>
                        <div class="card-content">
                            <span class="card-title truncate">${article.title}</span>
                            <p>${article.description}</p>
                        </div>
                    </div>
                `;
            });

            //masukkin card ke id content
            document.getElementById("articles").innerHTML= articlesHTML;
        })
        .catch(error);
}

function getArticleById(){
    //ambil nilai query parameter (?id=)
    var urlParams= new URLSearchParams(window.location.serach);
    var idParam= urlParams.get("id");

    fetch(base_url + "article/" +idParam)
        .then(status)
        .then(json)
        .then(function(data){
            //obj js dari response.json masuk lewat var data
            console.log(data);

            // menyusun komponen card artikel secara dinamis
            var articlesHTML= `
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${data.result.cover}"/>
                    </div>
                    <div class="card-content">
                        <span class="card-title">${data.result.post_title}</span>
                        ${snarkdown(data.result.post_content)}
                    </div>
                </div>
            `;

            //sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML= articlesHTML;
        });
}