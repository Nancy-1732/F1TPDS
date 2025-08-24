class Escuderia {
    constructor(nombre, paisOrigen, presupuesto) {
        this.nombre = nombre;
        this.paisOrigen = paisOrigen;
        this.presupuesto = presupuesto;
        this.autos = [];
        this.pilotos = [];
        this.desarrollo = {
            motor: { nivel: 0, estadisticas: { potencia: 0, eficiencia: 0 } },
            aerodinamica: { nivel: 0, estadisticas: { carga: 0, resistencia: 0 } },
            neumaticos: { nivel: 0, estadisticas: { durabilidad: 0, agarre: 0 } },
            suspension: { nivel: 0, estadisticas: { estabilidad: 0, respuesta: 0 } }
        };
        this.estadisticas = {
            victorias: 0,
            podios: 0,
            vueltasRapidas: 0,
            abandonos: 0
        };
    }
    calcularEstadisticasArea(area, nivel) {
        switch(area) {
            case 'motor':
                return { potencia: nivel * 10, eficiencia: nivel * 8 };
            case 'aerodinamica':
                return { carga: nivel * 9, resistencia: nivel * 7 };
            case 'neumaticos':
                return { durabilidad: nivel * 8, agarre: nivel * 9 };
            case 'suspension':
                return { estabilidad: nivel * 8, respuesta: nivel * 9 };
            default:
                return {};
        }
    }

    /**
     * Invierte un monto en el desarrollo de un área específica
     * @param {string} area - Área de desarrollo (motor, aerodinámica, neumáticos, suspensión)
     * @param {number} monto - Cantidad a invertir
     * @returns {Object} Información sobre la inversión
     * @throws {Error} Si el presupuesto es insuficiente o el área no es válida
     */
    invertirEnDesarrollo(area, monto) {
        if (monto > this.presupuesto) throw new Error("Presupuesto insuficiente");
            
        const nivelAnterior = this.desarrollo[area].nivel;
        const nivelesGanados = Math.floor(monto / 100000);
        const nivelNuevo = nivelAnterior + nivelesGanados;
        
        this.desarrollo[area].nivel = nivelNuevo;
        this.desarrollo[area].estadisticas = this.calcularEstadisticasArea(area, nivelNuevo);
        
        this.presupuesto -= monto;
        
        return {
            area: area,
            montoInvertido: monto,
            presupuestoRestante: this.presupuesto,
            nivelAnterior: nivelAnterior,
            nivelNuevo: nivelNuevo
        };
    }

    /**
     * Calcula la mejora esperada en un área según el monto invertido
     * @param {string} area - Área de desarrollo
     * @param {number} monto - Monto a invertir
     * @returns {Object} Cálculo de la mejora esperada
     */
    calcularMejora(area, monto) {
        const nivelActual = this.desarrollo[area].nivel;
        const nivelesGanados = Math.floor(monto / 100000);
        const nivelAlcanzado = nivelActual + nivelesGanados;
        
        const mejoras = this.calcularEstadisticasArea(area, nivelAlcanzado);
        
        return {
            area: area,
            ...mejoras,
            nivelAlcanzado: nivelAlcanzado
        };
    }

    /**
     * Valida si el desarrollo en un área fue exitoso
     * @param {string} area - Área de desarrollo
     * @returns {boolean} true si el desarrollo fue exitoso
     */
    esDesarrolloExitoso(area) {
        // Según los comentarios, esto debería validar si el nivel es adecuado
        // y el presupuesto fue bien utilizado. Como no hay criterios específicos,
        // asumimos que es exitoso si el nivel es mayor a 0
        return this.desarrollo[area].nivel > 0;
    }

    /**
     * Obtiene todas las estadísticas de la escudería
     * @returns {Object} Estadísticas completas
     */
    obtenerEstadisticas() {
        return {
            desarrollo: {...this.desarrollo},
            rendimiento: {...this.estadisticas},
            presupuesto: {
                total: this.presupuesto,
                disponible: this.presupuesto,
                invertido: 0 // No se especifica cómo calcular esto en los comentarios
            }
        };
    }

    /**
     * Actualiza una estadística específica de la escudería
     * @param {string} tipo - Tipo de estadística (victoria, podio, vueltaRapida, abandono)
     * @param {number} cantidad - Cantidad a actualizar
     * @returns {Object} Estadísticas actualizadas
     */
    actualizarEstadisticas(tipo, cantidad) {
        const propiedadMap = {
            'victoria': 'victorias',
            'podio': 'podios',
            'vueltaRapida': 'vueltasRapidas',
            'abandono': 'abandonos'
        };
        
        const propiedad = propiedadMap[tipo];
        const cantidadAnterior = this.estadisticas[propiedad];
        this.estadisticas[propiedad] += cantidad;
        
        // Si es una victoria, también suma un podio
        if (tipo === 'victoria') {
            this.estadisticas.podios += cantidad;
        }
        
        return {
            tipo: tipo,
            cantidadAnterior: cantidadAnterior,
            cantidadNueva: this.estadisticas[propiedad],
            estadisticasActualizadas: {...this.estadisticas}
        };
    }
}

module.exports = Escuderia;