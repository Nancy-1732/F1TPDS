class Circuito {
    constructor(nombre, ubicacion, longitudKm) {
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.longitudKm = longitudKm;
        this.curvas = [];
        this.recordVuelta = null;
        this.zonasDRS = [];
        this.condicionesClimaticas = {
            clima: 'seco',
            temperatura: 25,
            humedad: 50
        };
    }

    /**
     * Determina si el circuito es desafiante según sus características
     * @returns {boolean} true si:
     * - Tiene más de 10 curvas
     * - Al menos 2 zonas DRS
     * - Longitud > 5km
     * - Dificultad promedio alta
     * 
     * @example
     * const circuito = new Circuito("Monaco", "Monte Carlo", 3.337);
     * circuito.curvas = [/* 12 curvas *\/];
     * circuito.zonasDRS = [
     *   { nombre: "Túnel", longitud: 0.5 },
     *   { nombre: "Nouvelle Chicane", longitud: 0.3 }
     * ];
     * const esDesafiante = circuito.esDesafiante();
     * // Returns: true
     */

    promedioDificultad() {
        let valores = { baja: 1, media: 2, alta: 3 };

        this.curvas.reduce((suma, curva) => suma + valores[curva.dificultad], 0);
        const promedio = suma / this.curvas.length;

        let dificultadPromedio;
        if (promedio <= 1.5) {
            dificultadPromedio = "baja";
        } else if (promedio <= 2.5) {
            dificultadPromedio = "media";
        } else {
            dificultadPromedio = "alta";
        }

        return dificultadPromedio;
    }

    esDesafiante() {
        // Implementar lógica para determinar si el circuito es desafiante
        return this.curvas.length > 10 && this.zonasDRS.length >= 2 && this.longitudKm > 5 && this.promedioDificultad() === "alta";
    }

    /**
     * Agrega una nueva curva al circuito
     * @param {string} nombre - Nombre de la curva
     * @param {number} velocidadMaxima - Velocidad máxima permitida en km/h
     * @param {string} dificultad - Nivel de dificultad (baja, media, alta)
     * @returns {Object} Información de la curva agregada
     * 
     * @example
     * const circuito = new Circuito("Monaco", "Monte Carlo", 3.337);
     * const curva = circuito.agregarCurva("Loews Hairpin", 50, "alta");
     * // Returns: {
     * //   nombre: "Loews Hairpin",
     * //   velocidadMaxima: 50,
     * //   dificultad: "alta",
     * //   numeroCurva: 6
     * // }
     */
    agregarCurva(nombre, velocidadMaxima, dificultad) {
        // Implementar lógica para agregar una curva al circuito
        this.curvas.push({ nombre, velocidadMaxima, dificultad });
        return {
            nombre,
            velocidadMaxima,
            dificultad,
            numeroCurva: this.curvas.length
        };
    }

    /**
     * Agrega una nueva zona DRS al circuito
     * @param {string} nombre - Nombre de la zona DRS
     * @param {number} longitud - Longitud de la zona en kilómetros
     * @returns {Object} Información de la zona DRS agregada
     * 
     * @example
     * const circuito = new Circuito("Monaco", "Monte Carlo", 3.337);
     * const zonaDRS = circuito.agregarZonaDRS("Túnel", 0.5);
     * // Returns: {
     * //   nombre: "Túnel",
     * //   longitud: 0.5,
     * //   numeroZona: 1
     * // }
     */
    agregarZonaDRS(nombre, longitud) {
        // Implementar lógica para agregar una zona DRS
        this.zonasDRS.push({ nombre, longitud });
        return {
            nombre,
            longitud,
            numeroZona: this.zonasDRS.length
        };
    }

    /**
     * Establece las condiciones climáticas actuales del circuito
     * @param {string} clima - Tipo de clima (seco, lluvia, mixto)
     * @param {number} temperatura - Temperatura en grados Celsius
     * @param {number} humedad - Humedad relativa en porcentaje
     * @returns {Object} Condiciones climáticas actualizadas
     * 
     * @example
     * const circuito = new Circuito("Monaco", "Monte Carlo", 3.337);
     * const condiciones = circuito.establecerCondicionesClimaticas("lluvia", 18, 85);
     * // Returns: {
     * //   clima: "lluvia",
     * //   temperatura: 18,
     * //   humedad: 85,
     * //   visibilidad: "baja"
     * // }
     */
    establecerCondicionesClimaticas(clima, temperatura, humedad) {
        // Implementar lógica para establecer condiciones climáticas
        this.condicionesClimaticas.clima = clima;
        this.condicionesClimaticas.temperatura = temperatura;
        this.condicionesClimaticas.humedad = humedad;
        
    }

    /**
     * Actualiza el récord de vuelta del circuito si el nuevo tiempo es mejor
     * @param {number} tiempo - Tiempo de vuelta en segundos
     * @param {string} piloto - Nombre del piloto
     * @returns {Object} Información del récord actualizado
     * 
     * @example
     * const circuito = new Circuito("Monaco", "Monte Carlo", 3.337);
     * const record = circuito.actualizarRecordVuelta(71.553, "Max Verstappen");
     * // Returns: {
     * //   tiempo: 71.553,
     * //   piloto: "Max Verstappen",
     * //   fecha: "2024-05-26",
     * //   esNuevoRecord: true
     * // }
     */
    actualizarRecordVuelta(tiempo, piloto) {
        // Implementar lógica para actualizar el record de vuelta
        let esNuevoRecord = false;
        if (tiempo < this.recordVuelta.tiempo) {
            this.recordVuelta.tiempo = tiempo;
            this.recordVuelta.piloto = piloto;
            this.recordVuelta.fecha = new Date().toISOString().split('T')[0];
            esNuevoRecord = true;
        } 

        return {
            tiempo,
            piloto,
            fecha: this.recordVuelta.fecha,
            esNuevoRecord: esNuevoRecord
        };
    }

    /**
     * Obtiene estadísticas detalladas del circuito
     * @returns {Object} Estadísticas del circuito
     * 
     * @example
     * const circuito = new Circuito("Monaco", "Monte Carlo", 3.337);
     * const estadisticas = circuito.obtenerEstadisticasCircuito();
     * // Returns: {
     * //   numeroCurvas: 12,
     * //   zonasDRS: 2,
     * //   recordVuelta: {
     * //     tiempo: 71.553,
     * //     piloto: "Max Verstappen",
     * //     fecha: "2024-05-26"
     * //   },
     * //   condicionesActuales: {
     * //     clima: "seco",
     * //     temperatura: 25,
     * //     humedad: 50
     * //   },
     * //   dificultadPromedio: "alta"
     * // }
     */
    obtenerEstadisticasCircuito() {
        // Implementar lógica para obtener estadísticas del circuito
        return {
            numeroCurvas: this.curvas.length,
            zonasDRS: this.zonasDRS.length,
            recordVuelta: this.recordVuelta,
            condicionesActuales: this.condicionesClimaticas,
            dificultadPromedio: this.promedioDificultad()
        };
    }
}

module.exports = Circuito;