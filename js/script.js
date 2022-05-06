$(document).ready(function(){

    loadPlanets();
    slideToggleElements();

    $(".dropdown-info-planet .close").on("click",function(){
        $(this).parent().removeClass("open");
    });

    $(".modal-header .close").on("click",function(){
        $(".modal-atmosfera").removeClass("open");
        $(".backdrop-modal").removeClass("open");
    });

    $(`[data-filter]`).on("click",function(){
        $(this).siblings(".active").removeClass("active");
        $(this).addClass("active");
        let platetToFilter = $(this).data("filter");

        if(platetToFilter==="all"){
            $(".card-planet:not(.shimmer)").show();
        }else{
            $(".card-planet:not(.shimmer)").filter(function(){
                $(this).toggle($(this).data("tipo").indexOf(platetToFilter)>-1);
            });
        }
    });

    $("#input-filter").on("keyup",function(e){
        let valueSearch = $(this).val().toLowerCase();
        $(".card-planet:not(.shimmer)").filter(function(){
            $(this).toggle($(this).data("search").toLowerCase().indexOf(valueSearch)>-1);
        });
    });

    $(".btn-get-result").on("click",function(){
        let valueEnter = $("#my-peso-input").val();

        $(".count-result").text("");
        if(valueEnter && !isNaN(valueEnter)){
            let fatMult = +$("#my-peso-input").data("fatmult");
            let peso = +valueEnter;
            let result = peso * fatMult;

            $(".count-result").text(result+"Kg");
        }else{
            alert("degite um pesso valido primeiro")
        }
    });

    function loadPlanets(){
        let listPlanetsContainer = $(".list-planets-container");
        $.getJSON("/data/data.json",function(data,statusTxt,x){
            if(statusTxt=="success"){
                console.log("data loaded",data);
                listPlanetsContainer.html("");
                $.each(data,function(index,planet){
                    let {id,img,nome,tipo} = planet
                    console.log("data loaded",planet);
                    listPlanetsContainer.append(`
                        <div class="card-planet" data-search="${nome}" data-id="${id}" data-tipo="${tipo}">
                            <img src="${img}" class="planet-img" alt="">
                            <span class="planet-name">${nome}</span>
                            <button type="button" class="btn-action-planet atmos">Atmosfera</button>
                            <button type="button" class="btn-action-planet more">Saber Mais</button>
                        </div>
                    `);
                });

                addEventLoadMoreInfoAboutPlanet();
                AddEventOpenModalAtmosInfo();
            }else{
                alert("não foi possivel carregar os dados");
            }
        });
    }

    function slideToggleElements(){
        let lastIdCollapse = "";
        $(`[data-toggle-collapse]`).on("click",function(e){
            e.stopPropagation();
            let idItemCollapse = $(this).data("toggleCollapse");
            $(`[data-collapse]`).slideUp();
            if(lastIdCollapse!=idItemCollapse){
                $(`[data-collapse="${idItemCollapse}"]`).slideDown();
                lastIdCollapse = idItemCollapse;
            }else{
                lastIdCollapse = "";
            }
            
        });
    }

    function addEventLoadMoreInfoAboutPlanet(){
        $(".card-planet .more").on("click",function(){
            let idPlanet = $(this).parent().data("id");
            $(".dropdown-info-planet").addClass("open");


             console.log("id planet",idPlanet);

            $(".dropdown-info-planet").find(".img-planet").attr("src","");
            $(".dropdown-info-planet").find(".name-planet").text("");
            $(".dropdown-info-container.list").html("loading...");
            $("#my-peso-input").val("");
            $(".count-result").text("");

             $.getJSON("/data/data.json",function(planets,statusTxt,x){
                if(statusTxt=="success"){
                    let planetFound = [...planets].find((data)=>{
                        return data.id == +idPlanet
                    });
                    if(planetFound){
                        let {img,nome,temp_media,temp_max,temp_min,dist_sol,diametro,area,massa,satelites,rotacao,translacao,fat_mult_calc_pesso} = planetFound;
                        $(".dropdown-info-planet").find(".img-planet").attr("src",img);
                        $(".dropdown-info-planet").find(".name-planet").text(nome);
                        $("#my-peso-input").attr("data-fatmult",fat_mult_calc_pesso);

                        $(".dropdown-info-container.list").html(`
                            <ul>
                                <li>Temp Média: ${temp_media} ºC</li>
                                <li>Temp Max: ${temp_max} ºC</li>
                                <li>Temp Min: ${temp_min} ºC</li>
                                <li>Dist do sol: ${dist_sol}</li>
                                <li>Diametro: ${diametro}</li>
                                <li>Area: ${area}</li>
                                <li>Massa: ${massa}</li>
                                <li>Satelites: ${satelites}</li>
                                <li>Rotação: ${rotacao}</li>
                                <li>Translação: ${translacao}</li>
                            </ul>
                        `);
                    }else{
                        alert("erro ao carregar os dados do planeta");
                    }
                }else{
                    
                }
            });
        });
    }

    function AddEventOpenModalAtmosInfo(){
        $(".card-planet .atmos").on("click",function(){
            let idPlanet = $(this).parent().data("id");
            $(".modal-atmosfera").addClass("open");
            $(".backdrop-modal").addClass("open");

            console.log("id planet",idPlanet);
            $(".modal-text").text("carregando...");
            $(".modal-atmosfera .planet-name").text("");
            $.getJSON("/data/data.json",function(planets,statusTxt,x){
                if(statusTxt=="success"){
                    let planetFound = [...planets].find((data)=>{
                        return data.id == +idPlanet
                    });
                    if(planetFound){
                        $(".modal-atmosfera .planet-name").text(planetFound.nome);
                        $(".modal-text").text(planetFound.atmosfera);
                    }else{
                        alert("erro ao carregar os dados do planeta");
                    }
                }else{
                    
                }
            });
        });
    }
});