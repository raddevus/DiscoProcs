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
            case "createYMDir":{
                var currentDir = Environment.CurrentDirectory;
                Directory.CreateDirectory(Path.Combine(currentDir,DateTime.Now.ToString("yyyy-MM")));
                break;
            }
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
            case "loadEntryData":{
                
                // var localEntry = new Entry(wm.Parameters, String.Empty);
                // var entryData = localEntry.Read();
                // Console.WriteLine(entryData);
                // wm.Parameters = entryData;
                // window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "loadMonthlyEntries":{
                // var localEntry = new Entry(wm.Parameters, String.Empty);
                // var monthPath = Path.Combine(Environment.CurrentDirectory,localEntry.EntryFolder);
                // // If there is no month folder YYYY-MM because an entry has never
                // // been created for this month, then there are no monthly files to load
                // // so we don't do anything.
                // if (Directory.Exists(monthPath)){
                //     String [] allFiles = Directory.GetFiles(monthPath);
                //     String filesDelimited = String.Join(",",allFiles.Select(item => item ));
                //     wm.AllParameters = allFiles;
                //     wm.Parameters = filesDelimited;
                //     window?.SendWebMessage(JsonSerializer.Serialize(wm));
                // }
                break;
            }
            case "saveEntryData":{
                // var entry = new Entry( wm.AllParameters[0], wm.AllParameters[1]);
                // entry.Save();
                // window?.SendWebMessage(JsonSerializer.Serialize(wm));
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