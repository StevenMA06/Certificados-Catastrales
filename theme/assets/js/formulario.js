document.addEventListener("DOMContentLoaded", function () {
    const formContainer1 = document.getElementById("formContainer1");
    const formContainer2 = document.getElementById("formContainer2");
    const formContainer3 = document.getElementById("formContainer3");
    const formContainer4 = document.getElementById("formContainer4");
    const formContainer5 = document.getElementById("formContainer5");
    const formContainer6 = document.getElementById("formContainer6");


    
    // Función para ocultar todos los formularios
    function hideAllForms() {
        formContainer1.classList.add("d-none");
        formContainer2.classList.add("d-none");
        formContainer3.classList.add("d-none");
        formContainer4.classList.add("d-none");
        formContainer5.classList.add("d-none");
        formContainer6.classList.add("d-none");


    }

    // Función para mostrar el formulario de Ejemplo 1
    document.getElementById("ejem1").addEventListener("click", function () {
        hideAllForms(); // Ocultar todos los formularios
        if (formContainer1) {
            formContainer1.classList.remove("d-none"); // Mostrar solo el formulario de tipo 1
        }
        
    });

    // Función para mostrar el formulario de Ejemplo 2
    document.getElementById("ejem2").addEventListener("click", function () {
        hideAllForms(); 
        if (formContainer2) {
            formContainer2.classList.remove("d-none"); 
        }
    });

    // Función para mostrar el formulario de Ejemplo 3
    document.getElementById("ejem3").addEventListener("click", function () {
        hideAllForms(); 
        if (formContainer3) {
            formContainer3.classList.remove("d-none"); 
        }
    });
    // Función para mostrar el formulario de Ejemplo 4
    document.getElementById("ejem4").addEventListener("click", function () {
        hideAllForms(); 
        if (formContainer4) {
            formContainer4.classList.remove("d-none"); 
        }
    });
    // Función para mostrar el formulario de Ejemplo 5
    document.getElementById("ejem5").addEventListener("click", function () {
        hideAllForms(); 
        if (formContainer5) {
            formContainer5.classList.remove("d-none"); 
        }
    });
    document.getElementById("ejem6").addEventListener("click", function () {
        hideAllForms(); 
        if (formContainer6) {
            formContainer6.classList.remove("d-none"); 
        }
        
    });
});
