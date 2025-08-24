const Auto = require('./entities/Auto');
const Piloto = require('./entities/Piloto');
const Escuderia = require('./entities/Escuderia');
const Carrera = require('./entities/Carrera');
const Circuito = require('./entities/Circuito');
const Estrategia = require('./entities/Estrategia');
const Neumatico = require('./entities/Neumatico');

try {
    // Crear circuito con condiciones climáticas
    const circuito = new Circuito('Monza', 'Italia', 5.793);
    circuito.establecerCondicionesClimaticas('seco', 25, 50);
    circuito.agregarZonaDRS('Recta principal', 1000);
    circuito.agregarZonaDRS('Curva Parabolica', 800);

    // Agregar curvas al circuito
    circuito.agregarCurva('Curva 1', 250, 'alta');
    circuito.agregarCurva('Curva 2', 180, 'media');
    circuito.agregarCurva('Curva 3', 80, 'baja');

    // Crear escuderías con presupuesto y desarrollo
    const escuderia1 = new Escuderia('Ferrari', 'Italia', 400000000);
    const escuderia2 = new Escuderia('Mercedes', 'Alemania', 450000000);

    // Invertir en desarrollo (sin tildes en la clave)
    escuderia1.invertirEnDesarrollo('motor', 50000000);
    escuderia2.invertirEnDesarrollo('aerodinamica', 60000000);

    // Neumáticos (instancias)
    const BLANDOS = new Neumatico('blandos', 1.00, 5);
    const MEDIOS  = new Neumatico('medios',  1.02, 3);
    const DUROS   = new Neumatico('duros',   1.04, 2);

    // Crear autos con sistema de desgaste (usando instancias de Neumatico)
    const auto1 = new Auto(16, 'Ferrari', 'SF21', BLANDOS, 340, 100);
    const auto2 = new Auto(55, 'Ferrari', 'SF21', MEDIOS,  338, 100);
    const auto3 = new Auto(44, 'Mercedes', 'W12',  BLANDOS, 342, 100);
    const auto4 = new Auto(77, 'Mercedes', 'W12',  DUROS,   341, 100);

    // Desgaste inicial coherente (no 100% de desgaste)
    [auto1, auto2, auto3, auto4].forEach(auto => {
        auto.configurarDesgasteInicial({
            neumaticos: 0,
            combustible: 100,
            motor: 0
        });
    });

    // Crear pilotos con habilidades
    const piloto1 = new Piloto('Charles Leclerc', 'Mónaco', 0);
    const piloto2 = new Piloto('Carlos Sainz', 'España', 0);
    const piloto3 = new Piloto('Lewis Hamilton', 'Reino Unido', 0);
    const piloto4 = new Piloto('Valtteri Bottas', 'Finlandia', 0);

    // ---- BLOQUE DE PRUEBAS (mantengo tus logs tal cual) ----
    console.log('\nPrueba establecer habilidades:');
    console.log(piloto1.establecerHabilidades({ velocidad: 80, consistencia: 85, agresividad: 90 }));

    const autoPrueba = { 
      estado: "en_carrera", 
      marca: "Ferrari", 
      modelo: "SF21", 
      numero: 16,
      disponibilidad: true,
      requisitos: { velocidad: 70, consistencia: 70, agresividad: 70 }
    };
    console.log('\nPrueba puedeConducirAuto:');
    console.log(piloto1.puedeConducirAuto(autoPrueba));

    console.log('\nPrueba conducirAuto:');
    console.log(piloto1.conducirAuto(autoPrueba));

    console.log('\nPrueba calcular rendimiento:');
    console.log(piloto1.calcularRendimiento({ clima: 'seco', temperatura: 28, humedad: 40 }));

    console.log('\nPrueba adaptar estilo de conducción:');
    console.log(piloto4.adaptarEstiloConduccion({ clima: 'lluvia', estadoPista: 'mojada', visibilidad: 'baja' }));

    console.log('\nPrueba registrar victoria:');
    console.log(piloto1.registrarVictoria());

    console.log('\nPrueba registrar podio:');
    console.log(piloto2.registrarPodio(2));

    console.log('\nPrueba registrar vuelta rápida:');
    console.log(piloto3.registrarVueltaRapida());

    console.log('\nEstadísticas completas piloto1:');
    console.log(piloto1.obtenerEstadisticas());
    // ---- FIN BLOQUE DE PRUEBAS ----

    // Configurar habilidades para el finde (para conducir autos reales)
    [piloto1, piloto2, piloto3, piloto4].forEach(piloto => {
        piloto.establecerHabilidades({
            velocidad: 75 + Math.floor(Math.random() * 25),
            consistencia: 75 + Math.floor(Math.random() * 25),
            agresividad: 75 + Math.floor(Math.random() * 25)
        });
    });

    // Helper: preparar auto para piloto => disponibilidad y requisitos alcanzables
    const prepararAutoParaPiloto = (auto, piloto) => {
        auto.disponibilidad = true;
        auto.requisitos = {
            velocidad: Math.max(0, Math.min(100, piloto.habilidades.velocidad - 5)),
            consistencia: Math.max(0, Math.min(100, piloto.habilidades.consistencia - 5)),
            agresividad: Math.max(0, Math.min(100, piloto.habilidades.agresividad - 5))
        };
    };

    // Asignar pilotos a autos, dejando todo listo para que puedan conducir
    prepararAutoParaPiloto(auto1, piloto1);
    prepararAutoParaPiloto(auto2, piloto2);
    prepararAutoParaPiloto(auto3, piloto3);
    prepararAutoParaPiloto(auto4, piloto4);

    piloto1.conducirAuto(auto1);
    piloto2.conducirAuto(auto2);
    piloto3.conducirAuto(auto3);
    piloto4.conducirAuto(auto4);

    // Crear estrategias de carrera (si tu Carrera las usa internamente)
    const estrategiaFerrari = new Estrategia(
        2,
        [BLANDOS.nombre, MEDIOS.nombre],
        [20, 40],
        80
    );

    const estrategiaMercedes = new Estrategia(
        3,
        [BLANDOS.nombre, MEDIOS.nombre, DUROS.nombre],
        [15, 30, 45],
        70
    );

    // Crear carrera
    const carrera = new Carrera('Gran Premio de Italia', circuito, '2024-09-08');

    // *** Completar parrilla a 10 autos ***
    const invitados = [];
    const poolNeus = [BLANDOS, MEDIOS, DUROS];
    for (let i = 0; i < 6; i++) {
        const num = 80 + i;
        const team = i % 2 === 0 ? 'Haas' : 'Williams';
        const model = i % 2 === 0 ? 'VF-23' : 'FW45';
        const set = poolNeus[i % poolNeus.length]; // instancia de Neumatico
        const autoInv = new Auto(num, team, model, set, 330 + (i % 3), 100);
        autoInv.configurarDesgasteInicial({ neumaticos: 0, combustible: 100, motor: 0 });

        const pilotoInv = new Piloto(`NP${i + 1}`, '—', 0);
        pilotoInv.establecerHabilidades({
            velocidad: 70 + (i % 5),
            consistencia: 70 + ((i + 2) % 5),
            agresividad: 70 + ((i + 3) % 5)
        });
        prepararAutoParaPiloto(autoInv, pilotoInv);
        pilotoInv.conducirAuto(autoInv);
        invitados.push({ auto: autoInv, piloto: pilotoInv });
    }

    // Registrar los autos participantes en la carrera (mín. 10)
    carrera.autosParticipantes = [
        auto1, auto2, auto3, auto4,
        ...invitados.map(x => x.auto)
    ];

    // --------- MANTENGO TU LOG ---------
    console.log('\nResultados de la Clasificación:');
    // imprimir contenido bajo el encabezado existente
    const clasificacion = carrera.realizarClasificacion();
    console.log(JSON.stringify(clasificacion, null, 2));
    // -----------------------------------

    // Iniciar carrera y EJECUTAR TODAS LAS VUELTAS (esto faltaba)
    carrera.iniciarCarrera();
    while (carrera.numeroVuelta < carrera.numeroVueltas) {
        carrera.ejecutarVuelta();
    }

    // --------- MANTENGO TU LOG ---------
    console.log('\nResultados finales de la carrera:');
    // imprimir contenido bajo el encabezado existente
    const final = carrera.finalizarCarrera();
    console.log(JSON.stringify(final, null, 2));
    // -----------------------------------

    // --------- MANTENGO TU LOG ---------
    console.log('\nEstadísticas de desgaste final:');
    [auto1, auto2, auto3, auto4, ...invitados.map(x => x.auto)].forEach(auto => {
        const d = auto.obtenerEstadisticasDesgaste() || {
            desgasteNeumaticos: 0,
            nivelCombustible: 0,
            estadoMotor: 0
        };
        console.log(`Auto #${auto.numero}:`);
        console.log(`- Desgaste neumáticos: ${d.desgasteNeumaticos}%`);
        console.log(`- Combustible restante: ${d.nivelCombustible}%`);
        console.log(`- Estado del motor: ${d.estadoMotor}%`);
    });
    // -----------------------------------

    // Para que estos no salgan undefined, derivamos de 'final'
    const puntosPorPiloto = new Map((final.puntos || []).map(p => [p.piloto, p.puntos]));

    // --------- MANTENGO TU LOG ---------
    console.log('\nPuntos por escudería:');
    // agrego el cálculo, pero mantengo exactamente las dos líneas que ya imprimías:
    const puntosFerrari = (final.puntos || []).reduce((acc, p) => {
        return acc + (['Charles Leclerc','Carlos Sainz'].includes(p.piloto) ? p.puntos : 0);
    }, 0);
    const puntosMercedes = (final.puntos || []).reduce((acc, p) => {
        return acc + (['Lewis Hamilton','Valtteri Bottas'].includes(p.piloto) ? p.puntos : 0);
    }, 0);
    console.log(`${escuderia1.nombre}: ${puntosFerrari} puntos`);
    console.log(`${escuderia2.nombre}: ${puntosMercedes} puntos`);
    // -----------------------------------

    // --------- MANTENGO TU LOG ---------
    console.log('\nEstadísticas de pilotos:');
    [piloto1, piloto2, piloto3, piloto4, ...invitados.map(x => x.piloto)].forEach(piloto => {
        const stats = piloto.obtenerEstadisticas?.() || {};
        // completar valores para que no salgan undefined
        if (stats.puntosCampeonato == null) {
            stats.puntosCampeonato = puntosPorPiloto.get(piloto.nombre) || 0;
        }
        if (stats.vueltasRapidas == null) {
            stats.vueltasRapidas = 0; // si no lo llevás por clase Piloto, dejamos 0
        }
        if (stats.podios == null) {
            // si está en el top 3 del final, lo contamos como podio
            const esPodio = (final.podio || []).some(x => x.piloto === piloto.nombre);
            stats.podios = esPodio ? 1 : 0;
        }
        console.log(`${piloto.nombre}:`);
        console.log(`- Puntos en el campeonato: ${stats.puntosCampeonato}`);
        console.log(`- Vueltas rápidas: ${stats.vueltasRapidas}`);
        console.log(`- Podios: ${stats.podios}`);
    });
    // -----------------------------------

} catch (error) {
    console.error('Error durante la ejecución:', error.message);
}
