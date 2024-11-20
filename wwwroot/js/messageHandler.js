let today = new Date();
initMessageHandler();

let selector = document.querySelector("#procList");
 selector.addEventListener("click", () => {
   getProcDetails();
 });

selector.addEventListener("change", () => {
  getProcDetails();
});

function sendMessage(sMessage){
    console.log(sMessage);
    window.external.sendMessage(sMessage);
}

// allCommands is the list of all commands (strings) processed by the switch statement
var allCommands = ["getCurrentDirectory",
    "testMsg",
    "getDirSeparator",
    "getUserProfile", 
    "getAllProcNames",
    "getProcessModules",
    "getProcFileName", 
    "getProcDetails"];

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
    document.querySelector("#procList").options.length = 0;
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

  function getProcFileName(){
    let message = {}; // create basic object
    message.Command = "getProcFileName";
    message.Parameters = document.querySelector("#procList").value;
    alert(`id: ${message.Parameters}`);
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getProcDetails(){
    let message = {}; 
    message.Command = "getProcDetails";
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
          document.querySelector("#ProcCount").innerHTML = `Found ${allProcs.length} processes.`;
          allProcs.forEach (p => {
            var pDetails = p.split(":");
            var procName = `${pDetails[0]}` != "" ? `${pDetails[0]}`: `${pDetails[1]}`
            var localOption = new Option(procName, pDetails[1], false, true);
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
        case allCommands[6]:{
          var procFileName = `${response.Parameters}`;
          alert(`filename : ${procFileName}`);
          
          break;
        }
        case allCommands[7]:{
          var allParams = response.Parameters.split(",");
          allParams.forEach(p => {
             console.log(`param: ${p}`);
           });
          displayProcDetails(allParams);
          break;
        }
        default:{
            alert(response.Parameters);
            break;
        }
      }
    });
  }

  function displayProcDetails(allParams){
    document.querySelector("#pname").innerHTML = `<strong>Name</strong>: ${allParams[0]}`;
    document.querySelector("#pid").innerHTML = `<strong>PID</strong>: ${allParams[1]}`;
    document.querySelector("#pfile").innerHTML = `<strong>Exe File</strong>: ${allParams[2]}`;
    document.querySelector("#psize").innerHTML = `<strong>Exe File Size</strong>: ${parseInt(allParams[3]).toLocaleString("en")}`;
    document.querySelector("#pworkingset").innerHTML = `<strong>RAM</strong>: ${parseInt(allParams[4]).toLocaleString("en")} bytes used.`;
    document.querySelector("#phash").innerHTML = `<strong>SHA256 (exe file)</strong>: ${allParams[5]}`;
    
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