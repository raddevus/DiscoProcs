using PhotinoNET;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using NewLibre;


public class ResultMessageHandler{
  
    static public void MessageHandler(object? sender, string message) 
     {
        var resultWindow = sender as PhotinoWindow;

        if (message == null){
            return;
        }
        
        WindowMessage? wm = JsonSerializer.Deserialize<WindowMessage>(message);

        if (wm == null){
            return;
        }
        
        switch(wm.Command){
            case "getCurrentDirectory":{
                wm.Parameters = Environment.CurrentDirectory;
                resultWindow?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcInfoByName":{
                SnapshotRepository sr = new();
                var procname = File.ReadAllText("procname.txt");
                wm.Parameters =  sr.GetMatchingSnapshotsByName(procname);
                resultWindow?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
        }
     }
}