class Card {
    #id;
    #name;
    #description;
    #cost;
    #rarity;
    #effect;
    #preset;

    constructor(id, name, description, cost, rarity, effect, preset = true) {
        this.#id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.rarity = rarity;
        this.effect = effect;
        this.#preset = preset;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get description() { return this.#description; }
    get cost() { return this.#cost; }
    get rarity() { return this.#rarity; }
    get effect() { return this.#effect; }
    get preset() { return this.#preset; }

    set name(value) {
        value = String(value).trim();
        if (value.length < 2) throw new Error("Название слишком короткое.");
        this.#name = value;
    }

    set description(value) {
        value = String(value).trim();
        if (value.length < 5) throw new Error("Описание слишком короткое.");
        this.#description = value;
    }

    set cost(value) {
        value = Number(value);
        if (!Number.isInteger(value) || value < 0 || value > 20) throw new Error("Стоимость от 0 до 20.");
        this.#cost = value;
    }

    set rarity(value) {
        value = String(value).trim();
        if (!value) throw new Error("Укажите редкость.");
        this.#rarity = value;
    }

    set effect(value) {
        value = String(value).trim();
        if (value.length < 5) throw new Error("Эффект слишком короткий.");
        this.#effect = value;
    }

    getType() {
        return "Обычная карта";
    }

    getClassName() {
        return "custom";
    }

    getExtra() {
        return [];
    }

    update(data) {
        this.name = data.name;
        this.description = data.description;
        this.cost = data.cost;
        this.rarity = data.rarity;
        this.effect = data.effect;
    }

    toJSON() {
        return {
            classType: this.constructor.name,
            id: this.id,
            name: this.name,
            description: this.description,
            cost: this.cost,
            rarity: this.rarity,
            effect: this.effect,
            preset: this.preset
        };
    }

    render(editMode = false) {
        const article = document.createElement("article");
        article.className = `card-item ${this.getClassName()}`;

        article.innerHTML = `
            <div class="card-top">
                <h3 class="card-title">${this.name}</h3>
                <span class="card-badge">${this.getType()}</span>
            </div>
            <div class="card-meta">
                <span class="card-stat">Энергия: ${this.cost}</span>
                <span class="card-stat">Редкость: ${this.rarity}</span>
                ${this.getExtra().map(item => `<span class="card-stat">${item}</span>`).join("")}
            </div>
            <p class="card-description">${this.description}</p>
            <p class="card-effect">${this.effect}</p>
            <div class="card-footer">
                <span class="card-origin">${this.preset ? "Базовая карта" : "Пользовательская карта"}</span>
                <div class="card-actions"></div>
            </div>
        `;

        const actions = article.querySelector(".card-actions");

        if (!this.preset) {
            const del = document.createElement("button");
            del.className = "button danger";
            del.type = "button";
            del.textContent = "Удалить";
            del.onclick = () => deleteCustomCard(this.id);
            actions.append(del);
        }

        if (editMode && this.preset) {
            article.append(createEditPanel(this));
        }

        return article;
    }
}

class AttackCard extends Card {
    #attack;
    #spell;

    constructor(id, name, description, cost, rarity, effect, attack, spell, preset = true) {
        super(id, name, description, cost, rarity, effect, preset);
        this.attack = attack;
        this.spell = spell;
    }

    get attack() { return this.#attack; }
    get spell() { return this.#spell; }

    set attack(value) {
        value = Number(value);
        if (!Number.isInteger(value) || value < 1 || value > 99) throw new Error("Атака от 1 до 99.");
        this.#attack = value;
    }

    set spell(value) {
        value = String(value).trim();
        if (!value) throw new Error("Укажите заклинание.");
        this.#spell = value;
    }

    getType() { return "Атакующая карта"; }
    getClassName() { return "attack"; }
    getExtra() { return [`Атака: ${this.attack}`, `Заклинание: ${this.spell}`]; }

    update(data) {
        super.update(data);
        this.attack = data.attack;
        this.spell = data.spell;
    }

    toJSON() {
        return { ...super.toJSON(), attack: this.attack, spell: this.spell };
    }
}

class DefenseCard extends Card {
    #defense;
    #artifact;

    constructor(id, name, description, cost, rarity, effect, defense, artifact, preset = true) {
        super(id, name, description, cost, rarity, effect, preset);
        this.defense = defense;
        this.artifact = artifact;
    }

    get defense() { return this.#defense; }
    get artifact() { return this.#artifact; }

    set defense(value) {
        value = Number(value);
        if (!Number.isInteger(value) || value < 1 || value > 99) throw new Error("Защита от 1 до 99.");
        this.#defense = value;
    }

    set artifact(value) {
        value = String(value).trim();
        if (!value) throw new Error("Укажите артефакт.");
        this.#artifact = value;
    }

    getType() { return "Защитная карта"; }
    getClassName() { return "defense"; }
    getExtra() { return [`Защита: ${this.defense}`, `Артефакт: ${this.artifact}`]; }

    update(data) {
        super.update(data);
        this.defense = data.defense;
        this.artifact = data.artifact;
    }

    toJSON() {
        return { ...super.toJSON(), defense: this.defense, artifact: this.artifact };
    }
}

class RitualCard extends Card {
    #wisdom;
    #school;

    constructor(id, name, description, cost, rarity, effect, wisdom, school, preset = true) {
        super(id, name, description, cost, rarity, effect, preset);
        this.wisdom = wisdom;
        this.school = school;
    }

    get wisdom() { return this.#wisdom; }
    get school() { return this.#school; }

    set wisdom(value) {
        value = Number(value);
        if (!Number.isInteger(value) || value < 1 || value > 99) throw new Error("Мудрость от 1 до 99.");
        this.#wisdom = value;
    }

    set school(value) {
        value = String(value).trim();
        if (!value) throw new Error("Укажите школу магии.");
        this.#school = value;
    }

    getType() { return "Ритуальная карта"; }
    getClassName() { return "ritual"; }
    getExtra() { return [`Мудрость: ${this.wisdom}`, `Школа: ${this.school}`]; }

    update(data) {
        super.update(data);
        this.wisdom = data.wisdom;
        this.school = data.school;
    }

    toJSON() {
        return { ...super.toJSON(), wisdom: this.wisdom, school: this.school };
    }
}

const STORAGE_KEY = "lab5_harry_cards";

const baseCards = [
    new AttackCard(
        "preset-1",
        "Гарри Поттер",
        "Главный герой, использующий быстрые и точные атакующие заклинания.",
        4,
        "Легендарная",
        "Наносит сильный удар и усиливается в конце хода.",
        9,
        "Экспеллиармус"
    ),
    new DefenseCard(
        "preset-2",
        "Альбус Дамблдор",
        "Могущественный волшебник, защищающий союзников и контролирующий бой.",
        5,
        "Легендарная",
        "Уменьшает входящий урон и укрепляет защиту всей стороны.",
        10,
        "Бузинная палочка"
    ),
    new RitualCard(
        "preset-3",
        "Лорд Волдеморт",
        "Тёмный маг, использующий ритуалы и разрушительную магию.",
        6,
        "Легендарная",
        "Ослабляет врагов и усиливает следующую тёмную карту.",
        10,
        "Тёмная магия"
    )
];

let state = {
    editMode: false,
    presetCards: [],
    customCards: []
};

document.addEventListener("DOMContentLoaded", init);

function init() {
    loadState();
    buildPage();
}

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        state = {
            editMode: false,
            presetCards: cloneCards(baseCards),
            customCards: []
        };
        saveState();
        return;
    }

    try {
        const saved = JSON.parse(raw);
        state.editMode = !!saved.editMode;
        state.presetCards = restoreCards(saved.presetCards, baseCards);
        state.customCards = restoreCards(saved.customCards, []);
    } catch {
        state = {
            editMode: false,
            presetCards: cloneCards(baseCards),
            customCards: []
        };
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        editMode: state.editMode,
        presetCards: state.presetCards.map(card => card.toJSON()),
        customCards: state.customCards.map(card => card.toJSON())
    }));
}

function cloneCards(cards) {
    return cards.map(card => createCard(card.toJSON()));
}

function restoreCards(saved, fallback) {
    if (!Array.isArray(saved) || saved.length === 0) return cloneCards(fallback);
    return saved.map(createCard);
}

function createCard(data) {
    if (data.classType === "AttackCard") {
        return new AttackCard(data.id, data.name, data.description, data.cost, data.rarity, data.effect, data.attack, data.spell, data.preset);
    }
    if (data.classType === "DefenseCard") {
        return new DefenseCard(data.id, data.name, data.description, data.cost, data.rarity, data.effect, data.defense, data.artifact, data.preset);
    }
    return new RitualCard(data.id, data.name, data.description, data.cost, data.rarity, data.effect, data.wisdom, data.school, data.preset);
}

function buildPage() {
    document.body.innerHTML = "";
    document.body.append(buildHeader(), buildMain());
}

function buildHeader() {
    const header = document.createElement("header");
    header.className = "site-header";

    header.innerHTML = `
        <div class="header-inner">
            <div class="brand">
                <h1>Колода карт по Гарри Поттеру</h1>
            </div>
            <div class="header-actions"></div>
        </div>
    `;

    const actions = header.querySelector(".header-actions");

    const editBtn = button(
        state.editMode ? "Выключить редактирование" : "Включить редактирование",
        state.editMode ? "button danger" : "button primary",
        toggleEditMode
    );

    const resetBtn = button("Сбросить изменения", "button secondary", resetAll);

    actions.append(editBtn, resetBtn);
    return header;
}

function buildMain() {
    const main = document.createElement("main");
    main.className = "page-wrapper";
    main.append(buildHero(), buildContent());
    return main;
}

function buildHero() {
    const section = document.createElement("section");
    section.className = "hero";
    section.innerHTML = `
        <h2>Магическая колода</h2>
        <p>В колоде представлены Гарри Поттер, Альбус Дамблдор и Лорд Волдеморт.</p>
        <div class="info-grid">
            <article class="info-card">
                <h3>Гарри Поттер</h3>
                <p>Атакующая карта с сильным заклинанием.</p>
            </article>
            <article class="info-card">
                <h3>Альбус Дамблдор</h3>
                <p>Защитная карта с мощной магической поддержкой.</p>
            </article>
            <article class="info-card">
                <h3>Лорд Волдеморт</h3>
                <p>Ритуальная карта с тёмной магией.</p>
            </article>
        </div>
    `;
    return section;
}

function buildContent() {
    const wrapper = document.createElement("div");
    wrapper.className = "content-grid";
    wrapper.append(buildSidebar(), buildDeck());
    return wrapper;
}

function buildSidebar() {
    const aside = document.createElement("aside");
    aside.className = "sidebar";

    const section = document.createElement("section");
    section.innerHTML = `<h2>Добавить карту</h2>`;

    const form = document.createElement("form");
    form.id = "add-card-form";
    form.append(
        field("new-name", "Название карты"),
        textareaField("new-description", "Описание карты"),
        numberField("new-cost", "Стоимость энергии", 0, 20),
        field("new-rarity", "Редкость"),
        textareaField("new-effect", "Эффект карты"),
        selectField("new-type", "Тип карты", [
            ["AttackCard", "Атакующая карта"],
            ["DefenseCard", "Защитная карта"],
            ["RitualCard", "Ритуальная карта"]
        ]),
        numberField("new-a", "Первый параметр", 1, 99),
        field("new-b", "Второй параметр"),
        button("Создать карту", "button success", null, "submit"),
        messageBlock("add-card-message")
    );

    form.addEventListener("submit", addCard);
    section.append(form);
    aside.append(section);

    return aside;
}

function buildDeck() {
    const area = document.createElement("div");
    area.className = "deck-area";
    area.append(buildPresetSection(), buildCustomSection());
    return area;
}

function buildPresetSection() {
    const section = document.createElement("section");
    section.className = "section-block";

    const title = document.createElement("h2");
    title.textContent = "Основные карты";

    const text = document.createElement("p");
    text.textContent = "Заранее заданные карты, доступные для редактирования через кнопку в шапке.";

    const grid = document.createElement("div");
    grid.className = "cards-grid";

    state.presetCards.forEach(card => grid.append(card.render(state.editMode)));

    section.append(title, text, grid);
    return section;
}

function buildCustomSection() {
    const section = document.createElement("section");
    section.className = "section-block";

    const title = document.createElement("h2");
    title.textContent = "Пользовательские карты";

    const text = document.createElement("p");
    text.textContent = "Карты, добавленные через форму.";

    section.append(title, text);

    if (!state.customCards.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Пока пользовательских карт нет.";
        section.append(empty);
        return section;
    }

    const grid = document.createElement("div");
    grid.className = "cards-grid";
    state.customCards.forEach(card => grid.append(card.render(false)));
    section.append(grid);

    return section;
}

function addCard(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const msg = form.querySelector("#add-card-message");
    clearMessage(msg);

    try {
        const type = form.querySelector("#new-type").value;
        const id = "custom-" + Date.now();
        const data = {
            id,
            name: form.querySelector("#new-name").value,
            description: form.querySelector("#new-description").value,
            cost: form.querySelector("#new-cost").value,
            rarity: form.querySelector("#new-rarity").value,
            effect: form.querySelector("#new-effect").value,
            a: form.querySelector("#new-a").value,
            b: form.querySelector("#new-b").value
        };

        let card;

        if (type === "AttackCard") {
            card = new AttackCard(id, data.name, data.description, data.cost, data.rarity, data.effect, data.a, data.b, false);
        } else if (type === "DefenseCard") {
            card = new DefenseCard(id, data.name, data.description, data.cost, data.rarity, data.effect, data.a, data.b, false);
        } else {
            card = new RitualCard(id, data.name, data.description, data.cost, data.rarity, data.effect, data.a, data.b, false);
        }

        state.customCards.unshift(card);
        saveState();
        buildPage();
    } catch (error) {
        showMessage(msg, error.message, true);
    }
}

function deleteCustomCard(id) {
    if (!confirm("Удалить карту?")) return;
    state.customCards = state.customCards.filter(card => card.id !== id);
    saveState();
    buildPage();
}

function toggleEditMode() {
    state.editMode = !state.editMode;
    saveState();
    buildPage();
}

function resetAll() {
    if (!confirm("Сбросить все изменения?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = { editMode: false, presetCards: cloneCards(baseCards), customCards: [] };
    saveState();
    buildPage();
}

function createEditPanel(card) {
    const section = document.createElement("section");
    section.className = "edit-panel";

    const title = document.createElement("h4");
    title.textContent = "Редактирование карты";

    const form = document.createElement("form");
    form.append(
        field(`edit-name-${card.id}`, "Название карты", card.name, true),
        textareaField(`edit-description-${card.id}`, "Описание карты", card.description, true),
        numberField(`edit-cost-${card.id}`, "Стоимость энергии", 0, 20, card.cost, true),
        field(`edit-rarity-${card.id}`, "Редкость", card.rarity, true),
        textareaField(`edit-effect-${card.id}`, "Эффект карты", card.effect, true),
        ...extraFields(card),
        button("Сохранить изменения", "button primary", null, "submit"),
        messageBlock(`msg-${card.id}`)
    );

    form.addEventListener("submit", (event) => saveEdit(event, card));
    section.append(title, form);
    return section;
}

function saveEdit(event, card) {
    event.preventDefault();
    const form = event.currentTarget;
    const msg = form.querySelector(".form-message");
    clearMessage(msg);

    try {
        const base = {
            name: form.querySelector(`#edit-name-${card.id}`).value,
            description: form.querySelector(`#edit-description-${card.id}`).value,
            cost: form.querySelector(`#edit-cost-${card.id}`).value,
            rarity: form.querySelector(`#edit-rarity-${card.id}`).value,
            effect: form.querySelector(`#edit-effect-${card.id}`).value
        };

        if (card instanceof AttackCard) {
            card.update({
                ...base,
                attack: form.querySelector(`#extra-a-${card.id}`).value,
                spell: form.querySelector(`#extra-b-${card.id}`).value
            });
        } else if (card instanceof DefenseCard) {
            card.update({
                ...base,
                defense: form.querySelector(`#extra-a-${card.id}`).value,
                artifact: form.querySelector(`#extra-b-${card.id}`).value
            });
        } else {
            card.update({
                ...base,
                wisdom: form.querySelector(`#extra-a-${card.id}`).value,
                school: form.querySelector(`#extra-b-${card.id}`).value
            });
        }

        saveState();
        buildPage();
    } catch (error) {
        showMessage(msg, error.message, true);
    }
}

function extraFields(card) {
    if (card instanceof AttackCard) {
        return [
            numberField(`extra-a-${card.id}`, "Сила атаки", 1, 99, card.attack, true),
            field(`extra-b-${card.id}`, "Заклинание", card.spell, true)
        ];
    }

    if (card instanceof DefenseCard) {
        return [
            numberField(`extra-a-${card.id}`, "Защита", 1, 99, card.defense, true),
            field(`extra-b-${card.id}`, "Артефакт", card.artifact, true)
        ];
    }

    return [
        numberField(`extra-a-${card.id}`, "Мудрость", 1, 99, card.wisdom, true),
        field(`extra-b-${card.id}`, "Школа магии", card.school, true)
    ];
}

function field(id, labelText, value = "", filled = false) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><input type="text" id="${id}" name="${id}">`;
    const input = div.querySelector("input");
    filled ? input.value = value : input.placeholder = value;
    return div;
}

function textareaField(id, labelText, value = "", filled = false) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><textarea id="${id}" name="${id}"></textarea>`;
    const textarea = div.querySelector("textarea");
    filled ? textarea.value = value : textarea.placeholder = value;
    return div;
}

function numberField(id, labelText, min, max, value = "", filled = false) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><input type="number" id="${id}" name="${id}" min="${min}" max="${max}">`;
    const input = div.querySelector("input");
    filled ? input.value = value : input.placeholder = value;
    return div;
}

function selectField(id, labelText, items) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><select id="${id}" name="${id}"></select>`;
    const select = div.querySelector("select");

    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item[0];
        option.textContent = item[1];
        select.append(option);
    });

    return div;
}

function button(text, className, handler = null, type = "button") {
    const btn = document.createElement("button");
    btn.className = className;
    btn.type = type;
    btn.textContent = text;
    if (handler) btn.addEventListener("click", handler);
    return btn;
}

function messageBlock(id) {
    const div = document.createElement("div");
    div.id = id;
    div.className = "form-message";
    return div;
}

function showMessage(el, text, error = false) {
    el.textContent = text;
    el.className = `form-message ${error ? "error" : "success"}`;
}

function clearMessage(el) {
    el.textContent = "";
    el.className = "form-message";
}