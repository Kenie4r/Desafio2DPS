import { Movie } from "@/types/pelicula";
import type { NuevaReserva, ReservaAPI } from '@/types/reservaApi';

async function leerRespuestaReserva(response: Response) {
    const texto = await response.text();
    let resultado: any = null;

    try {
        resultado = texto ? JSON.parse(texto) : null;
    } catch {
        throw new Error(
            `La API devolvió una respuesta inválida: ${response.status}`,
        );
    }

    if (!response.ok) {
        const mensaje =
            resultado?.message ??
            (resultado && typeof resultado === 'object'
                ? Object.values(resultado).join('\n')
                : `Error de API: ${response.status}`);

        throw new Error(String(mensaje));
    }

    return resultado;
}

function normalizarReserva(reserva: any): ReservaAPI {
    const id = Number(reserva?.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error('La API no devolvió un id válido de reserva.');
    }

    return {
        ...reserva,
        id,
        numero_reserva: String(reserva.numero_reserva),
        codigo_qr:
            typeof reserva.codigo_qr === 'string'
                ? reserva.codigo_qr
                : JSON.stringify(reserva.codigo_qr),
        usuario_id: Number(reserva.usuario_id),
        pelicula_id: Number(reserva.pelicula_id),
        cantidad: Number(reserva.cantidad),
        total: Number(reserva.total),
        utilizado: Number(reserva.utilizado ?? 0),
    };
}

function extraerListadoReservas(resultado: any): ReservaAPI[] {
    const listado = Array.isArray(resultado)
        ? resultado
        : resultado?.reservas;

    if (!Array.isArray(listado)) {
        throw new Error(
            'La API debe devolver un arreglo o un objeto con el campo reservas.',
        );
    }

    return listado.map(normalizarReserva);
}


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
    guardarPelicula : async(req : Omit<Movie, 'id'>)=>{ 
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
    },
    eliminarPelicula : async(req: number)=>{ 
        let url = URL_API_RAILWAY +'/peliculas/' + req;
        console.log(JSON.stringify(req))
        const response = await fetch(url,{
            body: JSON.stringify({id: req}), 
            method: 'DELETE',
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
    },
        obtenerListadoReservas: async (): Promise<ReservaAPI[]> => {
        const url = URL_API_RAILWAY + '/reservas';

        const response = await fetch(url);
        const resultado = await leerRespuestaReserva(response);

        return extraerListadoReservas(resultado);
    },

    obtenerReserva: async (id: number): Promise<ReservaAPI> => {
        const url = URL_API_RAILWAY + '/reservas/' + id;

        const response = await fetch(url);
        const resultado = await leerRespuestaReserva(response);

        return normalizarReserva(resultado?.reserva ?? resultado);
    },

    obtenerReservasPelicula: async (
        peliculaId: number,
    ): Promise<ReservaAPI[]> => {
        const url =
            URL_API_RAILWAY + '/reservas/pelicula/' + peliculaId;

        const response = await fetch(url);
        const resultado = await leerRespuestaReserva(response);

        return extraerListadoReservas(resultado);
    },

    guardarReserva: async (
        req: NuevaReserva,
    ): Promise<ReservaAPI> => {
        const url = URL_API_RAILWAY + '/reservas';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        });

        const resultado = await leerRespuestaReserva(response);
        const reserva = resultado?.reserva ?? resultado;

        if (reserva?.id != null) {
            return normalizarReserva({
                ...req,
                ...reserva,
            });
        }

        // Si POST devuelve solamente un mensaje, busca la reserva creada.
        const listadoResponse = await fetch(url);
        const listadoResultado =
            await leerRespuestaReserva(listadoResponse);

        const listado = extraerListadoReservas(listadoResultado);

        const creada = listado.find(
            (item) => item.numero_reserva === req.numero_reserva,
        );

        if (!creada) {
            throw new Error(
                'La API aceptó la compra, pero no se pudo recuperar la reserva. Revisa el listado antes de volver a comprar.',
            );
        }

        return creada;
    },

    validarBoleto: async (codigoReserva: string): Promise<ReservaAPI> => {
        const response = await fetch(
            URL_API_RAILWAY + '/reservas/' + encodeURIComponent(codigoReserva) + '/validar',
            { method: 'PUT' },
        );
        const resultado = await leerRespuestaReserva(response);
        return normalizarReserva(resultado.reserva);
    },

    actualizarReserva: async (
        req: ReservaAPI,
    ): Promise<ReservaAPI> => {
        const url = URL_API_RAILWAY + '/reservas/' + req.id;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        });

        const resultado = await leerRespuestaReserva(response);
        const reserva = resultado?.reserva ?? resultado;

        if (reserva?.id != null) {
            return normalizarReserva({
                ...req,
                ...reserva,
            });
        }

        const consulta = await fetch(url);
        const actualizada = await leerRespuestaReserva(consulta);

        return normalizarReserva(
            actualizada?.reserva ?? actualizada,
        );
    },

    eliminarReserva: async (id: number): Promise<void> => {
        const url = URL_API_RAILWAY + '/reservas/' + id;

        const response = await fetch(url, {
            method: 'DELETE',
        });

        await leerRespuestaReserva(response);
    },
}