/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function enviar(event){
    if(event.keyCode==13){
        var texto = document.getElementById("texto").value;

        var scriptTag = "<script>document.getElementById('textarea_content').getElementsByTagName('textarea')[1].value = '"+texto+"';document.getElementsByName('post')[1].click();<";
        scriptTag +=  "/script>";
        jQuery("#b").contents().find("body").append(scriptTag);
        document.getElementById("texto").value = "";
    }
}
            
function actualizar(){
    chat.length = 0;
    nombres.length = 0;
    peticionHTML(0);
}
function actualizar2(){
    chat.length = 0;
    nombres.length = 0;
    
    var ultimosMensajes = document.getElementsByClassName("last-post-icon");
    var direccionUltimaPagina = ultimosMensajes[ultimosMensajes.length-1].getAttribute("href");
    direccionUltimaPagina = direccionUltimaPagina.substr(1);
    var numeroUltimaPagina = direccionUltimaPagina.substr(4,2);
    console.log(direccionUltimaPagina);
    console.log(numeroUltimaPagina);
    // ultima pagina
    
    var peticion1 = new XMLHttpRequest();
    peticion1.onreadystatechange = function(){
        if (peticion1.readyState==4){
            if(peticion1.status==200){
            // parsear mijo
                var temp = document.createElement("temp");
                temp.innerHTML = this.responseText;
                var lista = temp.getElementsByClassName("entry-content");
                var listaNombres = temp.getElementsByClassName("username");
                var listaFechas = temp.getElementsByClassName("posthead");
                
                if(!(temp.getElementsByClassName("message").length > 0)){
                    for (var x = 0; x<lista.length;x++){
                        if(lista[x].getElementsByTagName("script").length>0) continue;
                        fechas.push(jQuery(listaFechas[x].innerHTML).clone().children().remove().end().text());
                        chat.push(jQuery(lista[x].getElementsByTagName("div")[0].innerHTML).text());
                        var usuario = jQuery(listaNombres[x].innerHTML).text();
                        if(usuario == "") usuario = "Invitado";
                        nombres.push(usuario);
                    }
                    console.log("Encontre algo status: " + peticion1.status);
                    // segunda peticion
                    segundaPeticion(numeroUltimaPagina-25);
                }
                else{
                    console.log("Fin busqueda de mensajes");
                    crearHTML(chat);
                }
            }
            else{
                
                    console.log("Fin busqueda de mensajes");
                    crearHTML(chat);
            }
        }
    }
    peticion1.open("GET","t31p"+numeroUltimaPagina+"-tagboard-ignorar",true);
    peticion1.send();
    
    
}

function segundaPeticion(numero){
    var peticion1 = new XMLHttpRequest();
    peticion1.onreadystatechange = function(){
        if (peticion1.readyState==4){
            if(peticion1.status==200){
            // parsear mijo
                var temp = document.createElement("temp");
                temp.innerHTML = this.responseText;
                var lista = temp.getElementsByClassName("entry-content");
                var listaNombres = temp.getElementsByClassName("username");
                var listaFechas = temp.getElementsByClassName("posthead");
                
                if(!(temp.getElementsByClassName("message").length > 0)){
                    for (var x = lista.length-1; x>=0;x--){
                        if(lista[x].getElementsByTagName("script").length>0) continue;
                        fechas.unshift(jQuery(listaFechas[x].innerHTML).clone().children().remove().end().text());
                        chat.unshift(jQuery(lista[x].getElementsByTagName("div")[0].innerHTML).text());
                        var usuario = jQuery(listaNombres[x].innerHTML).text();
                        if(usuario == "") usuario = "Invitado";
                        nombres.unshift(usuario);
                    }
                    console.log("Encontre algo status: " + peticion1.status);
                    
                    crearHTML(chat);
                }
                else{
                    console.log("Fin busqueda de mensajes");
                    crearHTML(chat);
                }
            }
            else{
                
                    console.log("Fin busqueda de mensajes");
                    crearHTML(chat);
            }
        }
    }
    peticion1.open("GET","t31p"+numero+"-tagboard-ignorar",true);
    peticion1.send();
}

function crearHTML(chat){
    var color1 = "rgba(229, 299, 299, 0.5)";
    var color2 = "rgba(243, 244, 245, 0.5)";

    var div = document.getElementById("a");
    document.getElementById("a").innerHTML = "";
    jQuery('#a').empty();
    var contadorPorqueSacarCuentasEsDificil=0;
    for(var x = chat.length-1; x>=0;x--){
        if(contadorPorqueSacarCuentasEsDificil==21) break;
        div.innerHTML += "<div style='padding-top:0px; padding-bottom:0px; background-color : "+ ((x%2 == 0)? color1 : color2) +";'>"+ nombres[x] + ": " + chat[x] + "<div style='line-height: 70%;padding-bottom:0px;font-size:0.8em;width:100%; text-align: right'>Enviado"+ fechas[x]+ "</div>" + "</div>";
        contadorPorqueSacarCuentasEsDificil++;
    }
    div.scrollTop = div.scrollHeight - div.clientHeight;
    
}

function peticionHTML(numero){
    
    console.log("Inicio de busqueda");
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState==4){
            if(request.status==200){
            // parsear mijo
                
                var temp = document.createElement("temp");
                temp.innerHTML = this.responseText;
                var lista = temp.getElementsByClassName("entry-content");
                var listaNombres = temp.getElementsByClassName("username");
                var listaFechas = temp.getElementsByClassName("posthead");
                
                if(!(temp.getElementsByClassName("message").length > 0)){
                    for (var x = 0; x<lista.length;x++){
                        if(lista[x].getElementsByTagName("script").length>0) continue;
                        chat.push(jQuery(lista[x].getElementsByTagName("div")[0].innerHTML).text());
                        fechas.push(jQuery(listaFechas[x].innerHTML).clone().children().remove().end().text()); // magiaaa
                        var usuario = jQuery(listaNombres[x].innerHTML).text();
                        if(usuario == "") usuario = "Invitado";
                        nombres.push(usuario);
                    }
                    console.log("Encontre algo status: " + request.status);
                    peticionHTML(numero+25);
                }
                else{
                    console.log("Fin busqueda de mensajes");
                    crearHTML(chat);
                }
            }
            else{
                
                console.log("Fin busqueda de mensajes");
                crearHTML(chat);

            }
        }
    }
    request.open("GET","t31p"+numero+"-tagboard-ignorar",true);
    request.send();
}

