## Run Commands from Console
You can run the following commands from the app console.

## Get Dir Separator
```javascript
 let message = {}; // create basic object
  message.Command = "getDirSeparator";
    message.Parameters = "null";

let sMessage = JSON.stringify(message);
sendMessage(sMessage);
```

## Get User Profile
```
message.Command = "getUserProfile";
message.Parameters = "null";

sMessage = JSON.stringify(message);
sendMessage(sMessage);
```