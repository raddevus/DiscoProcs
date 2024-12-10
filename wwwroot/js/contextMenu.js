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
    case 'unused_1':
      {
        break;
      }
    case 'unused_2':
      {
        break;
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