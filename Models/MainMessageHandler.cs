using PhotinoNET;
using System.Text.Json;

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
                DpProcess dpp = new();
                wm.Parameters = string.Join(",",dpp.GetAllProcNames());
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcessModules":{
                DpProcess dpp = new();
                wm.Parameters = string.Join(",",dpp.GetAllProcModules(wm.Parameters));
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