$(document).ready(function() {

    var count = document.getElementsByClassName("card-body").length;
    console.log(count);
    var estado;
    for (let i = 1; i <= count; i++) {
        estado = document.getElementById("state"+i).getAttribute('value')
        if(estado =="Available"){
            document.getElementById("state"+i).setAttribute("style", "color: Green;");
        } else if (estado =="Reserved"){
            document.getElementById("state"+i).setAttribute("style", "color: Blue;");
            document.getElementById("btn-alquilar"+i).disabled = true;
        } else {
            document.getElementById("state"+i).setAttribute("style", "color: Red;");
            document.getElementById("btn-alquilar"+i).disabled = true;
        }
    }
})