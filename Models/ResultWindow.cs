using System.Drawing;
using PhotinoNET;
public class ResultWindow{

    PhotinoWindow window = new PhotinoWindow();
    public ResultWindow(){
        string windowTitle = "Result";
        
            // Creating a new PhotinoWindow instance with the fluent API
            window
                .SetTitle("result")
                // Resize to a percentage of the main monitor work area
                .SetUseOsDefaultSize(false)
                .SetSize(new Size(800, 600))
                // Center window in the middle of the screen
                //.Center()
                // Users can resize windows by default.
                .SetResizable(false)
                
                .SetDevToolsEnabled(true) // Allows you to open console (right-click page to open)
                // Most event handlers can be registered after the
                // PhotinoWindow was instantiated by calling a registration 
                // method like the following RegisterWebMessageReceivedHandler.
                // This could be added in the PhotinoWindowOptions if preferred.
                .RegisterWebMessageReceivedHandler(ResultMessageHandler.MessageHandler)
                .Load("wwwroot/result.htm"); // Can be used with relative path strings or "new URI()" instance to load a website.

            window.WaitForClose();
            
    }
    
}