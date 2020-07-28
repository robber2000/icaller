// JavaScript source code
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;

using SHDocVw;
using mshtml;
using System.IO;
using Microsoft.Win32;
using System.Runtime.InteropServices;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Runtime.InteropServices.Expando;
using System.Reflection;




namespace IEMonitor
{
    /* define the IObjectWithSite interface which the BHO class will implement.
     * The IObjectWithSite interface provides simple objects with a lightweight siting mechanism (lighter than IOleObject).
     * Often, an object must communicate directly with a container site that is managing the object. 
     * Outside of IOleObject::SetClientSite, there is no generic means through which an object becomes aware of its site. 
     * The IObjectWithSite interface provides a siting mechanism. This interface should only be used when IOleObject is not already in use.
     * By using IObjectWithSite, a container can pass the IUnknown pointer of its site to the object through SetSite. 
     * Callers can also get the latest site passed to SetSite by using GetSite.
     */
    [
        ComVisible(true),
        InterfaceType(ComInterfaceType.InterfaceIsIUnknown),
        Guid("FC4801A3-2BA9-11CF-A229-00AA003D7352")
    // Never EVER change this UUID!! It allows this BHO to find IE and attach to it
    ]
    public interface IObjectWithSite
    {
        [PreserveSig]
        int SetSite([MarshalAs(UnmanagedType.IUnknown)]object site);
        [PreserveSig]
        int GetSite(ref Guid guid, out IntPtr ppvSite);
    }

    [
        ComVisible(true),
        Guid("4C1D2E51-018B-4A7C-8A07-618452573E42"),
        InterfaceType(ComInterfaceType.InterfaceIsDual)
    ]
    public interface IExtension
    {
        [DispId(1)]
        int sendMsgToQt(string s);
        int ie_add(int a,int b);
        void sendPatientInfo(string info);
    }

    /* The BHO site is the COM interface used to establish a communication.
     * Define a GUID attribute for your BHO as it will be used later on during registration / installation
     */
    [
            ComVisible(true),
            Guid("2788CB25-EF9A-54C1-B43C-E30D1A4A1992"),
            ClassInterface(ClassInterfaceType.None), ProgId("toQt"),
            ComDefaultInterface(typeof(IExtension))
    ]
    public class BHO : IObjectWithSite, IExtension
    {
        private WebBrowser webBrowser;

        private string cUrl = null;

        // function list id
        private ArrayList funcList = new ArrayList();

        public const string BHO_REGISTRY_KEY_NAME =
               "Software\\Microsoft\\Windows\\" +
               "CurrentVersion\\Explorer\\Browser Helper Objects";

        //消息标识

        private const int WM_COPYDATA = 0x004A;

        //消息数据类型(typeFlag以上二进制，typeFlag以下字符)

        private const uint typeFlag = 0x8000;


        /* The SetSite() method is where the BHO is initialized and where you would perform all the tasks that happen only once.
         * When you navigate to a URL with Internet Explorer, you should wait for a couple of events to make sure the required document
         * has been completely downloaded and then initialized. Only at this point can you safely access its content through the exposed
         * object model, if any. This means you need to acquire a couple of pointers. The first one is the pointer to IWebBrowser2, 
         * the interface that renders the WebBrowser object. The second pointer relates to events.
         * This module must register as an event listener with the browser in order to receive the notification of downloads
         * and document-specific events.
         */
        public int SetSite(object site)
        {
            if (site != null)
            {
                webBrowser = (WebBrowser)site;
                webBrowser.DocumentComplete +=
                  new DWebBrowserEvents2_DocumentCompleteEventHandler(
                  this.OnDocumentComplete);
            }
            else
            {
                webBrowser.DocumentComplete -=
                  new DWebBrowserEvents2_DocumentCompleteEventHandler(
                  this.OnDocumentComplete);
                webBrowser = null;
            }

            return 0;
        }

