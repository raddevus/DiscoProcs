using PhotinoNET;
using System;
using System.Drawing;
using System.IO;
using System.Text;

namespace DiscoProcs
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            // Window title declared here for visibility
            string windowTitle = "DiscoProcs - Examine Running Processes";

            // Creating a new PhotinoWindow instance with the fluent API
            var window = new PhotinoWindow()
                .SetTitle(windowTitle)
                // Resize to a percentage of the main monitor work area
                .SetUseOsDefaultSize(false)
                .SetSize(new Size(800, 600))
                // Center window in the middle of the screen
                .Center()
                // Users can resize windows by default.
                .SetResizable(false)
                
                .SetDevToolsEnabled(true) // Allows you to open console (right-click page to open)
                // Most event handlers can be registered after the
                // PhotinoWindow was instantiated by calling a registration 
                // method like the following RegisterWebMessageReceivedHandler.
                // This could be added in the PhotinoWindowOptions if preferred.
                .RegisterWebMessageReceivedHandler(MainMessageHandler.MessageHandler)
                .Load("wwwroot/index.html"); // Can be used with relative path strings or "new URI()" instance to load a website.

            
            window.WaitForClose(); // Starts the application event loop
        }
    }
}
