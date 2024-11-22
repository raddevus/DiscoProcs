using PhotinoNET;
using System.Text.Json;
using NewLibre;
using DiscoProcs;
using System.Reflection.Metadata.Ecma335;

public class MainMessageHandler{
    static public void MessageHandler(object? sender, string message) 
     {
        var window = sender as PhotinoWindow;

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
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getDirSeparator":{
                // Path seperators on diff OSes are not the same
                // This is a helper method to handle that.
                wm.Parameters = System.IO.Path.DirectorySeparatorChar.ToString();
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getUserProfile":{
                wm.Parameters = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getAllProcNames":{
                Program.allProcs = null;
                SystemInfo dpp = new();
                Program.allProcs = dpp.GetAllProcesses();
                wm.Parameters = string.Join(",",Program.allProcs.Select(p => {return $"{p.Name}:{p.ProcId}"; }));
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcessModules":{
                SystemInfo dpp = new();
                wm.Parameters = string.Join(",",dpp.GetAllProcModules(wm.Parameters));
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcFileName":{
                if (Program.allProcs.Count <= 0){
                    SystemInfo dpp = new();
                    Program.allProcs = dpp.GetAllProcesses();
                }
                var pinfo = Program.allProcs.First(p => p.ProcId == Convert.ToInt32(wm.Parameters));
                wm.Parameters = pinfo.Filename;
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcDetails":{
                if (Program.allProcs.Count <= 0){
                    SystemInfo dpp = new();
                    Program.allProcs = dpp.GetAllProcesses();
                }
                try{
                    var pinfo = Program.allProcs.First(p => p.ProcId == Convert.ToInt32(wm.Parameters));
                    wm.Parameters = $"{pinfo.Name},{pinfo.ProcId},{pinfo.Filename},{pinfo.FileSize},{pinfo.GetWorkingSet()},{pinfo.GenSha256Hash()}";
                }
                catch(Exception ex){
                    Console.WriteLine($"Couldn't get details: ${ex.Message}");
                    wm.Parameters = $"Couldn't access details,inaccessible,inaccessible,inaccessible,inaccessible";
                }
                
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            default :{
                // The message argument is coming in from sendMessage.
                // "window.external.sendMessage(message: string)"
                wm.Parameters = $"Received message: \"{wm.Parameters}\"";

                // Send a message back the to JavaScript event handler.
                // "window.external.receiveMessage(callback: Function)"
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                    break;
                }
        }
    }
}