        public int GetSite(ref Guid guid, out IntPtr ppvSite)
        {
            IntPtr punk = Marshal.GetIUnknownForObject(webBrowser);
            int hr = Marshal.QueryInterface(punk, ref guid, out ppvSite);
            Marshal.Release(punk);
            return hr;
        }


        public void sendPatientInfo(string info)
        {
            Type ty = info.GetType();
            string aa = "{\"name\":\""+info.ToString()+".\"}";
            //Messagebox.
            //string aa = "{'data':'" + msg + "'}";
            //string aa = "{\"data\":\"" + msg.ToString()  + "\"";
            //WebRequest request = WebRequest.Create("http://121.204.198.52:8809/v13/opendata/test/");
            WebRequest request = WebRequest.Create("http://127.0.0.1:8888/importdata/");
            request.Method = "POST";
            request.ContentType = "application/json;charset=UTF-8";
            byte[] buf = Encoding.UTF8.GetBytes(aa);
            byte[] byteArray = System.Text.Encoding.Default.GetBytes(aa);
            request.ContentLength = Encoding.UTF8.GetByteCount(aa);
            request.GetRequestStream().Write(buf, 0, buf.Length);
            WebResponse response = request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8"));
            string retString = myStreamReader.ReadToEnd();
            myStreamReader.Close();
            myResponseStream.Close();
            

        }

        private string GetLocalIp()
        {
            IPHostEntry ipe = Dns.GetHostEntry(Dns.GetHostName());

            IPAddress[] ipas = ipe.AddressList;
            for (int n = 0; n < ipas.Length; n++)
            {
                string ipS = ipas[n].ToString();
                if (ipS.Contains("."))
                {
                    return ipS;
                }
            }

            return "127.0.0.1";
        }

