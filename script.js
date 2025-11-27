const API_KEY = "933d8439c8b0444f84842f9069c43e6e";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("general"));

function reloadPage() {
    window.location.reload();
}

async function fetchNews(query) {
    const cardsContainer = document.getElementById("cards-container");
    const errorMessage = document.getElementById("error-message");

    cardsContainer.innerHTML = "<p style='text-align:center;width:100%;margin-top:20px;'>Загрузка...</p>";
    errorMessage.style.display = "none";

    try {
        const res = await fetch(`${url}${query}&language=en&pageSize=10&apiKey=${API_KEY}`);

        if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);

        const data = await res.json();

        if (data.articles?.length) {
            bindData(data.articles);
        } else {
            cardsContainer.innerHTML = "";
            errorMessage.style.display = "block";
        }

    } catch (err) {
        cardsContainer.innerHTML = "";
        errorMessage.textContent = "Ошибка: " + err.message;
        errorMessage.style.display = "block";
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const img = cardClone.querySelector(".news-img");
    img.src = article.urlToImage || "https://via.placeholder.com/400x200?text=Нет+фото";

    cardClone.querySelector(".news-title").textContent = article.title || "Без заголовка";
    cardClone.querySelector(".news-desc").textContent = article.description || "Описание отсутствует";

    const date = new Date(article.publishedAt).toLocaleString("ru-RU");
    cardClone.querySelector(".news-source").textContent =
        `${article.source.name || "Источник"} • ${date}`;

    cardClone.querySelector(".card").onclick = () => {
        window.open(article.url, "_blank");
    };
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);

    const navItem = document.getElementById(id);
    if (!navItem) return;

    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

document.getElementById("search-text").addEventListener("keypress", e => {
    if (e.key === "Enter") onSearchButtonClick();
});

function onSearchButtonClick() {
    const query = document.getElementById("search-text").value.trim();
    if (!query) return;

    fetchNews(query);

    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
        curSelectedNav = null;
    }
}
