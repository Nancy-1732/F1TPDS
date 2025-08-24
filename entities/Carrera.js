class Carrera {
    constructor(nombre, circuito, fecha) {
        this.nombre = nombre;
        this.circuito = circuito;
        this.fecha = fecha;
        this.autosParticipantes = [];
        this.condicionesClimaticas = {};
        this.numeroVueltas = 0;
        this.numeroVuelta = 0;
        this.resultados = [];
        this.posiciones = [];
        this.clasificacion = {
            q1: [],
            q2: [],
            q3: []
        };
        this.vueltaRapida = null;
        this.estado = null;
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
        this.cambiarClima();
        if (!this.esValida()) throw new Error("La carrera no cumple requisitos mínimos");

        this.calcularNumeroVueltas();
        this.estado = "iniciada";

        return {
            estado: this.estado,
            numeroVueltas: this.numeroVueltas,
            autosParticipantes: this.autosParticipantes.length,
            condicionesClimaticas: this.condicionesClimaticas
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
        return Object.keys(this.condicionesClimaticas).length > 0;
    }

    validarFecha() {
        const [aa, mm, dd] = this.fecha.split("-").map(Number);
        let fecha = new Date(aa, mm - 1, dd);
        return (fecha.getMonth() >= 0 && fecha.getMonth() <= 11) && (fecha.getDate() >= 1 && fecha.getDate() <= 31);
    }

    esValida() {
        return this.autosParticipantes.length >= 10 
            && this.circuito.ubicacion != null 
            && this.validarClima() 
            && this.validarFecha();
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
            return this.autosParticipantes.reduce((acc, auto) => acc += auto.velocidadMaxima,0) / this.autosParticipantes.length;
        }
    }

    calcularNivelPiloto(piloto) {
        return (piloto.habilidades.velocidad + piloto.habilidades.consistencia) / 200;
    }

    promedioFactorPiloto(auto) {
        if (auto != null) {
            return this.calcularNivelPiloto(auto.conductor);
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
            let conteo = this.autosParticipantes.reduce((acc, a) => {
                const n = a?.neumaticos;
                if (!n) return acc;                  // por si hay null
                const k = n.nombre;                  // clave estable
                acc[k] = acc[k] ? { count: acc[k].count + 1, obj: acc[k].obj } 
                            : { count: 1, obj: n };
                return acc;                         
            }  , {});

            // Elegimos el más frecuente y devolvemos el objeto
            if (Object.keys(conteo).length === 0) return null;
            return Object.entries(conteo)
                .reduce((max, actual) => actual[1].count > max[1].count ? actual : max)[1].obj;
        }
    }

    obtenerFactorClima() {
        let clima = this.condicionesClimaticas.clima;
        return clima == "seco" ? 1.00 : clima == "mojado" ? 1.10 : clima == "lluvia" ? 1.15 : 1.00;
    }

    /*obtenerFactorDesgaste() {
        return this.autosParticipantes
    } */

    calcularTiempoVuelta(auto) {
        let tiempoBase = (this.circuito.longitudKm / this.velocidadAuto(auto)) * 3600;
        let factorPiloto = 1 - (this.promedioFactorPiloto(auto) * 0.1);
        let factorNeumaticos = this.obtenerNeumatico(auto).factor;
        let factorDesgaste = 1 + (this.obtenerNeumatico(auto).desgaste * 0.001);
        let factorClima = this.obtenerFactorClima();  
        

        return tiempoBase * factorPiloto * factorNeumaticos * factorClima * factorDesgaste;
    }

    formatearTiempo(segundos) {
        const totalMs = Math.round(segundos * 1000); // convierto a ms
        const minutos = Math.floor(totalMs / 60000);
        const segundosRest = Math.floor((totalMs % 60000) / 1000)
            .toString()
            .padStart(2, "0");
        const milis = (totalMs % 1000).toString().padStart(3, "0");

        return `${minutos}:${segundosRest}.${milis}`;
    }

    obtenerFactorCircuito() {
        return this.circuito.longitudKm / 5;  
    }

    obtenerConsumoPorVuelta() {
        let consumoBase = 2.5;

        return consumoBase * this.obtenerFactorCircuito();
    }

    calcularNumeroVueltas() {
        let vueltasDuracion = (90*60) / this.calcularTiempoVuelta();
        let vueltasCombustible = 110 / this.obtenerConsumoPorVuelta();
        let vueltasNeumatico = 40 * this.obtenerFactorCircuito();

        this.numeroVueltas = Math.floor(Math.min(vueltasDuracion, vueltasCombustible, vueltasNeumatico));
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

    realizarVuelta(autos) {
        let q = [];
        for (let auto of autos) {
            let tiempoNum = this.calcularTiempoVuelta(auto);
            let piloto = {
                piloto: auto.conductor.nombre,
                tiempo: this.formatearTiempo(tiempoNum),
                tiempoNum
            };
            q.push(piloto);
        }

        q.sort((a,b) => a.tiempoNum - b.tiempoNum);

        return q;
    }

    realizarClasificacion() {
        const q1 = this.realizarVuelta(this.autosParticipantes);
        this.clasificacion.q1 = q1;

        const vivosQ2 = q1.slice(0, Math.max(0, q1.length - 5)).map(x =>
            this.autosParticipantes.find(a => a.conductor?.nombre === x.piloto)
        );
        const q2 = this.realizarVuelta(vivosQ2);
        this.clasificacion.q2 = q2;

        const vivosQ3 = q2.slice(0, Math.min(10, q2.length)).map(x =>
            vivosQ2.find(a => a.conductor?.nombre === x.piloto)
        );
        const q3 = this.realizarVuelta(vivosQ3);
        this.clasificacion.q3 = q3;

        const posicionesSalida = [
            ...q3.map((p, i) => ({ piloto: p.piloto, posicion: i + 1 })),
            ...q2.slice(q3.length).map((p, i) => ({ piloto: p.piloto, posicion: q3.length + i + 1 })),
            ...q1.slice(q2.length).map((p, i) => ({
                piloto: p.piloto,
                posicion: q3.length + (q2.length - q3.length) + i + 1
            }))
        ];

        return { q1, q2, q3, posicionesSalida };
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
// Reemplazá esVueltaRapida en Carrera.js
    esVueltaRapida(auto, tiempo) {
        if (!this.vueltaRapida || tiempo < this.vueltaRapida.tiempoNum) {
            this.vueltaRapida = { 
            piloto: auto.conductor.nombre, 
            tiempo: this.formatearTiempo(tiempo), // para mostrar
            tiempoNum: tiempo                     // para comparar
            };
            return true;
        }
        return false;
    }


    registrarVuelta(auto, tiempo) {
        // Implementar lógica para registrar una vuelta
        return {
            numeroVuelta: this.numeroVuelta,
            piloto: auto.conductor.nombre,
            tiempo: this.formatearTiempo(tiempo),
            esVueltaRapida: this.esVueltaRapida(auto, tiempo)
        };
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

    ejecutarVuelta() {
        if (this.numeroVuelta === this.numeroVueltas) {
            return this.posiciones;
        }

        const resultadosVuelta = [];

        for (const auto of this.autosParticipantes) {
            const tiempoNum = this.calcularTiempoVuelta(auto);
            const reg = this.registrarVuelta(auto, tiempoNum);

            const velocidadMedia = this.velocidadAuto(auto) * 0.65; // heurística simple

            const condiciones = {
                temperatura: this.condicionesClimaticas.temperatura,
                humedad: this.condicionesClimaticas.humedad
            };

            const d = auto.calcularDesgaste({
                numero: this.numeroVuelta + 1,
                velocidad: velocidadMedia,
                condiciones
            });

            auto.desgasteNeumaticos = Math.min(100, auto.desgasteNeumaticos + d.desgasteNeumaticos);
            auto.desgasteMotor      = Math.min(100, auto.desgasteMotor + d.desgasteMotor);
            auto.combustible        = Math.max(0,   auto.combustible - d.combustibleConsumido);
            
            resultadosVuelta.push({
                auto,
                piloto: reg.piloto,
                tiempoNum,                 // numérico para ordenar
                tiempo: reg.tiempo,        // formateado (de registrarVuelta)
            });
        }

        // 4) ordenar por tiempo numérico ascendente
        resultadosVuelta.sort((a, b) => a.tiempoNum - b.tiempoNum);

        // 5) actualizar estado "en vivo"
        this.posiciones = resultadosVuelta.map((r, i) => ({
            posicion: i + 1,
            piloto: r.piloto,
            tiempo: r.tiempo,
        }));

        this.numeroVuelta++;

        // 7) devolver lista ordenada
        return this.posiciones;
    }

    finalizarCarrera() {
        // Implementar lógica para finalizar la carrera
        let parrilla = this.ejecutarVuelta();
        let podio = parrilla
            .slice(0,3)
            .map((p, i)=> ({ posicion: i+1, piloto: p.piloto, tiempo: p.tiempo}));
        
        const pts = [25,18,15,12,10,8,6,4,2,1];
        let puntos = parrilla.map((p, i) => ({ piloto: p.piloto, puntos: pts[i] ?? 0 }));

        this.estado = "finalizada";
        
        return {
            podio: podio,
            vueltaRapida: this.vueltaRapida,
            puntos: puntos
        }
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
        this.estado = (this.numeroVuelta >= this.numeroVueltas ? "finalizada" : "en_progreso");
        return {
            posiciones: this.posiciones,
            vueltasCompletadas: this.numeroVuelta,
            vueltasRestantes: this.numeroVueltas-this.numeroVuelta,
            estado: this.estado
        };
    }
}

module.exports = Carrera;