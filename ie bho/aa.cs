using System;
using System.Net;
using System.IO;
using System.Text;
namespace HelloWorldApplication
{
    class HelloWorld
    {
        static int Hello(string names)
        {
            Console.WriteLine(names);
            return 0;
        }
        static string HttpPost(string postDataStr)
        {
            /*
            try
            {
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:8000/opendata/tourist/");
                webRequest.Method = "GET";
                webRequest.ContentType = "application/json";
                webRequest.Accept = "application/json";
                //webRequest.Headers.Add("Authorization", GlobalVariable.NowLoginUser.JwtKey);

                HttpWebResponse webResponse = (HttpWebResponse)webRequest.GetResponse();
                StreamReader reader = new StreamReader(webResponse.GetResponseStream(), Encoding.UTF8);
                String res = reader.ReadToEnd();
                reader.Close();
                return res.Trim();
            }
            catch (Exception ex)
            {

                return null;
            }
            http://127.0.0.1:8000/opendata/test
            */

            WebRequest request = WebRequest.Create("http://121.204.198.52:8809/v13/opendata/test/");
            request.Method = "POST";
            request.ContentType = "application/json";
            byte[] buf = Encoding.UTF8.GetBytes(postDataStr);
            byte[] byteArray = System.Text.Encoding.Default.GetBytes(postDataStr);
            request.ContentLength = Encoding.UTF8.GetByteCount(postDataStr);
            request.GetRequestStream().Write(buf, 0, buf.Length);
            WebResponse response = request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8"));
            string retString = myStreamReader.ReadToEnd();
            myStreamReader.Close();
            myResponseStream.Close();
            return null;

        }

        static void Main(string[] args)
        {
            /* 我的第一个 C# 程序*/
            Console.WriteLine("Hello World");
            Hello("mark");
            Console.WriteLine(HttpPost("{\"hello\":\"C#  mirco\"}"));
            //Console.ReadKey();
        }
    }
}