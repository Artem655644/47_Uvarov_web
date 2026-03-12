const startButton = document.getElementById("start-game");

startButton.addEventListener("click", startGame);

function startGame() {
    let playAgain = true;

    while (playAgain) {
        const wantsToPlay = confirm(
            "Добро пожаловать в игру «Побег с пары»!\n\n" +
            "Твоя задача — выбраться из универа, не попавшись преподавателю.\n" +
            "Начать игру?"
        );

        if (!wantsToPlay) {
            alert("Игра отменена.");
            return;
        }

        let playerName = prompt("Введите ваше имя:");

        if (playerName === null) {
            alert("Вы отменили ввод имени. Игра завершена.");
            return;
        }

        playerName = playerName.trim();

        while (playerName === "") {
            playerName = prompt("Имя не может быть пустым. Введите ваше имя:");

            if (playerName === null) {
                alert("Вы отменили ввод имени. Игра завершена.");
                return;
            }

            playerName = playerName.trim();
        }

        alert("Привет, " + playerName + "! Игра начинается.");

        const result = firstStage(playerName);
        alert(result);

        playAgain = confirm("Хотите сыграть ещё раз?");
    }

    alert("Спасибо за игру!");
}

function firstStage(playerName) {
    let choice = prompt(
        playerName + ", пара ещё идёт. Что будешь делать?\n" +
        "1 — тихо выйти через дверь\n" +
        "2 — выпрыгнуть в окно\n" +
        "3 — притвориться, что пошёл в туалет"
    );

    choice = validateChoice(choice, 1, 3);

    if (choice === null) {
        return "Игра прервана.";
    }

    if (choice === 1) {
        alert("Ты подошёл к двери, но преподаватель заметил движение.");
        return secondStageDoor(playerName);
    }

    if (choice === 2) {
        return "Плохая идея. Аудитория на третьем этаже. Ты проиграл.";
    }

    return secondStageToilet(playerName);
}

function secondStageDoor(playerName) {
    const teacherDistracted = confirm(
        "Преподаватель отвернулся к доске. Попробуешь выйти прямо сейчас?"
    );

    if (!teacherDistracted) {
        return "Ты остался сидеть до конца пары. Формально это не побег, но зато безопасно.";
    }

    let answer = prompt(
        playerName + ", преподаватель спрашивает: «Куда это вы?»\n" +
        "1 — В библиотеку\n" +
        "2 — В туалет\n" +
        "3 — Домой, мне скучно"
    );

    answer = validateChoice(answer, 1, 3);

    if (answer === null) {
        return "Игра прервана.";
    }

    if (answer === 2) {
        return "Преподаватель поверил. Ты успешно вышел из аудитории и победил!";
    }

    if (answer === 1) {
        return "Преподаватель сказал, что библиотека подождёт до перемены. Побег провалился.";
    }

    return "Честность была лишней. Преподаватель попросил тебя остаться до конца пары.";
}

function secondStageToilet(playerName) {
    alert("Ты сказал, что идёшь в туалет. Преподаватель подозрительно посмотрел на тебя.");

    let minutes = prompt(
        playerName + ", через сколько минут ты вернёшься?\n" +
        "Введите число от 1 до 10:"
    );

    minutes = validateNumber(minutes, 1, 10);

    if (minutes === null) {
        return "Игра прервана.";
    }

    if (minutes <= 3) {
        return "Слишком подозрительно быстро. Преподаватель сказал: «Потерпишь до перемены». Побег не удался.";
    }

    if (minutes <= 7) {
        return "Ответ звучит правдоподобно. Тебя отпустили. Ты успешно сбежал с пары!";
    }

    return "Преподаватель понял, что ты явно не собираешься возвращаться. План раскрыт.";
}

function validateChoice(value, min, max) {
    while (true) {
        if (value === null) {
            return null;
        }

        value = value.trim();

        if (value === "") {
            value = prompt("Ввод не должен быть пустым. Введите число от " + min + " до " + max + ":");
            continue;
        }

        if (!isInteger(value)) {
            value = prompt("Нужно ввести именно целое число от " + min + " до " + max + ":");
            continue;
        }

        value = Number(value);

        if (value < min || value > max) {
            value = prompt("Число вне диапазона. Введите число от " + min + " до " + max + ":");
            continue;
        }

        return value;
    }
}

function validateNumber(value, min, max) {
    while (true) {
        if (value === null) {
            return null;
        }

        value = value.trim();

        if (value === "") {
            value = prompt("Поле пустое. Введите число от " + min + " до " + max + ":");
            continue;
        }

        if (!isInteger(value)) {
            value = prompt("Введите целое число от " + min + " до " + max + ":");
            continue;
        }

        value = Number(value);

        if (value < min || value > max) {
            value = prompt("Число должно быть в диапазоне от " + min + " до " + max + ":");
            continue;
        }

        return value;
    }
}

function isInteger(value) {
    return /^-?\d+$/.test(value);
}