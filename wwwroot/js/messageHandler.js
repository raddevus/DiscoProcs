let today = new Date();
initMessageHandler();

let selector = document.querySelector("#procList");
 selector.addEventListener("click", () => {
   getProcessModules();
 });

function sendMessage(sMessage){
    console.log(sMessage);
    window.external.sendMessage(sMessage);
}

// allCommands is the list of all commands (strings) processed by the switch statement
var allCommands = ["getCurrentDirectory","testMsg","getDirSeparator","getUserProfile", "getAllProcNames","getProcessModules"];

function sendTestMsg(){  
    let message = {}; // create basic object
    message.Command = "testMsg";
    // // Create all parameters as array
    
    let allParameters = [];
    allParameters.push(today.yyyymmdd());
    // // Call join on array to pass all parameters as a comma-delimited string
    message.Parameters = allParameters.join();
    console.log(`message.Parameters : ${message.Parameters}`);
    
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getCurrentDir(){
    let message = {}; // create basic object
    message.Command = "getCurrentDirectory";
    message.Parameters = "null";
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getAllProcNames(){
    let message = {}; // create basic object
    message.Command = "getAllProcNames";
    message.Parameters = "null";
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getProcessModules(){
    let message = {}; // create basic object
    message.Command = "getProcessModules";
    message.Parameters = document.querySelector("#procList").value;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

function initMessageHandler(){
    window.external.receiveMessage(response => {
      response = JSON.parse(response);
      switch (response.Command){
        case allCommands[0]:{
          alert(`current directory is: ${response.Parameters}`);
          break;
        }
        case allCommands[1]:{
            alert(`I got you! ${response.Parameters}`);
            break;
        }
        case allCommands[2]:{

            dirSeparator = `${response.Parameters}`;
            alert(`dirSeparator ${dirSeparator}`);
            break;
        }
        case allCommands[4]:{
          var allProcs = response.Parameters.split(",");
          allProcs.forEach (p => {
            var pDetails = p.split(":");

            var localOption = new Option(`${pDetails[0]}               ${pDetails[1]}`, pDetails[0], false, true);
		        document.querySelector('#procList').append(localOption);
		        //$("#procNames").val("");
          });
          
          break;
        }
        case allCommands[5]:{
          return;
          var allProcs = response.Parameters.split(",");
          allProcs.forEach (p => {
            var pDetails = p.split(":");

            var localOption = new Option(`${pDetails[0]}               ${pDetails[1]}`, pDetails[0], false, true);
		        document.querySelector('#procList').append(localOption);
		        //$("#procNames").val("");
          });
          
          break;
        }
        default:{
            alert(response.Parameters);
            break;
        }
      }
    });
  }

  Date.prototype.yyyymmdd = function(isDash=true) {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    if (isDash){
      return [this.getFullYear() + "-", mm.length===2 ? '' : '0', mm + "-", dd.length===2 ? '' : '0', dd].join(''); // padding
    }
    else{
      return [this.getFullYear() + "/", mm.length===2 ? '' : '0', mm + "/", dd.length===2 ? '' : '0', dd].join(''); // padding
    }
  };