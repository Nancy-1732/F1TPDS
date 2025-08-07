class Piloto {
    constructor(nombre, nacionalidad, puntosCampeonato) {
        this.nombre = nombre;
        this.nacionalidad = nacionalidad;
        this.puntosCampeonato = puntosCampeonato;
        this.estilo = 'agresivo'; // agresivo, conservador, desarrollo
        this.habilidad = 0;
        this.autosConducidos = [];
        this.victorias = 0;
        this.podios = 0;
        this.vueltasRapidas = 0;
        this.adelantamientos = 0;
        this.errores = 0;
        this.auto = null;
        this.habilidades = {
            velocidad: 0,
            consistencia: 0,
            agresividad: 0
        };
        this.estadisticas = {
            victorias: 0,
            podios: 0,
            vueltasRapidas: 0,
            abandonos: 0
        };
    }

    /**
     * Establece las habilidades del piloto
     * @param {Object} habilidades - Objeto con valores de habilidades (0-100)
     * @param {number} habilidades.velocidad - Nivel de velocidad
     * @param {number} habilidades.consistencia - Nivel de consistencia
     * @param {number} habilidades.agresividad - Nivel de agresividad
     * @returns {Object} Habilidades actualizadas
     * @throws {Error} Si algún valor está fuera del rango 0-100
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const habilidades = piloto.establecerHabilidades({
     *   velocidad: 95,
     *   consistencia: 90,
     *   agresividad: 85
     * });
     * // Returns: {
     * //   velocidad: 95,
     * //   consistencia: 90,
     * //   agresividad: 85,
     * //   nivelTotal: 90
     * // }
     */

    establecerHabilidades(habilidades) {
    const velocidad = habilidades.velocidad;
    const consistencia = habilidades.consistencia;
    const agresividad = habilidades.agresividad;

    // Para validar cada habilidad según lógica de la consigna
    if (typeof velocidad !== 'number' || velocidad < 0 || velocidad > 100) {
        throw new Error('La habilidad velocidad debe estar entre 0 y 100');
    }
    if (typeof consistencia !== 'number' || consistencia < 0 || consistencia > 100) {
        throw new Error('La habilidad consistencia debe estar entre 0 y 100');
    }
    if (typeof agresividad !== 'number' || agresividad < 0 || agresividad > 100) {
        throw new Error('La habilidad agresividad debe estar entre 0 y 100');
    }

    this.habilidades.velocidad = velocidad;
    this.habilidades.consistencia = consistencia;
    this.habilidades.agresividad = agresividad;

    // Calculamos el promedio
    const nivelTotal = (velocidad + consistencia + agresividad) / 3;
    this.habilidad = nivelTotal;

    return {
        velocidad: velocidad,
        consistencia: consistencia,
        agresividad: agresividad,
        nivelTotal: nivelTotal
    };
}


    /**
     * Valida si el piloto puede conducir un auto específico
     * @param {Object} auto - Auto a validar
     * @returns {boolean} true si:
     * - El piloto tiene las habilidades necesarias
     * - El auto está disponible
     * - La compatibilidad es adecuada
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 100);
     * const puedeConducir = piloto.puedeConducirAuto(auto);
     * // Returns: true si cumple con los requisitos
     */
    puedeConducirAuto(auto) {
    if (!auto || auto.estado !== "reserva") {
        return false;
    }
    // Verificamos si el piloto tiene suficiente habilidad
    // Si el auto tiene un requerimiento de habilidad, lo comparamos
    if (typeof auto.requerimientoHabilidad === "number") {
        if (this.habilidad < auto.requerimientoHabilidad) {
            return false;
        }
    }
    // Si todo está bien, puede conducir
    return true;
}


    /**
     * Asigna un auto al piloto
     * @param {Object} auto - Auto a asignar
     * @returns {Object} Información de la asignación
     * @throws {Error} Si el auto no está disponible o no es compatible
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 100);
     * const asignacion = piloto.conducirAuto(auto);
     * // Returns: {
     * //   piloto: "Lewis Hamilton",
     * //   auto: "Mercedes W13",
     * //   numero: 44,
     * //   estado: "asignado"
     * // }
     */
    conducirAuto(auto) {
    // Verificamos si el piloto puede conducir el auto
    if (!this.puedeConducirAuto(auto)) {
        throw new Error("El piloto no puede conducir este auto.");
    }
    // Asignamos el auto al piloto
    this.auto = auto;
    // Asignamos el piloto al auto (si existe la propiedad)
    if ('conductor' in auto) {
        auto.conductor = this;
    }
    // Cambiamos el estado del auto a "asignado"
    if ('estado' in auto) {
        auto.estado = "asignado";
    }
    // Guardamos el auto en el historial
    this.autosConducidos.push(auto);

    // Retornamos información de la asignación
    return {
        piloto: this.nombre,
        auto: auto.marca + " " + auto.modelo,
        numero: auto.numero,
        estado: auto.estado
    };
}

    /**
     * Calcula el rendimiento del piloto según las condiciones
     * @param {Object} condiciones - Condiciones de la carrera
     * @param {string} condiciones.clima - Clima actual
     * @param {number} condiciones.temperatura - Temperatura en grados
     * @param {number} condiciones.humedad - Humedad relativa
     * @returns {Object} Rendimiento calculado
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const rendimiento = piloto.calcularRendimiento({
     *   clima: "seco",
     *   temperatura: 25,
     *   humedad: 40
     * });
     * // Returns: {
     * //   velocidad: 92,
     * //   consistencia: 88,
     * //   agresividad: 85,
     * //   rendimientoTotal: 88.3
     * // }
     */

calcularRendimiento(condiciones) {
    // Copiamos las habilidades actuales
    let velocidad = this.habilidades.velocidad;
    let consistencia = this.habilidades.consistencia;
    let agresividad = this.habilidades.agresividad;

    // Ajustamos según el clima
    if (condiciones.clima === "lluvia") {
        velocidad -= 5;
        consistencia += 5;
        agresividad -= 5;
    } else if (condiciones.clima === "seco") {
        velocidad += 2;
        agresividad += 2;
    }

    // Ajustamos según temperatura (ejemplo: si hace mucho calor, baja consistencia)
    if (condiciones.temperatura > 30) {
        consistencia -= 3;
    }

    // Ajustamos según humedad (ejemplo: mucha humedad, baja agresividad)
    if (condiciones.humedad > 70) {
        agresividad -= 2;
    }

    // Nos aseguramos que los valores estén entre 0 y 100
    velocidad = Math.max(0, Math.min(100, velocidad));
    consistencia = Math.max(0, Math.min(100, consistencia));
    agresividad = Math.max(0, Math.min(100, agresividad));

    // Calculamos el promedio
    const rendimientoTotal = (velocidad + consistencia + agresividad) / 3;

    return {
        velocidad,
        consistencia,
        agresividad,
        rendimientoTotal
    };
}
    /**
     * Adapta el estilo de conducción según las condiciones
     * @param {Object} condiciones - Condiciones actuales
     * @returns {Object} Estilo adaptado
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const estilo = piloto.adaptarEstiloConduccion({
     *   clima: "lluvia",
     *   visibilidad: "baja",
     *   estadoPista: "mojada"
     * });
     * // Returns: {
     * //   estiloAnterior: "agresivo",
     * //   estiloNuevo: "conservador",
     * //   ajustes: {
     * //     agresividad: -20,
     * //     consistencia: +15
     * //   }
     * // }
     */
adaptarEstiloConduccion(condiciones) {
    const estiloAnterior = this.estilo;
    let ajustes = { agresividad: 0, consistencia: 0 };

    // Si hay lluvia, pista mojada o baja visibilidad, el piloto se vuelve más conservador
    if (
        condiciones.clima === "lluvia" ||
        condiciones.estadoPista === "mojada" ||
        condiciones.visibilidad === "baja"
    ) {
        this.estilo = "conservador";
        ajustes.agresividad = -20;
        ajustes.consistencia = +15;
        this.habilidades.agresividad = Math.max(0, this.habilidades.agresividad + ajustes.agresividad);
        this.habilidades.consistencia = Math.min(100, this.habilidades.consistencia + ajustes.consistencia);
    } else {
        // Si todo está normal, vuelve a agresivo
        this.estilo = "agresivo";
        ajustes.agresividad = +10;
        ajustes.consistencia = -5;
        this.habilidades.agresividad = Math.min(100, this.habilidades.agresividad + ajustes.agresividad);
        this.habilidades.consistencia = Math.max(0, this.habilidades.consistencia + ajustes.consistencia);
    }

    return {
        estiloAnterior,
        estiloNuevo: this.estilo,
        ajustes
    };
}

    /**
     * Registra una victoria del piloto
     * @returns {Object} Estadísticas actualizadas
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const estadisticas = piloto.registrarVictoria();
     * // Returns: {
     * //   victorias: 1,
     * //   puntosCampeonato: 25,
     * //   estadisticas: {
     * //     victorias: 1,
     * //     podios: 0,
     * //     vueltasRapidas: 0
     * //   }
     * // }
     */

registrarVictoria() {
    this.victorias += 1;
    this.puntosCampeonato += 25; // 25 puntos por victoria
    this.estadisticas.victorias = this.victorias;
    return {
        victorias: this.victorias,
        puntosCampeonato: this.puntosCampeonato,
        estadisticas: {
            victorias: this.victorias,
            podios: this.podios,
            vueltasRapidas: this.vueltasRapidas
        }
    };
}

    /**
     * Registra un podio del piloto
     * @param {number} posicion - Posición en el podio (1-3)
     * @returns {Object} Estadísticas actualizadas
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const estadisticas = piloto.registrarPodio(2);
     * // Returns: {
     * //   podios: 1,
     * //   puntosCampeonato: 18,
     * //   estadisticas: {
     * //     victorias: 0,
     * //     podios: 1,
     * //     vueltasRapidas: 0
     * //   }
     * // }
     */
registrarPodio(posicion) {
    if (posicion < 1 || posicion > 3) {
        throw new Error("La posición de podio debe ser 1, 2 o 3.");
    }
    this.podios += 1;
    let puntos = 0;
    if (posicion === 1) puntos = 25;
    else if (posicion === 2) puntos = 18;
    else if (posicion === 3) puntos = 15;
    this.puntosCampeonato += puntos;
    this.estadisticas.podios = this.podios;
    return {
        podios: this.podios,
        puntosCampeonato: this.puntosCampeonato,
        estadisticas: {
            victorias: this.victorias,
            podios: this.podios,
            vueltasRapidas: this.vueltasRapidas
        }
    };
}

    /**
     * Registra una vuelta rápida del piloto
     * @returns {Object} Estadísticas actualizadas
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const estadisticas = piloto.registrarVueltaRapida();
     * // Returns: {
     * //   vueltasRapidas: 1,
     * //   puntosCampeonato: 1,
     * //   estadisticas: {
     * //     victorias: 0,
     * //     podios: 0,
     * //     vueltasRapidas: 1
     * //   }
     * // }
     */
registrarVueltaRapida() {
    this.vueltasRapidas += 1;
    this.puntosCampeonato += 1; // 1 punto por vuelta rápida
    this.estadisticas.vueltasRapidas = this.vueltasRapidas;
    return {
        vueltasRapidas: this.vueltasRapidas,
        puntosCampeonato: this.puntosCampeonato,
        estadisticas: {
            victorias: this.victorias,
            podios: this.podios,
            vueltasRapidas: this.vueltasRapidas
        }
    };
}

    /**
     * Obtiene todas las estadísticas del piloto
     * @returns {Object} Estadísticas completas
     * 
     * @example
     * const piloto = new Piloto("Lewis Hamilton", "Británico", 0);
     * const estadisticas = piloto.obtenerEstadisticas();
     * // Returns: {
     * //   general: {
     * //     victorias: 5,
     * //     podios: 12,
     * //     vueltasRapidas: 3,
     * //     puntosCampeonato: 150
     * //   },
     * //   habilidades: {
     * //     velocidad: 95,
     * //     consistencia: 90,
     * //     agresividad: 85
     * //   },
     * //   rendimiento: {
     * //     adelantamientos: 15,
     * //     errores: 2,
     * //     vueltasCompletadas: 450
     * //   }
     * // }
     */

obtenerEstadisticas() {
    return {
        general: {
            victorias: this.victorias,
            podios: this.podios,
            vueltasRapidas: this.vueltasRapidas,
            puntosCampeonato: this.puntosCampeonato
        },
        habilidades: { ...this.habilidades },
        rendimiento: {
            adelantamientos: this.adelantamientos,
            errores: this.errores,
            vueltasCompletadas: this.autosConducidos.length 
        }
    };
  }
}

module.exports = Piloto; 