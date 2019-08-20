let xhr = new XMLHttpRequest();

xhr.open("GET", "https://swapi.co/api/films/");

xhr.send();

xhr.onload = function () {
    if (xhr.status !== 200) {
        alert(`Something went wrong\n ${xhr.status}: ${xhr.statusText}`);
    } else {
        try {
            let response = JSON.parse(xhr.response);
            const container = document.getElementById("container");
            let liList = response.results.map(movie => `<li class="movie-li"><span class="movie-li-title">Episode number :</span> ${movie.episode_id}<br><span class="movie-li-title"> Title: </span>${movie.title}<br> <span class="movie-li-title">Summary: </span>${movie.opening_crawl}<br> <a class="movie-a" id="chars" href="#" data-id="${movie.episode_id}">Characters</a></li>`).join('');
            liList = `<ul class="movie-ul">${liList}</ul>`;
            const loader = document.getElementById('overlay');
            loader.style.display = 'none';
            container.innerHTML += liList;

            container.addEventListener('click', function (e) {
                if (e.target && e.target.id === 'chars') {
                    const loader = document.getElementById('overlay');
                    loader.style.display = 'block';
                    console.log(window.pageYOffset);
                    loader.style.top = `${window.pageYOffset}px`;
                    e.preventDefault();
                    const id = e.target.getAttribute('data-id');
                    const characters = response.results.find(res => res.episode_id == id).characters;
                    const characterByFilm = [];
                    let fetch = new Promise((resolve, reject) => {
                        characters.forEach((character, i) => {
                            let xhr2 = new XMLHttpRequest();
                            xhr2.open("GET", character);
                            xhr2.send();
                            xhr2.onload = function () {

                                characterByFilm[i] = JSON.parse(xhr2.response);

                                if (characterByFilm.length == characters.length) {
                                    resolve({success: true, data: characterByFilm});
                                    loader.style.display = 'none';
                                }
                            };
                            xhr2.onprogress = function (event) {
                                console.log(event.loaded);
                                //const loader = document.getElementById('overlay');
                                //loader.style.display = 'inline-block';
                            };
                            xhr2.onerror = function () {
                                reject({success: false, data: xhr2.error});
                            };
                        });
                    });
                    fetch.then(response => {
                        if (response.success) {
                            const parent = e.target.parentElement;
                            parent.removeChild(e.target);
                            const parsedCharsArr = response.data;
                            parsedCharsArr.forEach(parsedChars => {
                                let charDiv = document.createElement('div');
                                charDiv.classList.add('characters');
                                let charExtraInfoDiv = document.createElement('div');
                                charExtraInfoDiv.classList.add('characters-extraInfo');
                                Object.keys(parsedChars).forEach(prop => {
                                    if (parsedChars[prop] != null && parsedChars[prop].length > 0) {
                                        console.log(parsedChars[prop]);
                                        let p = document.createElement("p");
                                        if (typeof parsedChars[prop] == 'object') {
                                            parsedChars[prop] = parsedChars[prop].map(item => `<a href="${item}">${item}</a><br>`).join('');
                                            p.innerHTML = `<span class="movie-li-title"> ${prop}:</span><br>${parsedChars[prop]}`;
                                        } else if (parsedChars[prop].includes('http')) {
                                            p.innerHTML = `<span class="movie-li-title"> ${prop}:</span><br><a href="${parsedChars[prop]}">${parsedChars[prop]}</a>`;
                                        } else {
                                            p.innerHTML = `<span class="movie-li-title"> ${prop}: </span>${parsedChars[prop]}`;
                                        }
                                        if (prop === 'name') {
                                            p.classList.add("characters-name");
                                            charDiv.appendChild(p);
                                        } else charExtraInfoDiv.appendChild(p);

                                    }
                                });

                                let showMore = document.createElement('a');
                                showMore.classList.add("characters-showMore");
                                showMore.setAttribute('href', "#");
                                showMore.setAttribute('data-clicked', '0');
                                showMore.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    if (e.target.getAttribute('data-clicked') == '0') {
                                        e.target.style.transform = 'rotate(180deg)';
                                        e.target.setAttribute('data-clicked', '1');
                                        e.target.nextSibling.style.display = 'block';
                                    } else {
                                        e.target.style.transform = 'rotate(0deg)';
                                        e.target.setAttribute('data-clicked', '0');
                                        e.target.nextSibling.style.display = 'none';
                                    }

                                });
                                charDiv.appendChild(showMore);
                                charDiv.appendChild(charExtraInfoDiv);
                                parent.appendChild(charDiv);
                            });

                        }
                    }).catch(err => console.log(err));
                }
            });
        } catch (e) {
            console.log(`Error  ${e.name}: ${e.message}\n${e.stack}`);
        }
    }
};
