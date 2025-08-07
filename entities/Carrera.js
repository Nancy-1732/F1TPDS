class Carrera {
    constructor(nombre, circuito, fecha) {
        this.nombre = nombre;
        this.circuito = circuito;
        this.fecha = fecha;
        this.autosParticipantes = [];
        this.condicionesClimaticas = {};
        this.numeroVueltas = 0;
        this.resultados = [];
        this.clasificacion = {
            q1: [],
            q2: [],
            q3: []
        };
        this.vueltaRapida = null;
    }

    /**
     * Inicia la carrera validando requisitos mínimos y estableciendo condiciones iniciales
     * @returns {Object} Información sobre el inicio de la carrera
     * @throws {Error} Si no se cumplen los requisitos mínimos
     * 
     * @example
     * const carrera = new Carrera("GP de Mónaco", circuitoMonaco, "2024-05-26");
     * const inicio = carrera.iniciarCarrera();
     * // Returns: {
     * //   estado: "iniciada",
     * //   numeroVueltas: 78,
     * //   autosParticipantes: 20,
     * //   condicionesClimaticas: { clima: "seco", temperatura: 25, humedad: 40 }
     * // }
     */

    cambiarClima() {
        this.condicionesClimaticas.clima = this.circuito.condicionesClimaticas.clima;
        this.condicionesClimaticas.temperatura = this.circuito.condicionesClimaticas.temperatura;
        this.condicionesClimaticas.humedad = this.circuito.condicionesClimaticas.humedad; 
    }

    iniciarCarrera() {
        cambiarClima();
        if (this.esValida()) {
            
        }
    }

    /**
     * Verifica si la carrera cumple con los requisitos mínimos
     * @returns {boolean} true si:
     * - Hay al menos 10 autos
     * - El circuito es válido
     * - Las condiciones climáticas están establecidas
     * - La fecha es válida
     * 
     * @example
     * const carrera = new Carrera("GP de Mónaco", circuitoMonaco, "2024-05-26");
     * carrera.autosParticipantes = [/* 15 autos *\/];
     * carrera.condicionesClimaticas = { clima: "seco", temperatura: 25, humedad: 40 };
     * const esValida = carrera.esValida();
     * // Returns: true
     */
    validarClima() {
        return Object.keys(this.condicionesClimaticas).length === 0;
    }

    validarFecha() {
        const [aa, mm, dd] = this.fecha.split("-").map(Number);
        let fecha = new Date(aa, mm - 1, dd);
        return (fecha.getMonth() >= 0 && fecha.getMonth() <= 11) && (fecha.getDate() >= 1 && fecha.getDate() <= 31);
    }

    esValida() {
        return this.autosParticipantes.length >= 10 && this.circuito.ubicacion != null && !validarClima() && validarFecha();
    }

    /**
     * Calcula el número de vueltas según la longitud del circuito y duración objetivo
     * @returns {number} Número de vueltas calculado
     * 
     * @example
     * const carrera = new Carrera("GP de Mónaco", circuitoMonaco, "2024-05-26");
     * const vueltas = carrera.calcularNumeroVueltas();
     * // Returns: 78 (para Mónaco)
     */
    velocidadAuto(auto) {
        if (auto != null) {
            return auto.velocidadMaxima;
        } else {
            return this.autosParticipantes.reduce((acc, auto) => acc += auto.velocidadMaxima,0) / this.autosParticipantes;
        }
    }

    calcularNivelPiloto(piloto) {
        return (piloto.habilidades.velocidad + piloto.habilidades.consistencia) / 200;
    }

    promedioFactorPiloto(auto) {
        if (auto != null) {
            return calcularNivelPiloto(auto.conductor);
        } else {
            return this.autosParticipantes.reduce((acc, auto) =>
                acc += this.calcularNivelPiloto(auto.conductor),
                0
            ) / this.autosParticipantes.length;
        }
    }

    obtenerNeumatico(auto) { 
        if (auto != null) {
            return auto.neumaticos;
        } else {
            let conteo = this.autosParticipantes.reduce((acc, auto) => {
                acc[auto.neumaticos] = (acc[auto.neumaticos] || 0) + 1
            }, {});

            return Object.entries(conteo).reduce((max, actual) =>
                actual[1] > max[1] ? actual : max
            )[0];
        }
    }

    obtenerFactorClima() {
        let clima = this.condicionesClimaticas.clima;
        return clima == "seco" ? 1.00 : clima == "mojado" ? 1.10 : clima == "lluvia" ? 1.15 : 0;
    }

    obtenerFactorDesgaste() {
        return this.autosParticipantes
    }

    calcularTiempoVuelta(auto) {
        let tiempoBase = (this.circuito.longitudKm / velocidadAuto(auto)) * 3600;
        let factorPiloto = 1 - (promedioFactorPiloto(auto) * 0.1);
        let factorNeumaticos = obtenerNeumatico(auto).factor;
        let factorDesgaste = 1 + (obtenerNeumatico(auto).desgaste * 0.001);
        let factorClima = this.obtenerFactorClima();  
        

        return tiempoBase * factorPiloto * factorNeumaticos * factorClima * factorDesgaste;
    }

    obtenerFactorCircuito() {
        return this.circuito.longitudKm / 5;  
    }

    obtenerConsumoPorVuelta() {
        let consumoBase = 2.5;

        return consumoBase * this.obtenerFactorCircuito();
    }

    calcularNumeroVueltas() {
        let vueltasDuracion = (90*60) / this.calcularNumeroVueltas(null);
        let vueltasCombustible = 110 / this.obtenerConsumoPorVuelta();
        let vueltasNeumatico = 40 * this.obtenerFactorCircuito();

        this.numeroVueltas = Math.min(vueltasDuracion, vueltasCombustible, vueltasNeumatico);
    }

    /**
     * Realiza la clasificación (Q1, Q2, Q3) y asigna posiciones de salida
     * @returns {Object} Resultados de la clasificación
     * 
     * @example
     * const carrera = new Carrera("GP de Mónaco", circuitoMonaco, "2024-05-26");
     * const clasificacion = carrera.realizarClasificacion();
     * // Returns: {
     * //   q1: [{ piloto: "Hamilton", tiempo: "1:12.345" }, ...],
     * //   q2: [{ piloto: "Verstappen", tiempo: "1:11.234" }, ...],
     * //   q3: [{ piloto: "Leclerc", tiempo: "1:10.123" }, ...],
     * //   posicionesSalida: [{ piloto: "Leclerc", posicion: 1 }, ...]
     * // }
     */

    realizarQualy(autos) {
        let q = [];
        for (let auto of autos) {
            let piloto = {
                piloto: auto.conductor,
                tiempo: calcularTiempoVuelta()
            };
            q.push(piloto);
        }

        q.sort((a,b) => a.tiempo - b.tiempo);

        return q;
    }

    realizarClasificacion() {
        let q1 = realizarQualy(this.autosParticipantes);
        let q2 = realizarQualy(q1.slice(0, q1.length - 5));
        let q3 = realizarQualy(q2.slice(0, q2.length - 5));
    }

    /**
     * Registra el tiempo de una vuelta para un auto específico
     * @param {Object} auto - Auto que completó la vuelta
     * @param {number} tiempo - Tiempo de la vuelta en segundos
     * @returns {Object} Información de la vuelta registrada
     * 
     * @example
     * const carrera = new Carrera("GP de Mónaco", circuitoMonaco, "2024-05-26");
     * const vuelta = carrera.registrarVuelta(autoHamilton, 85.432);
     * // Returns: {
     * //   numeroVuelta: 15,
     * //   piloto: "Hamilton",
     * //   tiempo: 85.432,
     * //   esVueltaRapida: false
     * // }
     */
    registrarVuelta(auto, tiempo) {
        // Implementar lógica para registrar una vuelta
    }

    /**
     * Finaliza la carrera y calcula los resultados finales
     * @returns {Object} Resultados finales de la carrera
     * 
     * @example
     * const carrera = new Carrera("GP de Mónaco", circuitoMonaco, "2024-05-26");
     * const resultados = carrera.finalizarCarrera();
     * // Returns: {
     * //   podio: [
     * //     { posicion: 1, piloto: "Leclerc", tiempo: "1:45:23.456" },
     * //     { posicion: 2, piloto: "Verstappen", tiempo: "+2.345" },
     * //     { posicion: 3, piloto: "Hamilton", tiempo: "+5.678" }
     * //   ],
     * //   vueltaRapida: { piloto: "Verstappen", tiempo: "1:10.123" },
     * //   puntos: [
     * //     { piloto: "Leclerc", puntos: 25 },
     * //     { piloto: "Verstappen", puntos: 18 },
     * //     { piloto: "Hamilton", puntos: 15 }
     * //   ]
     * // }
     */
    finalizarCarrera() {
        // Implementar lógica para finalizar la carrera
    }

    /**
     * Obtiene los resultados actuales de la carrera
     * @returns {Object} Resultados actuales
     * 
     * @example
     * const carrera = new Carrera("GP de Mónaco", circuitoMonaco, "2024-05-26");
     * const resultados = carrera.obtenerResultados();
     * // Returns: {
     * //   posiciones: [
     * //     { posicion: 1, piloto: "Leclerc", tiempo: "1:45:23.456" },
     * //     { posicion: 2, piloto: "Verstappen", tiempo: "+2.345" },
     * //     ...
     * //   ],
     * //   vueltasCompletadas: 45,
     * //   vueltasRestantes: 33,
     * //   estado: "en_progreso"
     * // }
     */
    obtenerResultados() {
        // Implementar lógica para obtener resultados
    }
}

module.exports = Carrera;