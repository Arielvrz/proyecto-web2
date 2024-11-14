var menulista = document.getElementById("menulista");

menulista.style.maxHeight = "0px";

function togglemenu(){

    if(menulista.style.maxHeight == "0px")
    {
        menulista.style.maxHeight = "400px";
    }
    else
    {
        menulista.style.maxHeight = "0px";
    }

}