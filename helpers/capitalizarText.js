const capitalizada = (texto) =>{

    let palabras = [];
 
    for(let palabra of texto.split(" ")){
     palabras.push(palabra[0].toUpperCase() + palabra.substring(1))
    }
    
    return palabras.join(" ")
 }

 function capitalizar(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

 
 export {
    capitalizada,
    capitalizar
 }