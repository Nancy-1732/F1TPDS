class Estrategia {
    constructor(numeroParadas, tiposNeumaticos, vueltasParada, agresividad) {
        this.numeroParadas = numeroParadas;
        this.tiposNeumaticos = tiposNeumaticos;
        this.vueltasParada = vueltasParada;
        this.agresividad = agresividad;
        this.paradasRealizadas = 0;
        this.tiempoTotalPitStops = 0;
    }

    /**
     * Valida si la estrategia es óptima según las condiciones de la carrera
     * @returns {boolean} true si:
     * - El número de paradas es adecuado para la duración de la carrera
     * - La distribución de neumáticos es óptima
     * - El nivel de agresividad es apropiado
     * 
     * @example
     * const estrategia = new Estrategia(
     *   2, // número de paradas
     *   ["blandos", "duros", "duros"], // tipos de neumáticos
     *   [20, 40], // vueltas de parada
     *   "media" // agresividad
     * );
     * const esOptima = estrategia.esOptima();
     * // Returns: true si la estrategia es óptima para una carrera de 60 vueltas
     */
  esOptima() {
          // Validar número de paradas y vueltas de parada
          if (
              typeof this.numeroParadas !== 'number' ||
              this.numeroParadas < 0 ||
              !Array.isArray(this.vueltasParada) ||
              this.vueltasParada.length !== this.numeroParadas
          ) {
              return false;
          }
          if (
              !Array.isArray(this.tiposNeumaticos) ||
              this.tiposNeumaticos.length !== this.numeroParadas + 1
          ) {
              return false;
          }
          if (this.vueltasParada.some(v => typeof v !== 'number' || v < 0)) {
              return false
          }
          // Si pasa todas las validaciones mínimas, consideramos óptima (con la info disponible)
          return true;
      }

      /**
       * Verifica si las paradas están distribuidas uniformemente
       * @returns {boolean} true si:
       * - Los intervalos entre paradas son similares
       * - Las vueltas de parada están bien espaciadas
       * - No hay acumulación de paradas
       * 
       * @example
       * const estrategia = new Estrategia(
       *   2,
       *   ["blandos", "duros", "duros"],
       *   [20, 40],
       *   "media"
       * );
       * const distribucion = estrategia.paradasDistribuidasUniformemente();
       * // Returns: true si los intervalos entre paradas son similares
       */
  paradasDistribuidasUniformemente() {
    if (!Array.isArray(this.vueltasParada) || this.vueltasParada.length < 2) {
      return true;
    }
    const vueltas = [...this.vueltasParada].sort((a, b) => a - b);
    const intervalos = [];
    for (let i = 1; i < vueltas.length; i++) {
      intervalos.push(vueltas[i] - vueltas[i - 1]);
    }
    const promedio = intervalos.reduce((a, b) => a + b, 0) / intervalos.length;
    
    // Se considera uniforme si todos los intervalos están cerca del promedio
    return intervalos.every(i => Math.abs(i - promedio) <= 1);
  }
  // Si quisieramos ser especificos seria con intervalos de mínimos y máximos

      /**
       * Valida si el nivel de agresividad es consistente
       * @returns {boolean} true si:
       * - La agresividad es consistente con el tipo de neumáticos
       * - El nivel es apropiado para las condiciones
       * - No hay cambios bruscos de agresividad
       * 
       * @example
       * const estrategia = new Estrategia(
       *   2,
       *   ["blandos", "duros", "duros"],
       *   [20, 40],
       *   "media"
       * );
       * const agresividad = estrategia.agresividadConsistente();
       * // Returns: true si la agresividad es consistente con la estrategia
       */
  agresividadConsistente() {
    if (!this.agresividad) return false;

    if (this.agresividad === "alta") return this.tiposNeumaticos.includes("blandos");
    if (this.agresividad === "baja") return !this.tiposNeumaticos.every(n => n === "blandos");
    if (this.agresividad === "media") return true;

    return false;
  }

      /**
       * Registra una parada en boxes con su tiempo
       * @param {number} tiempo - Tiempo de la parada en segundos
       * @returns {Object} Información de la parada registrada
       * 
       * @example
       * const estrategia = new Estrategia(
       *   2,
       *   ["blandos", "duros", "duros"],
       *   [20, 40],
       *   "media"
       * );
       * const parada = estrategia.registrarParada(2.5);
       * // Returns: {
       * //   numeroParada: 1,
       * //   tiempo: 2.5,
       * //   vuelta: 20,
       * //   neumaticos: "duros",
       * //   tiempoTotalPitStops: 2.5
       * // }
       */
  registrarParada(tiempo) {
    const index = this.paradasRealizadas; 
    const vuelta = this.vueltasParada[index];
    const neumaticos = this.tiposNeumaticos[index + 1];

    this.paradasRealizadas++;
    this.tiempoTotalPitStops += tiempo;

    return {
      numeroParada: this.paradasRealizadas,
      tiempo,
      vuelta,
      neumaticos,
      tiempoTotalPitStops: this.tiempoTotalPitStops
    };
  }

      /**
       * Obtiene información sobre la próxima parada programada
       * @returns {Object} Detalles de la próxima parada
       * 
       * @example
       * const estrategia = new Estrategia(
       *   2,
       *   ["blandos", "duros", "duros"],
       *   [20, 40],
       *   "media"
       * );
       * const siguienteParada = estrategia.obtenerSiguienteParada();
       * // Returns: {
       * //   vuelta: 20,
       * //   neumaticos: "duros",
       * //   tiempoEstimado: 2.5,
       * //   paradaNumero: 1
       * // }
       */
  obtenerSiguienteParada() {
    if (this.paradasRealizadas >= this.numeroParadas) return null;

    const i = this.paradasRealizadas;
    const vuelta = this.vueltasParada?.[i];
    const neumaticos = this.tiposNeumaticos?.[i + 1];
    if (vuelta == null || neumaticos == null) return null;

    const tiempoEstimado = i ? this.tiempoTotalPitStops / i : null;
    return { vuelta, neumaticos, tiempoEstimado, paradaNumero: i + 1 };
  }
}

module.exports = Estrategia; 