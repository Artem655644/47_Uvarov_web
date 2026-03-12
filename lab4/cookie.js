function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);

    const encodedName = encodeURIComponent(name);
    const encodedValue = encodeURIComponent(value);
    const expires = "expires=" + expirationDate.toUTCString();

    document.cookie = encodedName + "=" + encodedValue + ";" + expires + ";path=/";
}

function getCookie(name) {
    const encodedName = encodeURIComponent(name) + "=";
    const cookieArray = document.cookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
        let cookieItem = cookieArray[i].trim();

        if (cookieItem.indexOf(encodedName) === 0) {
            return decodeURIComponent(cookieItem.substring(encodedName.length));
        }
    }

    return null;
}

function deleteCookie(name) {
    document.cookie = encodeURIComponent(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}