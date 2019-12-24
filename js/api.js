var base_url = "https://readerapi.codepolitan.com/";

//akan dipanggil pas fetch ok
function status(response) {
    if (response.status != 200) {
        console.log("Error :" + response.status);

        //method reject buat catch dipanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        //ubah objek jadi promise supaya bisa pake then 
        return Promise.resolve(response);
    }
}

//untuk parse json jadi array js
function json(response) {
    return response.json();
}

function error(error) {
    //parameter berasal dari promise.reject()
    console.log("Error : " + error);
}

//untuk request data json
function getArticles() {
    if ('caches' in window) {
        caches.match(base_url + "articles").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    var articlesHTML = "";
                    data.result.forEach(function (article) {
                        articlesHTML += `
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

                    document.getElementById("articles").innerHTML = articlesHTML;
                })
            }
        })
    }

    fetch(base_url + "articles")
        .then(status)
        .then(json)
        .then(function (data) {
            //obj atau array js dari response.json() masuk lewat data.

            //susun komponen card secara dinamis

            var articlesHTML = "";
            console.log(data.result);
            data.result.forEach(function (article) {
                console.log(article);
                articlesHTML += `
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
            console.log(document.getElementById("articles"));
            document.getElementById("articles").innerHTML = articlesHTML;
        })
        .catch(error);
}

function getArticleById() {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
        caches.match(base_url + "article/" + idParam).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    var articleHTML = `
              <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${data.result.cover}" />
                </div>
                <div class="card-content">
                  <span class="card-title">${data.result.post_title}</span>
                  ${snarkdown(data.result.post_content)}
                </div>
              </div>
            `;
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("body-content").innerHTML = articleHTML;
                });
            }
        });
    }

    fetch(base_url + "article/" + idParam)
        .then(status)
        .then(json)
        .then(function (data) {
            // Objek JavaScript dari response.json() masuk lewat variabel data.
            console.log(data);
            // Menyusun komponen card artikel secara dinamis
            var articleHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.result.cover}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.result.post_title}</span>
                ${snarkdown(data.result.post_content)}
              </div>
            </div>
          `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;
        });
}