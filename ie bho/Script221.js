var old_info = '';
function getMan() {
    var table = window.frames[2].frames[0].document.getElementById('gvInfo');
    var t = '';
    for (var i = 1; i < table.rows.length; i++) {
        t += table.rows[i].cells[0].innerText + ';' + table.rows[i].cells[2].innerText + '*';
    }
    return t;
}

ftimer = setInterval(function () {
    var gvInfo = window.frames[2].frames[0].document.getElementById('gvInfo');
    if (gvInfo != undefined && gvInfo != null) {
        var info = getMan();
        if (info == '') {

        }
        else {
            if (old_info == info) {

            }
            else {
                old_info = info;
                alert(info);
            }
        }
    }
    else {

    }
}, 1000);

var old_info = ''; function getMan() { var table = window.frames[2].frames[0].document.getElementById('gvInfo'); var t = ''; for (var i = 1; i < table.rows.length; i++) { t += table.rows[i].cells[0].innerText + ';' + table.rows[i].cells[2].innerText + '*' } return t } ftimer = setInterval(function () { var gvInfo = window.frames[2].frames[0].document.getElementById('gvInfo'); if (gvInfo != undefined && gvInfo != null) { var info = getMan(); if (info == '') { } else { if (old_info == info) { } else { old_info = info; alert(info) } } } else { } }, 1000);