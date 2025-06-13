class Estrategia {
    constructor(numeroParadas, tiposNeumaticos, vueltasParada, agresividad) {
        this.numeroParadas = numeroParadas;
        this.tiposNeumaticos = tiposNeumaticos;
        this.vueltasParada = vueltasParada;
        this.agresividad = agresividad;
        this.paradasRealizadas = 0;
        this.tiempoTotalPitStops = 0;
    }

    esOptima() {
        // Implementar lógica para validar estrategia óptima
    }

    paradasDistribuidasUniformemente() {
        // Implementar lógica para validar distribución de paradas
    }

    agresividadConsistente() {
        // Implementar lógica para validar agresividad
    }

    registrarParada(tiempo) {
        // Implementar lógica para registrar parada
    }

    obtenerSiguienteParada() {
        // Implementar lógica para obtener siguiente parada
    }
}

module.exports = Estrategia; 