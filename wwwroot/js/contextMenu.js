let mousePos = {};
let isContextMenuDisplayed = false;

document.addEventListener("mousemove",onMouseMove,false);
document.addEventListener("click", bodyClickHandler,false);

document.querySelector("#procList").addEventListener('contextmenu', e => {
    if (e.shiftKey == false) {
      e.preventDefault();
      drawContextMenu();
    }
});

function onMouseMove(e)
{
  mousePos = { x: e.clientX, y: e.clientY };
}


function drawContextMenu()
{
  isContextMenuDisplayed = true;
  console.log('drawContextMenu : ' + new Date())
  //console.log($('.EScontextMenu').text());
  document.querySelector('.RADcontextMenu').style.visibility = "visible";
  document.querySelector('.RADcontextMenu').style.display = "block";
  document.querySelector('.RADcontextMenu').style.top = `${mousePos.y + window.scrollY}px`;
  document.querySelector('.RADcontextMenu').style.left = mousePos.x + "px";
}

function onContextMenuClick(e)
{
  console.log("onContextMenuClick()");
  hideContextMenu();
  
  console.log(e.id);
  switch (e.id)
  {
    case 'save_procs':
      {
        // Allows user to save selected procs
        saveSelectedProcs();
        break;
      }
    case 'kill_process':
      {
        killProcess();
        break;
      }
    case 'get_proc_info_byName':
      {
        getProcInfoByName();
        break;
      }
    case 'find_proc_by_name':
      {
        searchProcList();     
        break;
      }
  }
}

function searchProcList(){
  // next line unselects all selected items
  document.querySelector("#procList").selectedIndex = -1;
  var allItems = Array.from(document.querySelector("#procList").options);
  let searchText = prompt("Please enter name of proc you're trying to find");
  
  var foundCount = 0;
  var optionItem = null;
  if (searchText != null){
    allItems.find((s) => {
      if (s.textContent.toUpperCase().search(searchText.toUpperCase()) >= 0){
        s.selected = true;
        ++foundCount;
        if (foundCount == 1){
          optionItem = s;
        }
      }
    })
    if (foundCount >= 1){
      // this means we found at least one and
      // we want to scroll that first one into view.
      if (optionItem){
        optionItem.scrollIntoView();
      }
    }
  }
}

function bodyClickHandler()
{
  console.log("bodyClickHandler");
  hideContextMenu();
}

function hideContextMenu()
{
  if (isContextMenuDisplayed) {
      document.querySelector(".RADcontextMenu").style.visibility = "hidden";
      document.querySelector(".RADcontextMenu").style.display = "none";
      isContextMenuDisplayed = false;
    }
}