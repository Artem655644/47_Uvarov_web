const POSTS_API = "https://jsonplaceholder.typicode.com/posts";
const DOG_API = "https://dog.ceo/api";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const cityMap = {
    moscow: { name: "Москва", latitude: 55.7558, longitude: 37.6176 },
    "saint-petersburg": { name: "Санкт-Петербург", latitude: 59.9343, longitude: 30.3351 },
    kazan: { name: "Казань", latitude: 55.7961, longitude: 49.1064 }
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("load-posts-btn").addEventListener("click", loadPosts);
    document.getElementById("post-form").addEventListener("submit", createPost);
    document.getElementById("patch-form").addEventListener("submit", patchPost);
    document.getElementById("delete-form").addEventListener("submit", deletePost);

    document.getElementById("load-breeds-btn").addEventListener("click", loadBreeds);
    document.getElementById("dog-form").addEventListener("submit", loadDogImages);

    document.getElementById("weather-form").addEventListener("submit", loadWeather);
});

function setState(elementId, text) {
    document.getElementById(elementId).textContent = text;
}

function clearContainer(elementId) {
    document.getElementById(elementId).innerHTML = "";
}

function showCrudResult(text, isError = false) {
    const box = document.getElementById("crud-result");
    box.textContent = text;
    box.style.color = isError ? "#c53b3b" : "#2f855a";
}

async function loadPosts() {
    setState("posts-state", "Загрузка постов...");
    clearContainer("posts-list");

    try {
        const response = await fetch(`${POSTS_API}?_limit=6`);
        if (!response.ok) {
            throw new Error("Не удалось получить посты.");
        }

        const posts = await response.json();

        if (!posts.length) {
            setState("posts-state", "Посты не найдены.");
            return;
        }

        setState("posts-state", "");
        renderPosts(posts);
    } catch (error) {
        setState("posts-state", "Ошибка загрузки постов.");
    }
}

function renderPosts(posts) {
    const container = document.getElementById("posts-list");
    container.innerHTML = "";

    posts.forEach((post) => {
        const item = document.createElement("article");
        item.className = "post-card";
        item.innerHTML = `
            <h4>${escapeHtml(post.title)}</h4>
            <p>${escapeHtml(post.body)}</p>
        `;
        container.appendChild(item);
    });
}

async function createPost(event) {
    event.preventDefault();

    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-body").value.trim();

    if (!title || !body) {
        showCrudResult("Заполните заголовок и текст поста.", true);
        return;
    }

    showCrudResult("Отправка POST-запроса...");

    try {
        const response = await fetch(POSTS_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                title,
                body,
                userId: 1
            })
        });

        if (!response.ok) {
            throw new Error("POST не выполнен.");
        }

        const result = await response.json();
        showCrudResult(`POST выполнен успешно. Создан пост с id: ${result.id}`);
        event.target.reset();
    } catch (error) {
        showCrudResult("Ошибка при POST-запросе.", true);
    }
}

async function patchPost(event) {
    event.preventDefault();

    const id = document.getElementById("patch-id").value.trim();
    const title = document.getElementById("patch-title").value.trim();

    if (!id || !title) {
        showCrudResult("Укажите ID поста и новый заголовок.", true);
        return;
    }

    showCrudResult("Отправка PATCH-запроса...");

    try {
        const response = await fetch(`${POSTS_API}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error("PATCH не выполнен.");
        }

        const result = await response.json();
        showCrudResult(`PATCH выполнен успешно. Новый заголовок: ${result.title}`);
        event.target.reset();
    } catch (error) {
        showCrudResult("Ошибка при PATCH-запросе.", true);
    }
}

async function deletePost(event) {
    event.preventDefault();

    const id = document.getElementById("delete-id").value.trim();

    if (!id) {
        showCrudResult("Укажите ID поста для удаления.", true);
        return;
    }

    showCrudResult("Отправка DELETE-запроса...");

    try {
        const response = await fetch(`${POSTS_API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("DELETE не выполнен.");
        }

        showCrudResult(`DELETE выполнен успешно. Пост с id ${id} удалён.`);
        event.target.reset();
    } catch (error) {
        showCrudResult("Ошибка при DELETE-запросе.", true);
    }
}

async function loadBreeds() {
    setState("breeds-state", "Загрузка пород...");
    clearContainer("breeds-list");

    try {
        const response = await fetch(`${DOG_API}/breeds/list/all`);
        if (!response.ok) {
            throw new Error("Не удалось получить список пород.");
        }

        const data = await response.json();
        const breeds = Object.keys(data.message).slice(0, 24);

        if (!breeds.length) {
            setState("breeds-state", "Породы не найдены.");
            return;
        }

        setState("breeds-state", "");
        renderBreeds(breeds);
    } catch (error) {
        setState("breeds-state", "Ошибка загрузки списка пород.");
    }
}

function renderBreeds(breeds) {
    const container = document.getElementById("breeds-list");
    container.innerHTML = "";

    breeds.forEach((breed) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = breed;
        container.appendChild(tag);
    });
}

async function loadDogImages(event) {
    event.preventDefault();

    const breed = document.getElementById("dog-breed").value.trim().toLowerCase();
    if (!breed) {
        setState("dogs-state", "Введите породу.");
        clearContainer("dog-images");
        return;
    }

    setState("dogs-state", "Загрузка изображений...");
    clearContainer("dog-images");

    try {
        const response = await fetch(`${DOG_API}/breed/${breed}/images/random/6`);
        if (!response.ok) {
            throw new Error("Не удалось получить изображения.");
        }

        const data = await response.json();

        if (!data.message || !data.message.length) {
            setState("dogs-state", "Изображения не найдены.");
            return;
        }

        setState("dogs-state", "");
        renderDogImages(data.message);
    } catch (error) {
        setState("dogs-state", "Ошибка загрузки изображений. Возможно, такой породы нет.");
    }
}

function renderDogImages(images) {
    const container = document.getElementById("dog-images");
    container.innerHTML = "";

    images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Собака ${index + 1}`;
        container.appendChild(img);
    });
}

async function loadWeather(event) {
    event.preventDefault();

    const cityKey = document.getElementById("weather-city").value;
    const city = cityMap[cityKey];

    setState("weather-state", "Загрузка погоды...");
    clearContainer("weather-result");

    try {
        const url = `${WEATHER_API}?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m&forecast_days=1&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Не удалось получить погоду.");
        }

        const data = await response.json();

        if (!data.current) {
            setState("weather-state", "Погодные данные не найдены.");
            return;
        }

        setState("weather-state", "");
        renderWeather(city.name, data);
    } catch (error) {
        setState("weather-state", "Ошибка загрузки погоды.");
    }
}

function renderWeather(cityName, data) {
    const container = document.getElementById("weather-result");
    container.innerHTML = "";

    const items = [
        { label: "Город", value: cityName },
        { label: "Температура сейчас", value: `${data.current.temperature_2m} °C` },
        { label: "Скорость ветра", value: `${data.current.wind_speed_10m} км/ч` },
        { label: "Часовой пояс", value: data.timezone }
    ];

    items.forEach((item) => {
        const block = document.createElement("div");
        block.className = "weather-item";
        block.innerHTML = `
            <span>${item.label}</span>
            <strong>${item.value}</strong>
        `;
        container.appendChild(block);
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}