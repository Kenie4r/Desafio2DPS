import { Movie } from "@/types/pelicula";

const URL_API_RAILWAY ='https://dpsapicine-production.up.railway.app'


export const serviceConsume = {
    obtenerListadoPeliculas : async (req : number | null)=> {
       let url = URL_API_RAILWAY +'/peliculas';
        if (req!=null){ 
            url = url + '/'+req; 
        }

        const response = await fetch(url); 
        const resultJson = await response.json();
        console.log(resultJson); 

        return resultJson; 

    },
    obtenerListadoCategoria : async()=>{
        let url = URL_API_RAILWAY +'/categoria';


        const response = await fetch(url); 
        const resultJson = await response.json();
        console.log(resultJson); 

        return resultJson; 
    },
    guardarPelicula : async(req : Movie)=>{ 
        let url = URL_API_RAILWAY +'/peliculas';

        const response = await fetch(url,{
            body: JSON.stringify(req), 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Datos enviados:', JSON.stringify(req));

 //       const texto = await response.text();

   //     console.log('Estado:', response.status);
    //    console.log('Respuesta:', texto);

        if (!response.ok) {
            throw new Error(`Error al guardar película: ${response.status}`);
        }

       const resultJson = await response.json();
        console.log(resultJson); 

        return resultJson.pelicula; 
    },
    actualizarPelicula : async(req: Movie)=>{ 
        let url = URL_API_RAILWAY +'/peliculas/' + req.id;
        console.log(JSON.stringify(req))
        const response = await fetch(url,{
            body: JSON.stringify(req), 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        
        //const texto = await response.text();

        //console.log('Estado:', response.status);
        //console.log('Respuesta:', texto);

        
       const resultJson = await response.json();
        console.log(resultJson); 

        return resultJson.pelicula; 
    }

}