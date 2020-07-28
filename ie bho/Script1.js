// JavaScript source code
function getMan() {
    var table = window.frames[2].frames[0].document.getElementById('gvInfo');
    var t = '';
    for (var i = 1; i < table.rows.length; i++) {
        t += table.rows[i].cells[0].innerText + ';' + table.rows[i].cells[2].innerText + '*';
    }
    return t;
}
var t = window.frames[2].frames[0].document.getElementById('btnQuery');
if(t!=undefind&& t!=null)
window.frames[2].frames[0].document.getElementById('btnQuery').onmouseover = function () { alert(getMan()) }
window.frames[2].frames[0].document.getElementById('btnQuery').onmouseover = function () { var info=getMan(); window.toQt.sendPatientInfo(info) }

window.frames[2].frames[0].document.getElementById('btnQuery').onmouseover=function(){var info=getMan();window.toQt.sendPatientInfo(info)};function getMan(){var table=window.frames[2].frames[0].document.getElementById('gvInfo');var t='';for(var i=1;i<table.rows.length;i++){t+=table.rows[i].cells[0].innerText+';'+table.rows[i].cells[2].innerText+'*'}return t};

var  find_button=true;
function find(){
var btnQuery=window.frames[2].frames[0].document.getElementById('btnQuery')
if(btnQuery!=undefined){
 btnQuery.onmouseover=function(){var info=getMan();window.toQt.sendPatientInfo(info)};function getMan(){var table=window.frames[2].frames[0].document.getElementById('gvInfo');var t='';for(var i=1;i<table.rows.length;i++){t+=table.rows[i].cells[0].innerText+';'+table.rows[i].cells[2].innerText+'*'}return t};

}else
{window.setInterval(code,1000);}
}

function getMan() {
    var table = window.frames[2].frames[0].document.getElementById('gvInfo');
    var t = '';
    for (var i = 1; i < table.rows.length; i++) {
        t += table.rows[i].cells[0].innerText + ';' + table.rows[i].cells[2].innerText + '*';
    }
    return t;
}
var old_info = "";

var ftimer = setInterval(function () {
    var gvInfo = window.frames[2].frames[0].document.getElementById('gvInfo');
    if (gvInfo != undefined && gvInfo！=null) {
        //flag = false;
        var info = getMan();
        if (info == "") {
            //console.log("暂无信息");
        }
        else {
            if (old_info == info) {
                //console.log("数据与旧数据一相同");
            }
            else {
                old_info = info
                //console.log("提交新数据", info);
                alert(info)
            }
        }
    }
    else {
       // console.log("wait gvinfo");
    }
}, 1000);
