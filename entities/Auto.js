class Auto {
    constructor(numero, marca, modelo, neumaticos, velocidadMaxima, combustible) {
        this.numero = numero;
        this.marca = marca;
        this.modelo = modelo;
        this.neumaticos = neumaticos;
        this.velocidadMaxima = velocidadMaxima;
        this.combustible = combustible;
        this.estado = 'en_carrera'; // en_carrera, en_boxes, reserva, desarrollo
        this.conductor = null;
        this.tiempoVuelta = 0;
        this.desgasteNeumaticos = 0;
        this.desgasteMotor = 0;
        this.kmRecorridos = 0;
        this.piezasNuevas = [];
        this.tiempoReparacion = 0;
    }

    /**
     * Configura los niveles iniciales de desgaste del auto
     * @param {Object} configuracion - Objeto con niveles iniciales de desgaste
     * @param {number} configuracion.desgasteNeumaticos - Desgaste inicial de neumáticos (0-100)
     * @param {number} configuracion.desgasteMotor - Desgaste inicial del motor (0-100)
     * @param {number} configuracion.combustible - Nivel inicial de combustible (0-100)
     * @returns {void}
     * @throws {Error} Si algún valor está fuera del rango 0-100
     * 
     * @example
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 100);
     * auto.configurarDesgasteInicial({
     *   desgasteNeumaticos: 0,
     *   desgasteMotor: 0,
     *   combustible: 100
     * });
     */
    configurarDesgasteInicial(configuracion) {
        if(this.configTieneRangoCorrecto(configuracion, 0, 100)) {
            this.desgasteNeumaticos = configuracion.neumaticos;
            this.desgasteMotor = configuracion.motor;
            this.combustible = configuracion.combustible;
        } else {
            throw new Error("ERROR: Hay elementos en la configuracion de desgaste fuera de rango");
        }
    }

    configTieneRangoCorrecto(configuracion, min, max) {
        let config = [];
        config[0] = configuracion.neumaticos;
        config[1] = configuracion.motor;
        config[2] = configuracion.combustible;

        return config.every((configDesgaste) => configDesgaste >= min && configDesgaste <= max);
    }

    /**
     * Verifica si el auto está en condiciones óptimas para competir
     * @returns {boolean} true si:
     * - Desgaste de neumáticos < 30%
     * - Nivel de combustible > 20%
     * - Desgaste del motor < 40%
     * - Si está en carrera, debe tener conductor asignado
     * 
     * @example
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 100);
     * auto.conductor = "Lewis Hamilton";
     * const estaOptimo = auto.estaEnCondicionesOptimas();
     * // Returns: true si cumple todas las condiciones
     */
    estaEnCondicionesOptimas() {
        let existeConductorEnCarrera = true;

        if(this.estado == 'en_carrera' && this.conductor == null) {
            existeConductorEnCarrera = false;
        }
        
        return this.tieneDesgasteOptimo() && existeConductorEnCarrera;
    }

    tieneDesgasteOptimo() {   //NO CALCULE PORCENTAJES, 0 A 100 = 0% A 100%
        return this.desgasteNeumaticos < 30 && this.desgasteMotor < 40 && this.combustible > 20;
    }

    /**
     * Cambia los neumáticos del auto
     * @param {string} tipoNeumaticos - Tipo de neumáticos a instalar (blandos, medios, duros)
     * @returns {Object} Información sobre el cambio de neumáticos
     * @throws {Error} Si el tipo de neumáticos no es válido
     * 
     * @example
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 100);
     * const resultado = auto.cambiarNeumaticos("duros");
     * // Returns: { tipoAnterior: "blandos", tipoNuevo: "duros", desgasteReseteado: true }
     */
    cambiarNeumaticos(tipoNeumaticos) {
        let infoNeumaticos = {tipoAnterior: this.neumaticos, tipoNuevo: "-", desgasteReseteado: false};

        if(this.existeTipoNeumaticos(tipoNeumaticos)) {
            this.neumaticos = tipoNeumaticos;
            this.desgasteNeumaticos = 0;
            infoNeumaticos.tipoNuevo = tipoNeumaticos;
            infoNeumaticos.desgasteReseteado = true;
        } else {
            console.log("ERROR: Tipo de neumatico invalido");
        }

        return infoNeumaticos;
    }

    existeTipoNeumaticos(tipoNeumaticos) {
        return tipoNeumaticos == 'blandos' || tipoNeumaticos == 'medios' || tipoNeumaticos == 'duros';
    }

    /**
     * Reposta combustible en el auto
     * @param {number} cantidad - Cantidad de combustible a repostar (0-100)
     * @returns {Object} Información sobre el repostaje
     * @throws {Error} Si la cantidad supera el 100% del tanque
     * 
     * @example
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 50);
     * const resultado = auto.repostarCombustible(30);
     * // Returns: { combustibleAnterior: 50, combustibleNuevo: 80 }
     */
    repostarCombustible(cantidad) {
        let combustibleAnterior = this.combustible;

        if(cantidad <= 100) {
            this.combustible += cantidad;
            if(this.combustible > 100) {
                this.combustible = 100;
                console.log("El tanque esta al maximo!")
            };
        } else {
            console.log("ERROR: ingrese una cantidad de combustible entre 0 y 100")
        }

        return {combustibleAnterior: combustibleAnterior, combustibleNuevo: this.combustible}
    }

    /**
     * Instala una nueva pieza en el auto
     * @param {Object} pieza - Información de la pieza a instalar
     * @param {string} pieza.tipo - Tipo de pieza (motor, aerodinámica, neumáticos, suspensión)
     * @param {string} pieza.especificacion - Especificación técnica de la pieza
     * @returns {Object} Información sobre la instalación
     * 
     * @example
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 100);
     * const resultado = auto.instalarPiezaNueva({
     *   tipo: "motor",
     *   especificacion: "nueva versión"
     * });
     * // Returns: { piezaInstalada: true, estadoActualizado: "desarrollo" }
     */
    instalarPiezaNueva(pieza) {
        this.piezasNuevas.push(pieza);
        this.estado = 'desarrollo';
        return {piezaInstalada: true, estadoActualizado: this.estado};
    }

    /**
     * Calcula el desgaste del auto después de una vuelta
     * @param {Object} vuelta - Información de la vuelta
     * @param {number} vuelta.numero - Número de vuelta
     * @param {number} vuelta.velocidad - Velocidad promedio en km/h
     * @param {Object} vuelta.condiciones - Condiciones de la pista
     * @returns {Object} Información sobre el desgaste
     * 
     * @example
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 100);
     * const desgaste = auto.calcularDesgaste({
     *   numero: 15,
     *   velocidad: 210,
     *   condiciones: { temperatura: 25, humedad: 40 }
     * });
     * // Returns: { desgasteNeumaticos: 2.5, desgasteMotor: 1.2, combustibleConsumido: 1.8 }
     */
    calcularDesgaste(vuelta) {
        let diferenciaVelocidades = vuelta.velocidad / this.velocidadMaxima;

        let desgasteNeumaticos = diferenciaVelocidades;
        if (vuelta.condiciones.temperatura > 35) desgasteNeumaticos *= 1.15;

        let desgasteMotor = diferenciaVelocidades;
        if(vuelta.condiciones.humedad > 60) desgasteMotor *= 1.10;

        let combustibleConsumido = diferenciaVelocidades;

        return {desgasteNeumaticos: desgasteNeumaticos, desgasteMotor: desgasteMotor, combustibleConsumido: combustibleConsumido};
    }

    /**
     * Realiza un pit stop completo
     * @param {string} tipoNeumaticos - Tipo de neumáticos a instalar
     * @param {number} combustible - Cantidad de combustible a repostar
     * @returns {Object} Información sobre el pit stop
     * 
     * @example
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 50);
     * const pitStop = auto.realizarPitStop("duros", 30);
     * // Returns: { 
     * //   estado: "en_boxes",
     * //   operaciones: ["cambio_neumaticos", "repostaje"],
     * //   tiempoTotal: 4.2
     * // }
     */
    realizarPitStop(tipoNeumaticos, combustible) {
        this.estado = 'en_boxes';
        this.cambiarNeumaticos(tipoNeumaticos);
        this.repostarCombustible(combustible);

        //- Cambio de neumáticos: 2.5 segundos, Repostaje: 1.8 segundos, Entrada/Salida de boxes: 1.0 segundos
        let tiempoPitStop = 2.5 + 1.8 + 1.0;

        return {estado: this.estado, operaciones: ['cambio_neumaticos', 'repostaje'], tiempoTotal: tiempoPitStop};
    }

    /**
     * Obtiene estadísticas detalladas del desgaste del auto
     * @returns {Object} Estadísticas de desgaste
     * 
     * @example
     * const auto = new Auto(44, "Mercedes", "W13", "blandos", 340, 100);
     * const estadisticas = auto.obtenerEstadisticasDesgaste();
     * // Returns: {
     * //   desgasteNeumaticos: 45,
     * //   nivelCombustible: 60,
     * //   estadoMotor: 30,
     * //   estado: "en_carrera"
     * // }
     */
    obtenerEstadisticasDesgaste() {
        return {desgasteNeumaticos: this.desgasteNeumaticos, nivelCombustible: this.combustible, estadoMotor: this.desgasteMotor, estado: this.estado};
    }
}

module.exports = Auto;