const themeToggleButton = document.getElementById("theme-toggle");
const reviewForm = document.getElementById("review-form");
const reviewsList = document.getElementById("reviews-list");
const reviewNameInput = document.getElementById("review-name");
const reviewTextInput = document.getElementById("review-text");
const reviewImageInput = document.getElementById("review-image");
const formError = document.getElementById("form-error");
const formSuccess = document.getElementById("form-success");
const clearCustomReviewsButton = document.getElementById("clear-custom-reviews");

const defaultReviews = [
    {
        name: "ЕКАТЕРИНА МИЗУЛИНА",
        text: "Сайт настолько классный, что я его запретила!",
        image: "",
        date: "Базовый отзыв"
    },
    {
        name: "ШАМАН",
        text: "СНИМАЮ ОДНУ ЗВЕЗДУ, НЕТУ ПЕСНИ «Я РУССКИЙ».",
        image: "",
        date: "Базовый отзыв"
    },
    {
        name: "ГОСТЬ КАЗИНО",
        text: "Я пришёл за бонусом, а остался ради дизайна. Очень ярко и очень странно.",
        image: "",
        date: "Базовый отзыв"
    }
];

const THEME_COOKIE_NAME = "lab4Theme";
const REVIEWS_COOKIE_NAME = "lab4Reviews";
const FALLBACK_IMAGE = "";

initPage();

function initPage() {
    initTheme();
    renderAllReviews();
    reviewForm.addEventListener("submit", handleReviewSubmit);
    clearCustomReviewsButton.addEventListener("click", clearCustomReviews);
    themeToggleButton.addEventListener("click", toggleTheme);
}

function initTheme() {
    const savedTheme = getCookie(THEME_COOKIE_NAME);

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        updateThemeButtonText();
    } else {
        document.body.classList.remove("dark-theme");
        updateThemeButtonText();
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const isDarkThemeEnabled = document.body.classList.contains("dark-theme");
    setCookie(THEME_COOKIE_NAME, isDarkThemeEnabled ? "dark" : "light", 7);
    updateThemeButtonText();
}

function updateThemeButtonText() {
    if (document.body.classList.contains("dark-theme")) {
        themeToggleButton.textContent = "☀️ Светлая тема";
    } else {
        themeToggleButton.textContent = "🌙 Тёмная тема";
    }
}

function handleReviewSubmit(event) {
    event.preventDefault();

    clearMessages();

    const nameValue = reviewNameInput.value.trim();
    const textValue = reviewTextInput.value.trim();
    const imageValue = reviewImageInput.value.trim();

    const validationError = validateReview(nameValue, textValue, imageValue);

    if (validationError !== "") {
        formError.textContent = validationError;
        return;
    }

    const customReviews = getStoredReviews();

    const newReview = {
        name: nameValue,
        text: textValue,
        image: imageValue === "" ? FALLBACK_IMAGE : imageValue,
        date: getCurrentDateTime()
    };

    customReviews.unshift(newReview);
    saveStoredReviews(customReviews);
    renderAllReviews();

    reviewForm.reset();
    formSuccess.textContent = "Отзыв успешно добавлен и сохранён в cookie.";
}

function validateReview(name, text, image) {
    if (name === "") {
        return "Имя не должно быть пустым.";
    }

    if (name.length < 2) {
        return "Имя должно содержать минимум 2 символа.";
    }

    if (text === "") {
        return "Текст отзыва не должен быть пустым.";
    }

    if (text.length < 5) {
        return "Текст отзыва должен содержать минимум 5 символов.";
    }

    if (image !== "" && !isValidImageUrl(image)) {
        return "Ссылка на изображение должна быть корректной и заканчиваться на .jpg, .jpeg, .png, .gif или .webp.";
    }

    return "";
}

function isValidImageUrl(url) {
    const imagePattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
    return imagePattern.test(url);
}

function renderAllReviews() {
    const customReviews = getStoredReviews();
    const allReviews = [...customReviews, ...defaultReviews];

    reviewsList.innerHTML = "";

    allReviews.forEach(function(review) {
        const reviewCard = createReviewCard(review);
        reviewsList.appendChild(reviewCard);
    });
}

function createReviewCard(review) {
    const card = document.createElement("div");
    card.className = "review-card";

    const header = document.createElement("div");
    header.className = "review-header";

    const avatar = document.createElement("img");
    avatar.className = "review-avatar";
    avatar.src = review.image || FALLBACK_IMAGE;
    avatar.alt = "Изображение пользователя " + review.name;
    avatar.onerror = function () {
        avatar.src = FALLBACK_IMAGE;
    };

    const info = document.createElement("div");

    const name = document.createElement("div");
    name.className = "review-name";
    name.textContent = review.name;

    const text = document.createElement("p");
    text.className = "review-text";
    text.textContent = review.text;

    const date = document.createElement("small");
    date.className = "review-date";
    date.textContent = review.date;

    info.appendChild(name);
    header.appendChild(avatar);
    header.appendChild(info);

    card.appendChild(header);
    card.appendChild(text);
    card.appendChild(date);

    return card;
}

function getStoredReviews() {
    const reviewsJson = getCookie(REVIEWS_COOKIE_NAME);

    if (!reviewsJson) {
        return [];
    }

    try {
        const parsedReviews = JSON.parse(reviewsJson);

        if (Array.isArray(parsedReviews)) {
            return parsedReviews;
        }

        return [];
    } catch (error) {
        return [];
    }
}

function saveStoredReviews(reviews) {
    setCookie(REVIEWS_COOKIE_NAME, JSON.stringify(reviews), 7);
}

function clearCustomReviews() {
    deleteCookie(REVIEWS_COOKIE_NAME);
    renderAllReviews();
    clearMessages();
    formSuccess.textContent = "Пользовательские отзывы удалены из cookie.";
}

function clearMessages() {
    formError.textContent = "";
    formSuccess.textContent = "";
}

function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString("ru-RU");
}