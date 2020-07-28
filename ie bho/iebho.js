var old_name = '';

function get_name() {
    var patient = window.mrightFrame.workFrame.document.getElementById('tbPatient');
    return patient.rows[0].cells[5].innerText.split(' ')[0];
}

function check() {
    var name = get_name();
    if (name != old_name) {
        old_name = name;
        console.log('menzheng new  ' + name + '  ' + new Date());
        alert(name);
    }
}

var times = setInterval(function () {
    var first = window.mrightFrame;
    if (first != undefined && first != null) {
        try {
            var second = first.workFrame;
            if (second != undefined && second != null) {
                try {
                    var d = window.mrightFrame.workFrame.document;

                    if (d != undefined && d != null) {
                        var disabled = window.mrightFrame.workFrame.document.getElementById('btnFayao').disabled;
                        if (disabled == false)
                            check();
                        else
                            console.log('menzheng old ' + new Date());
                    }
                } catch (err) {
                    console.log(err.message,'menzheng second undfined');
                }
            }
        } catch (err) {
            console.log(err.message,'menzheng first undfined');
        }
    }
}, 2000);




var old_lblname = '';

function get_lblname() {

    var patient = window.mrightFrame.workFrame.document.getElementById('lblname');
    return patient.innerText;
}

function check2() {
    var name = get_lblname();
    if (name != old_lblname) {
        old_lblname = name;
        console.log('zhuyuan new ' + name + '  ' + new Date());
        alert(name);
    }
}
var times2 = setInterval(function () {
    var first = window.mrightFrame;
    if (first != undefined && first != null) {
        try {
            var second = first.workFrame;
            if (second != undefined && second != null) {
                try {
                    var patient = window.mrightFrame.workFrame.document;
                    if (patient != undefined && patient != null) {
                        check2();
                    } else {
                        console.log('zhuyuan old' + new Date())
                    }
                } catch (err) {
                    console.log(err.message,'zhuyuan second');
                }
            }
        } catch (err) {
            console.log(err.message,'zhuyuan first');
        }
    }
}, 2000);

var times2 = setInterval(function () {
    var first = '';
    try {
        first = window.mrightFrame;
    } catch (e) {
        first = undefined;
        alert('first undefined');
    }
    if (first != undefined) {
        var second = '';
        try {
            second = window.mrightFrame.workFrame;
        } catch (e) {
            second = undefined;
            alert('second undefined');
        }
        if (second != undefined) {
            var patient = '';
            try {
                patient = window.mrightFrame.workFrame.document
            } catch (e) {
                patient = undefined;
                alert('patient undefined');
            }
            if (parent != undefined) {
                check2();
            }

        }
    }
}, 1000);





var iframes = document.getElementsByTagName("iframe");
for (var i = 0; i < iframes.length; i++) {
    if (iframes[i].name == "main") {
        var current = iframes[i].contentDocument || iframes[i].contentWindow.document;
        console.log(current.getElementById('mdiv').innerText);
    }
    console.log(iframes[i].name);

}
