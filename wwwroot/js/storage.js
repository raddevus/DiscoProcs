
function save(targetName, targetObj){
    var target = JSON.stringify(targetObj);
    localStorage.setItem(targetName, target);
}

function retrieve(targetName){
    return JSON.parse(localStorage.getItem(targetName));
}