        public void OnDocumentComplete(object pDisp, ref object URL)
        {
          
            HTMLDocument document = (HTMLDocument)webBrowser.Document;
            dynamic window = document.parentWindow;
            IExpando ScriptObject = (IExpando)window;
            PropertyInfo btnEvent = ScriptObject.GetProperty("toQt", BindingFlags.Default);
            if (btnEvent == null) btnEvent = ScriptObject.AddProperty("toQt");
            btnEvent.SetValue(ScriptObject, this, null);
            IHTMLElement head = (IHTMLElement)((IHTMLElementCollection)
                                    document.all.tags("head")).item(null, 0);
            IHTMLScriptElement scriptObject =(IHTMLScriptElement)document.createElement("script");
            scriptObject.type = @"text/javascript";
            //scriptObject.text = "alert('aa')";
            //scriptObject.text = "var myEles = document.getElementById('su'); if(myEles != undefined && myEles != null) {myEles.valuvalu";
            //scriptObject.text = "var data={'aa':document.getElementById('names')};$.ajax({type: 'POST',url: 'http://127.0.0.1:8000/opendata/test/',contentType: 'application/json;charset=utf-wind8',dataType: 'json',data: JSON.stringify(data),success: function (data) {  //console.log(data);})";
            //scriptObject.text = "  $('#btnQuery').click(function(){var trs=document.querySelectorAll('tr.DataGridItem');var keys=['流水号','处方号','姓名','病历号','看诊医生','看诊时间','是否已发药','发药时间','发药人员','处方(含耗材)金额','退药'];var data=[];for(var i=0;i<trs.length;i++){tds=trs[i].querySelectorAll('td');var item={};item={'流水号':tds[0].innerText,'处方号':tds[1].innerText,'姓名':tds[2].innerText,'病历号':tds[3].innerText,'看诊医生':tds[4].innerText,'看诊时间':tds[5].innerText,'是否已发药':tds[6].innerText,'发药时间':tds[7].innerText,'发药人员':tds[8].innerText,'处方(含耗材)金额':tds[9].innerText};data.push(item)};$.ajax({type:'POST',url:'http://121.204.198.52:8809/v13/opendata/test/',contentType:'application/json;charset=utf-8',dataType:'json',data:JSON.stringify(data),success:function(data){}})});";
            //scriptObject.text = "  $('#btnQuery').click(function(){var trs=document.querySelectorAll('tr.DataGridItem');var keys=['流水号','处方号','姓名','病历号','看诊医生','看诊时间','是否已发药','发药时间','发药人员','处方(含耗材)金额','退药'];var data=[];for(var i=0;i<trs.length;i++){tds=trs[i].querySelectorAll('td');var item={};item={'流水号':tds[0].innerText,'处方号':tds[1].innerText,'姓名':tds[2].innerText,'病历号':tds[3].innerText,'看诊医生':tds[4].innerText,'看诊时间':tds[5].innerText,'是否已发药':tds[6].innerText,'发药时间':tds[7].innerText,'发药人员':tds[8].innerText,'处方(含耗材)金额':tds[9].innerText};data.push(item)};$.ajax({type:'POST',url:'http://121.204.198.52:8809/v13/opendata/test/',contentType:'application/json;charset=utf-8',dataType:'json',data:JSON.stringify(data),success:function(data){}})});";
            //scriptObject.text = "  $('#btnQuery').click(var data={'tttt':'3dy.me'};$.ajax({type:'POST',url:'http://121.204.198.52:8809/v13/opendata/test/',contentType:'application/json;charset=utf-8',dataType:'json',data:JSON.stringify(data),success:function(data){}})});";
            //scriptObject.text = "  $('#btnQuery').click(var data={'tttt':'3dy.me'};$.ajax({type:'POST',url:'http://121.204.198.52:8809/v13/opendata/test/',contentType:'application/json;charset=utf-8',dataType:'json',data:JSON.stringify(data),success:function(data){}})});";
            //scriptObject.text = "  $(window.parent.frames['ifWorkFrame'].document).find('input#btnQuery').click(function(){alert('aa')})";
            //document.getElementById(id).contentDocument
            //scriptObject.text = "  $('#input').click(function(){alert('aa')})";
            //通知栏所在区域，打开区域
            //window.parent.document.getElementsByTagName('frameset')[2].setAttribute('rows', '105,*')
            //病人取药的tables
            //window.frames[2].frames[0].document.getElementById("gvInfo").innerText
            //查询按钮
            //window.frames[2].frames[0].document.getElementById("btnQuery").value

            //发药按钮（详情页内）
            //btnFayao window.frames[2].frames[0].document.getElementById("btnFayao")
            //  病人信息，名字，性别，年龄
            //病人信息（详情页内）
            //var tab = window.frames[2].frames[0].document.getElementById("tbPatient").rows[0].cells[5].innerHTML.split(" ")[0];


            //table.row[1].cells[10].onmouseover = function(){ alert("ss")}
            //}
            //测试调用自定义的DLL window.toQt.ie_add(99,100)+''
            // scriptObject.text = "var myEles = document.getElementById('su'); var kw=document.getElementById('kw').value ; myEles.onclick=aaa(kw);function aaa(kw){alert(window.toQt.ie_add(99,100));}";
            //scriptObject.text = "var sub = window.frames[1].document.getElementById('td_left');";
            //scriptObject.text += "var card=document.createElement('div');card.style.height='200px';card.style.width='200px';card.style.backgroundColor='#007fbb';card.style.setAttribute('position','absolute');card.style.left='20px';card.style.top='30px';sub.appendChild(card);var title=document.createElement('div');title.style.setAttribute('position','absolute');title.style.left='5%';title.style.width='55%';title.style.height='50px';title.style.paddingLeft='35%';title.style.fontSize='36px';title.style.marginTop='30px';title.style.color='#fff';title.style.borderBottom='1px solid #fff';title.innerText='18';card.appendChild(title);var man=document.createElement('div');man.style.setAttribute('position','absolute');man.style.top='100px';man.style.left='5%';man.style.width='55%';man.style.height='50px';man.style.paddingLeft='18%';man.style.fontSize='36px';man.style.color='#fff';man.innerText='马若莉';card.appendChild(man);";
            //scriptObject.text += "var sub=document.createElement('div');sub.style.height='105px';sub.style.width='1000px';sub.style.backgroundColor='#ededed';document.getElementById('sub').appendChild(sub);var card=document.createElement('div');card.style.height='100px';card.style.width='120px';card.style.backgroundColor='#007fbb';card.style.setAttribute('position','absolute');card.style.left='20px';card.style.top='5px';sub.appendChild(card);var title=document.createElement('div');title.style.setAttribute('position','absolute');title.style.left='5%';title.style.width='55%';title.style.height='30px';title.style.paddingLeft='35%';title.style.fontSize='24px';title.style.color='#fff';title.style.borderBottom='1px solid #fff';title.innerText='18';card.appendChild(title);var man=document.createElement('div');man.style.setAttribute('position','absolute');man.style.top='50px';man.style.left='5%';man.style.width='55%';man.style.height='30px';man.style.paddingLeft='18%';man.style.fontSize='22px';man.style.color='#fff';man.innerText='马若莉';card.appendChild(man);";
            //window.frames[2].frames[0].document.getElementById('btnFayao')
            //scriptObject.text = "window.frames[2].frames[0].document.getElementById('btnQuery').onmouseover=function(){alert('hasssshhaa ')}";
            //document.getElementById('main').onmouseover=function(){alert('hasssshhaa ')}
            //scriptObject.text = "var sub = window.frames[1].document.getElementById('td_left');";
            //scriptObject.text += "var card=document.createElement('div');card.style.height='200px';card.style.width='200px';card.style.backgroundColor='#007fbb';card.style.setAttribute('position','absolute');card.style.left='20px';card.style.top='30px';sub.appendChild(card);var title=document.createElement('div');title.style.setAttribute('position','absolute');title.style.left='5%';title.style.width='55%';title.style.height='50px';title.style.paddingLeft='35%';title.style.fontSize='36px';title.style.marginTop='30px';title.style.color='#fff';title.style.borderBottom='1px solid #fff';title.innerText='18';card.appendChild(title);var man=document.createElement('div');man.style.setAttribute('position','absolute');man.style.top='100px';man.style.left='5%';man.style.width='55%';man.style.height='50px';man.style.paddingLeft='18%';man.style.fontSize='36px';man.style.color='#fff';man.innerText='马若莉';card.appendChild(man);";
            //scriptObject.text += "var sub=document.createElement('div');sub.style.height='105px';sub.style.width='1000px';sub.style.backgroundColor='#ededed';document.getElementById('sub').appendChild(sub);var card=document.createElement('div');card.style.height='100px';card.style.width='120px';card.style.backgroundColor='#007fbb';card.style.setAttribute('position','absolute');card.style.left='20px';card.style.top='5px';sub.appendChild(card);var title=document.createElement('div');title.style.setAttribute('position','absolute');title.style.left='5%';title.style.width='55%';title.style.height='30px';title.style.paddingLeft='35%';title.style.fontSize='24px';title.style.color='#fff';title.style.borderBottom='1px solid #fff';title.innerText='18';card.appendChild(title);var man=document.createElement('div');man.style.setAttribute('position','absolute');man.style.top='50px';man.style.left='5%';man.style.width='55%';man.style.height='30px';man.style.paddingLeft='18%';man.style.fontSize='22px';man.style.color='#fff';man.innerText='马若莉';card.appendChild(man);";
            //scriptObject.text="window.frames[2].frames[0].document.getElementById('btnQuery').onmouseover = function(){ var info = getMan(); window.toQt.sendPatientInfo(info)}; function getMan() { var table = window.frames[2].frames[0].document.getElementById('gvInfo'); var t = ''; for (var i = 1; i < table.rows.length; i++) { t += table.rows[i].cells[0].innerText + ';' + table.rows[i].cells[2].innerText + '*'} return t};";
            //scriptObject.text = "var old_info = ''; ftimer = setInterval(function () { var gvInfo = window.frames[2].frames[0].document.getElementById('gvInfo'); if (gvInfo != undefined && gvInfo!= null) { var info = getMan(); if (info == '') { } else { if (old_info == info) { } else { old_info = info; alert(info); } } } else { } }, 1000);";
            //正确版本 
            //scriptObject.text = "var old_info = ''; function getMan() { var table = window.frames[2].frames[0].document.getElementById('gvInfo'); var t = ''; for (var i = 1; i < table.rows.length; i++) { t += table.rows[i].cells[0].innerText + ';' + table.rows[i].cells[2].innerText + '*' } return t }ftimer = setInterval(function() { var gvInfo = window.frames[2].frames[0].document.getElementById('gvInfo'); if (gvInfo != undefined && gvInfo != null) { var info = getMan(); if (info == '') { } else { if (old_info == info) { } else { old_info = info; window.toQt.sendPatientInfo(info);alert('bug--->'+info); } } } else { } }, 1000); ";
            //scriptObject.text = "function createXMLHttpRequest(){if(window.XMLHttpRequest){xmlHttp=new XMLHttpRequest()}else{if(window.ActiveXObject){xmlHttp=new ActiveXObject('Microsoft.XMLHTTP')}}return xmlHttp;} ";
            //scriptObject.text  = scriptObject.text+ "var old_info = ''; function getMan() { var table = window.frames[2].frames[0].document.getElementById('gvInfo'); var t = ''; for (var i = 1; i < table.rows.length; i++) { t += table.rows[i].cells[0].innerText + ';' + table.rows[i].cells[2].innerText + '*' } return t }ftimer = setInterval(function() { var gvInfo = window.frames[2].frames[0].document.getElementById('gvInfo'); if (gvInfo != undefined && gvInfo != null) { var info = getMan(); if (info == '') { } else { if (old_info == info) { } else { old_info = info; alert('22bug'+info); var xmlHttp=createXMLHttpRequest();xmlHttp.onreadystatechange=function(){};xmlHttp.open('POST','http://121.204.198.52:8809/v13/opendata/test/',true);xmlHttp.setRequestHeader('Content-Type','application/json');xmlHttp.send(JSON.stringify({'A':333}));             } } } else { } }, 1000); ";
            //scriptObject.text="function ajax(options) { options = options ||{ }; optoins.type = (options.type || 'GET').toUpperCase(); options.dataType = options.dataType || 'json';params= formatParams(options.data); var xhr; if (window.XMLHttpRequest) { xhr = new XMLHttpRequest()} else { xhr = ActiveXObject('Microsoft.XMLHTTP')} xhr.onreadystatechange = function(){ if (xhr.readyState == 4) { var status = xhr.status; if (status >= 200 && status < 300) { options.success && options.success(xhr.responseText, xhr.responseXML)} else { options.error && options.error(status)} } } if (options.type == 'GET') { xhr.open('GET', options.url + '?' +params, true); xhr.send(null)} else if (options.type == 'POST') { xhr.open('POST', options.url, true); xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); xhr.send(params)} }  function formatParams(data) { var arr =[];for(var name in data) { arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))} arr.push(('v='Math.random()).replace('.', '')); return arr.join('&')} ajax({ url: 'http://121.204.198.52:8809/v13/opendata/test/',type: 'POST',dataType: 'json',data: { name: '马各马它',age: 18},success: function(response, xml){ },error: function(status){ } });";
            //string aa = "hello";
            scriptObject.text = @" var old_name = '';

function get_name() {
    var patient = window.mrightFrame.workFrame.document.getElementById('tbPatient');
    return patient.rows[0].cells[5].innerText.split(' ')[0];
}

function check() {
    var name = get_name();
    if (name != old_name) {
        old_name = name;
        window.toQt.sendPatientInfo(name)
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
                      
                    }
                } catch (err) {
                   
                }
            }
        } catch (err) {
           
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
        window.toQt.sendPatientInfo(name)
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
                    } 
                } catch (err) {
                   
                }
            }
        } catch (err) {
            
        }
    }
}, 2000);
            ";
            ((HTMLHeadElement)head).appendChild((IHTMLDOMNode)scriptObject);

      

        }

        public int ie_add(int a,int b)
        {
            //初始化LED的SDK
            ImportFromDLL.InitSdk(2, 2);
            sendMsgToQt(a.ToString()+"4vv"+b.ToString());
            return 2222;
        }

        public int sendMsgToQt(string msg)
        {
            //WriteLog("toQt", msg);
            string strDlgTitle = "Form1";

            //did work
            SendString(strDlgTitle, 0,msg);

            //todo-test
            IntPtr hwndRecvWindow = ImportFromDLL.FindWindow(null, strDlgTitle);
            if (hwndRecvWindow == IntPtr.Zero)
            {
                //WriteLog("error", "请先启动接收消息程序");
                //MessageBox.Show("请先启动接收消息程序");
                return 100;
            }
            else
            {
                //WriteLog("log", "found recv message window...");
                //MessageBox.Show("找到窗口");
               // return 200;
            }

            //ImportFromDLL.FindWindow(null, strDlgTitle)
            IntPtr hwndSendWindow = ImportFromDLL.GetConsoleWindow();
            if (hwndSendWindow == IntPtr.Zero)
            {
                 //WriteLog("error", "获取自己的窗口句柄失败，请重试");
                //MessageBox.Show("获取自己的窗口句柄失败，请重试");
               return  300;
            }

            for (int i = 0; i < 10; i++)
            {
                string strText = DateTime.Now.ToString();
                ImportFromDLL.COPYDATASTRUCT copydata = new ImportFromDLL.COPYDATASTRUCT();
                //copydata.cbData = Encoding.Default.GetBytes(strText).Length;
                copydata.cbData = 22;
                copydata.lpData = strText;

                ImportFromDLL.SendMessage(hwndRecvWindow, ImportFromDLL.WM_COPYDATA, hwndSendWindow, ref copydata);

                //WriteLog("success", strText);
            }
            return 999;

        }


        public struct COPYDATASTRUCT
        {

            public IntPtr dwData;

            public int cbData;

            public IntPtr lpData;

        }



        [DllImport("User32.dll", EntryPoint = "SendMessage")]

        private static extern int SendMessage(
            int hWnd,                                 // handle to destination window
            int Msg,                              // message
            int wParam,                               // first message parameter
            ref COPYDATASTRUCT lParam    // second message parameter
            ); 

        [DllImport("User32.dll", EntryPoint = "FindWindow")]

        private static extern int FindWindow(string lpClassName, string lpWindowName);



        //发送数据委托与事件定义

        public delegate void SendStringEvent(object sender, uint flag, string str);

        public delegate void SendBytesEvent(object sender, uint flag, byte[] bt);

        public event SendStringEvent OnSendString;

        public event SendBytesEvent OnSendBytes;


        /// 发送字符串格式数据

        /// </summary>

        /// <param name="destWindow">目标窗口标题</param>

        /// <param name="flag">数据标志</param>

        /// <param name="str">数据</param>

        /// <returns></returns>

        public bool SendString(string destWindow, uint flag, string str)
        {

            if (flag > typeFlag)
            {

                ///WriteLog("error", "要发送的数据不是字符格式");

                return false;

            }

            int WINDOW_HANDLER = FindWindow(null, @destWindow);

            if (WINDOW_HANDLER == 0)
            {
                //WriteLog("error", "not found window");
                return false;
            }
            try
            {

                byte[] sarr = System.Text.Encoding.Default.GetBytes(str);

                COPYDATASTRUCT cds;

                cds.dwData = (IntPtr)flag;

                cds.cbData = sarr.Length;

                cds.lpData = Marshal.AllocHGlobal(sarr.Length);

                Marshal.Copy(sarr, 0, cds.lpData, sarr.Length);

                SendMessage(WINDOW_HANDLER, WM_COPYDATA, 0, ref cds);

                if (OnSendString != null)
                {

                    OnSendString(this, flag, str);

                }

                return true;

            }

            catch (Exception e)
            {

                //WriteLog("error", e.Message);

                return false;

            }

        }

        /// <summary>

        /// 发送二进制格式数据

        /// </summary>

        /// <param name="destWindow">目标窗口</param>

        /// <param name="flag">数据标志</param>

        /// <param name="data">数据</param>

        /// <returns></returns>

        public bool SendBytes(string destWindow, uint flag, byte[] data)
        {

            if (flag <= typeFlag)
            {

                //WriteLog("error", "要发送的数据不是二进制格式");

                return false;

            }

            int WINDOW_HANDLER = FindWindow(null, @destWindow);

            if (WINDOW_HANDLER == 0) return false;

            try
            {

                COPYDATASTRUCT cds;

                cds.dwData = (IntPtr)flag;

                cds.cbData = data.Length;

                cds.lpData = Marshal.AllocHGlobal(data.Length);

                Marshal.Copy(data, 0, cds.lpData, data.Length);

                SendMessage(WINDOW_HANDLER, WM_COPYDATA, 0, ref cds);

                if (OnSendBytes != null)
                {

                    OnSendBytes(this, flag, data);

                }

                return true;

            }

            catch (Exception e)
            {

                ///WriteLog("error", e.Message);

                return false;

            }

        }









        /* The Register method simply tells IE which is the GUID of your extension so that it could be loaded.
         * The "No Explorer" value simply says that we don't want to be loaded by Windows Explorer.
         */
        [ComRegisterFunction]
        public static void RegisterBHO(Type type)
        {
            RegistryKey registryKey =
              Registry.LocalMachine.OpenSubKey(BHO_REGISTRY_KEY_NAME, true);

            if (registryKey == null)
                registryKey = Registry.LocalMachine.CreateSubKey(
                                        BHO_REGISTRY_KEY_NAME);

            string guid = type.GUID.ToString("B");
            RegistryKey ourKey = registryKey.OpenSubKey(guid);

            if (ourKey == null)
            {
                ourKey = registryKey.CreateSubKey(guid);
            }

            ourKey.SetValue("NoExplorer", 1, RegistryValueKind.DWord);

            registryKey.Close();
            ourKey.Close();
        }

        [ComUnregisterFunction]
        public static void UnregisterBHO(Type type)
        {
            RegistryKey registryKey =
              Registry.LocalMachine.OpenSubKey(BHO_REGISTRY_KEY_NAME, true);
            string guid = type.GUID.ToString("B");

            if (registryKey != null)
                registryKey.DeleteSubKey(guid, false);
        }

    }

    //只是对调用的DLL进行类的封装
    public class ImportFromDLL
    {
        public const int WM_COPYDATA = 0x004A;

        //启用非托管代码  
        [StructLayout(LayoutKind.Sequential)]
        public struct COPYDATASTRUCT
        {
            public int dwData;    //not used  
            public int cbData;    //长度  
            [MarshalAs(UnmanagedType.LPStr)]
            public string lpData;
        }

        [DllImport("User32.dll")]
        public static extern int SendMessage(
            IntPtr hWnd,　　　  // handle to destination window   
            int Msg,　　　      // message  
            IntPtr wParam,　   // first message parameter   
            ref COPYDATASTRUCT pcd // second message parameter   
        );

        [DllImport("User32.dll", EntryPoint = "FindWindow")]
        public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

        [DllImport("Kernel32.dll", EntryPoint = "GetConsoleWindow")]
        public static extern IntPtr GetConsoleWindow();


        [DllImport("Led5kSDK.dll", EntryPoint = "InitSdk")]
        public static extern void InitSdk(byte minorVer, byte majorVer);
    }
}
