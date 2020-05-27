const trendsOffset = 20;

const getSites = async () => {
    const url = "https://api.mercadolibre.com/sites";
    await fetch(url)
    .then(res => {
        return res.json();
    })
    .then(res => {
        let countrySelect = document.getElementById("navigation-country");
        res.forEach(s => {
            const id = s.id;
            const name = s.name;

            let option = document.createElement("option");
            option.setAttribute("value", id);
            option.innerHTML = name.toUpperCase();

            if (id == "MLA") {
                option.setAttribute("selected", true);
            }

            countrySelect.append(option);
        });

        return;
    });
}

const getCategories = async (siteId) => {
    const url = `https://api.mercadolibre.com/sites/${siteId}/categories`;
    fetch(url)
    .then(res => {
        return res.json();
    })
    .then(res => {
        let categorySelect = document.getElementById("navigation-category");
        let c = 0;
        res.forEach(c => {
            const id = c.id;
            const name = c.name.toUpperCase();

            let option = document.createElement("option");
            option.setAttribute("value", id);
            option.innerHTML = name;

            /*if (c == 0) {
                option.setAttribute("selected", true);
                c++;
            }*/

            categorySelect.append(option);
        });
    });
}

const getTrends = (siteId, categoryId, page = 0, offset = trendsOffset) => {
    document.getElementById("load-more").classList.add("fadeOut");
    document.getElementById("load-more").classList.remove("fadeIn");   
    
    if (page == 0) {
        document.getElementById("info-wrapper").classList.add("fadeOut");
        document.getElementById("info-wrapper").classList.remove("fadeIn");
    
        /*document.getElementById("item-wrapper").classList.add("fadeOut");
        document.getElementById("item-wrapper").classList.remove("fadeIn");*/
    }

    const url = `https://api.mercadolibre.com/trends/${siteId}/${categoryId}`;
    fetch(url)
    .then(res => {
        return res.json();
    })
    .then(res => {
        let itemWrapper = document.getElementById("item-wrapper");
        if (page == 0) {
            itemWrapper.innerHTML = "";
        }

        const indexFrom = page * offset;
        const indexTo = indexFrom + offset;
        let indexCount = 0;

        let items = document.querySelectorAll(".new-item");
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("new-item");
        }

        res.forEach(i => {
            if (indexCount >= indexFrom && indexCount < indexTo) {
                const keyword = i.keyword.toUpperCase();
                const url = i.url;
    
                let div = document.createElement("div");
                div.classList = "item new-item fadeOut";
                div.style.display = "none";
    
                let a = document.createElement("a");
                a.setAttribute("href", url);
                a.setAttribute("target", "_blank");
                
                a.innerHTML = keyword;
    
                div.append(a);
    
                itemWrapper.append(div);                
            }

            indexCount++;
        });

        document.getElementById("load-more").setAttribute("data-page", page);
        let time;

        if (page == 0) {
            time = 1000;
            setTimeout(() => {
                document.getElementById("info-country").innerHTML = document.getElementById("navigation-country").options[document.getElementById("navigation-country").selectedIndex].text;
                document.getElementById("info-category").innerHTML = document.getElementById("navigation-category").options[document.getElementById("navigation-category").selectedIndex].text;            
                
                document.getElementById("info-wrapper").classList.add("fadeIn");
                document.getElementById("info-wrapper").classList.remove("fadeOut");
    
                /*document.getElementById("item-wrapper").classList.add("fadeIn");
                document.getElementById("item-wrapper").classList.remove("fadeOut");*/
            }, time);            
        } else {
            time = 500;
        }

        setTimeout(() => {
            items = document.getElementsByClassName("new-item");
            for (let i = 0; i < items.length; i++) {
                items[i].style.display = "flex";
                setTimeout(() => {
                    items[i].classList.add("fadeIn");
                    items[i].classList.remove("fadeOut");
                }, 200);
            }

            setTimeout(() => {
                if (indexTo < res.length) {
                    document.getElementById("load-more").classList.add("fadeIn");
                    document.getElementById("load-more").classList.remove("fadeOut");
                } else {
                    document.getElementById("load-more").classList.add("fadeOut");
                    document.getElementById("load-more").classList.remove("fadeIn");            
                } 
            }, 220);
        }, time);
    })
}

const initializeNavigation = async () => {
    await getSites();
    const currentSite = document.getElementById("navigation-country").value;
    
    document.getElementById("navigation-category").innerHTML = "<option value='' selected>TODAS</option>";
    await getCategories(currentSite);
    const currentCategory = document.getElementById("navigation-category").value;
    
    getTrends(currentSite, currentCategory);
}

document.getElementById("navigation-country").addEventListener("change", (e) => {
    const currentSite = e.target.value;
    document.getElementById("navigation-category").innerHTML = "<option value='' selected>TODAS</option>";
    getCategories(currentSite);
});

document.getElementById("navigation-action").addEventListener("click", (e) => {
    const currentSite = document.getElementById("navigation-country").value;
    const currentCategory = document.getElementById("navigation-category").value;
    getTrends(currentSite, currentCategory);
});

document.getElementById("load-more").addEventListener("click", (e) => {
    const page = parseInt(e.target.dataset.page) + 1;
    const currentSite = document.getElementById("navigation-country").value;
    const currentCategory = document.getElementById("navigation-category").value;    
    getTrends(currentSite, currentCategory, page);
});

(function() {
    initializeNavigation();
})();