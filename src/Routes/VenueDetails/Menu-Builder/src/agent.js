import $ from 'jquery';

import { functions, firestore, storage } from '../../../../firebase';

/* eslint-disable */

async function getMenu(id) {
    var qs = getQueryStrings();

    let lang = qs.lang

    if (!lang) {
        lang = "en"
    }

    return new Promise((res, rej) => $.ajax({
        url: "https://sally.app/php-test/menu_get.php",
        type: "POST",
        data: { v_id: id, lang: lang },
        dataType: 'json',
        success: function (php_script_response, data) {
            console.log(php_script_response)
            res(php_script_response);
        },
        error: function (error) { alert('Error whilst getting menu, ' + JSON.stringify(error)); rej(error) }
    }));
}

function saveMenu(id, menu) {
    // toast("loading")
    var qs = getQueryStrings();

    let lang = qs.lang

    if (!lang) {
        lang = "en"
    }

    return new Promise((res, rej) => $.ajax({
        url: "https://sally.app/php-test/menu_save.php",
        type: "POST",
        data: { v_id: id, lang: lang, menu: JSON.stringify(menu) },
        dataType: "text",
        success: function (php_script_response, data) {
            res(php_script_response);
        },
        error: function (error) { alert('Error whilst saving menu, ' + JSON.stringify(error)); rej(error) }
    }));
}

async function publishMenu(id, menu) {
    // toast("loading")

    var qs = getQueryStrings();

    let lang = qs.lang

    if (!lang) {
        lang = "en"
    }

    const func = functions.httpsCallable("admin-venue-menu-save")

    const [publishRes, saveRes] = await Promise.all([
        func({ v_id: id, menu: menu, lang: lang }),
        saveMenu(id, menu)
    ]).catch(error => {
        console.log(error)
        alert("an unexpected error has occured")
    })

    console.log(publishRes)
    console.log(saveRes)
}

async function saveImage(id, image) {
    if (!image) {
        return;
    }
    const extension = image.name.split(".")[1].toLowerCase()

    if (extension !== "png" && extension !== "jpg" && extension !== "jpeg") {
        return;
    }

    const imageID = firestore.collection("tmp").doc().id
    const imageRef = storage.ref(`venues/${id}/menu/`).child(imageID + "." + extension)

    await imageRef.put(image)

    const url = await imageRef.getDownloadURL()

    return url
}

export default {
    getMenu,
    saveMenu,
    publishMenu,
    saveImage
}

function getQueryStrings() {
    var assoc = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0])] = decode(key[1]);
        }
    }

    return assoc;
}