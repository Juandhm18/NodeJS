import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Transform, pipeline } from 'stream'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '../src/users-large.jsonl')

// Utilidades para medir rendimiento
function getMemoryUsage() {
    const mem = process.memoryUsage()
    return {
        rss: Math.round(mem.rss / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024 * 100) / 100,
        external: Math.round(mem.external / 1024 / 1024 * 100) / 100
    }
}

function measureTime(label) {
    return {
        start: () => console.time(label),
        end: () => console.timeEnd(label)
    }
}

// ===================================
// EJERCICIO 1: COMPARACIÓN SIN STREAMS vs CON STREAMS
// ===================================

console.log('🚀 EJERCICIOS DE STREAMS - RENDIMIENTO Y MEMORIA\n')

// MÉTODO 1: SIN STREAMS - Carga todo en memoria
async function loadAllUsersInMemory() {
    console.log('📁 MÉTODO 1: SIN STREAMS (cargando todo en memoria)')
    console.log('Memoria inicial:', getMemoryUsage())
    
    const timer = measureTime('⏱️  Tiempo carga completa')
    timer.start()
    
    try {
        // Cargar archivo completo en memoria
        const fileContent = fs.readFileSync(USERS_FILE, 'utf8')
        console.log('Memoria después de leer archivo:', getMemoryUsage())
        
        // Procesar todas las líneas
        const lines = fileContent.split('\n').filter(line => line.trim())
        console.log('Memoria después de split:', getMemoryUsage())
        
        // Parsear todos los usuarios
        const users = lines.map(line => JSON.parse(line))
        console.log('Memoria después de parsear JSON:', getMemoryUsage())
        
        // Filtrar usuarios activos
        const activeUsers = users.filter(user => user.isActive)
        console.log('Memoria después de filtrar:', getMemoryUsage())
        
        timer.end()
        console.log(`✅ Procesados: ${users.length} usuarios, Activos: ${activeUsers.length}`)
        console.log('Memoria final:', getMemoryUsage())
        
        return { total: users.length, active: activeUsers.length }
    } catch (error) {
        console.error('❌ Error:', error.message)
        return null
    }
}

// MÉTODO 2: CON STREAMS - Procesamiento incremental
async function processUsersWithStreams() {
    console.log('\n📊 MÉTODO 2: CON STREAMS (procesamiento incremental)')
    console.log('Memoria inicial:', getMemoryUsage())
    
    const timer = measureTime('⏱️  Tiempo con streams')
    timer.start()
    
    return new Promise((resolve, reject) => {
        let totalUsers = 0
        let activeUsers = 0
        let buffer = ''
        
        const readStream = fs.createReadStream(USERS_FILE, { 
            encoding: 'utf8',
            highWaterMark: 16 * 1024 // 16KB chunks
        })
        
        readStream.on('data', (chunk) => {
            buffer += chunk
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // Guardar línea incompleta
            
            lines.forEach(line => {
                if (line.trim()) {
                    totalUsers++
                    const user = JSON.parse(line)
                    if (user.isActive) activeUsers++
                }
            })
            
            // Mostrar memoria cada 1000 usuarios
            if (totalUsers % 1000 === 0) {
                console.log(`Procesados: ${totalUsers}, Memoria:`, getMemoryUsage())
            }
        })
        
        readStream.on('end', () => {
            // Procesar última línea si existe
            if (buffer.trim()) {
                totalUsers++
                const user = JSON.parse(buffer)
                if (user.isActive) activeUsers++
            }
            
            timer.end()
            console.log(`✅ Procesados: ${totalUsers} usuarios, Activos: ${activeUsers}`)
            console.log('Memoria final:', getMemoryUsage())
            
            resolve({ total: totalUsers, active: activeUsers })
        })
        
        readStream.on('error', reject)
    })
}

// ===================================
// EJERCICIO 2: TRANSFORM STREAMS PERSONALIZADOS
// Crear filtros y transformaciones eficientes
// ===================================

class UserFilterStream extends Transform {
    constructor(filterFn, options = {}) {
        super({ objectMode: true, ...options })
        this.filterFn = filterFn
        this.processedCount = 0
        this.passedCount = 0
        this.buffer = '' // Buffer para manejar líneas incompletas
    }
    
    _transform(chunk, encoding, callback) {
        // Acumular en buffer
        this.buffer += chunk.toString()
        const lines = this.buffer.split('\n')
        
        // Guardar la última línea (puede estar incompleta)
        this.buffer = lines.pop() || ''
        
        const results = []
        
        lines.forEach(line => {
            if (line.trim()) {
                try {
                    const user = JSON.parse(line)
                    this.processedCount++
                    
                    if (this.filterFn(user)) {
                        this.passedCount++
                        results.push(JSON.stringify(user))
                    }
                } catch (error) {
                    console.warn('⚠️  Error parseando línea:', line.substring(0, 50) + '...')
                }
            }
        })
        
        if (results.length > 0) {
            this.push(results.join('\n') + '\n')
        }
        
        callback()
    }
    
    _flush(callback) {
        // Procesar la última línea del buffer si existe
        if (this.buffer && this.buffer.trim()) {
            try {
                const user = JSON.parse(this.buffer)
                this.processedCount++
                
                if (this.filterFn(user)) {
                    this.passedCount++
                    this.push(JSON.stringify(user) + '\n')
                }
            } catch (error) {
                console.warn('⚠️  Error en última línea:', error.message)
            }
        }
        
        console.log(`📊 Filtro completado: ${this.passedCount}/${this.processedCount} usuarios pasaron`)
        callback()
    }
}

class UserStatsStream extends Transform {
    constructor(options = {}) {
        super({ objectMode: true, ...options })
        this.stats = {
            total: 0,
            byRole: {},
            byStatus: { active: 0, inactive: 0 },
            avgAge: 0,
            totalAge: 0
        }
        this.batchSize = options.batchSize || 500
        this.lastReport = Date.now()
    }
    
    _transform(chunk, encoding, callback) {
        // Acumular datos en buffer para manejar líneas incompletas
        this.buffer = (this.buffer || '') + chunk.toString()
        const lines = this.buffer.split('\n')
        
        // Guardar la última línea (puede estar incompleta)
        this.buffer = lines.pop() || ''
        
        lines.forEach(line => {
            if (line.trim()) {
                try {
                    const user = JSON.parse(line)
                    this.updateStats(user)
                    
                    // Reportar progreso cada batch
                    if (this.stats.total % this.batchSize === 0) {
                        this.reportProgress()
                    }
                } catch (error) {
                    console.warn('⚠️  Error en stats:', error.message.substring(0, 50))
                }
            }
        })
        
        callback()
    }
    
    _flush(callback) {
        // Procesar la última línea del buffer si existe
        if (this.buffer && this.buffer.trim()) {
            try {
                const user = JSON.parse(this.buffer)
                this.updateStats(user)
            } catch (error) {
                console.warn('⚠️  Error en última línea:', error.message.substring(0, 50))
            }
        }
        
        console.log('\n📊 ESTADÍSTICAS FINALES:')
        console.log('Total usuarios:', this.stats.total)
        console.log('Por estado:', this.stats.byStatus)
        console.log('Por rol:', this.stats.byRole)
        console.log('Edad promedio:', this.stats.avgAge, 'años')
        callback()
    }
    
    updateStats(user) {
        this.stats.total++
        this.stats.byRole[user.role] = (this.stats.byRole[user.role] || 0) + 1
        this.stats.byStatus[user.isActive ? 'active' : 'inactive']++
        
        // Simular cálculo de edad basado en ID (para ejemplo)
        const age = 18 + (user.id % 50)
        this.stats.totalAge += age
        this.stats.avgAge = Math.round(this.stats.totalAge / this.stats.total * 100) / 100
    }
    
    reportProgress() {
        const now = Date.now()
        const speed = this.batchSize / ((now - this.lastReport) / 1000)
        console.log(`📈 Procesados: ${this.stats.total}, Velocidad: ${Math.round(speed)} u/s, Memoria:`, getMemoryUsage())
        this.lastReport = now
    }
    
    _flush(callback) {
        console.log('\n📊 ESTADÍSTICAS FINALES:')
        console.log('Total usuarios:', this.stats.total)
        console.log('Por estado:', this.stats.byStatus)
        console.log('Por rol:', this.stats.byRole)
        console.log('Edad promedio:', this.stats.avgAge, 'años')
        callback()
    }
}

// ===================================
// EJERCICIO 3: PIPELINE DE TRANSFORMACIONES
// Combinar múltiples streams eficientemente
// ===================================

async function createProcessingPipeline() {
    console.log('\n🔄 EJERCICIO 3: PIPELINE DE TRANSFORMACIONES')
    console.log('Memoria inicial:', getMemoryUsage())
    
    const timer = measureTime('⏱️  Pipeline completo')
    timer.start()
    
    const outputFile = path.join(__dirname, '../output/processed-users.jsonl')
    
    // Crear directorio de output si no existe
    const outputDir = path.dirname(outputFile)
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
    }
    
    const pipelineAsync = promisify(pipeline)
    
    try {
        await pipelineAsync(
            fs.createReadStream(USERS_FILE, { encoding: 'utf8' }),
            
            // Filtro 1: Solo usuarios activos
            new UserFilterStream(user => user.isActive),
            
            // Transform: Agregar campo computado
            new Transform({
                objectMode: true,
                transform(chunk, encoding, callback) {
                    const lines = chunk.toString().split('\n')
                    const enhanced = []
                    
                    lines.forEach(line => {
                        if (line.trim()) {
                            const user = JSON.parse(line)
                            // Agregar campos computados
                            user.isVip = user.role === 'admin' || user.id % 100 === 0
                            user.category = user.id < 5000 ? 'early' : 'regular'
                            enhanced.push(JSON.stringify(user))
                        }
                    })
                    
                    if (enhanced.length > 0) {
                        this.push(enhanced.join('\n') + '\n')
                    }
                    callback()
                }
            }),
            
            // Filtro 2: Solo VIPs
            new UserFilterStream(user => user.isVip),
            
            // Output
            fs.createWriteStream(outputFile)
        )
        
        timer.end()
        console.log(`✅ Pipeline completado. Resultado en: ${outputFile}`)
        console.log('Memoria final:', getMemoryUsage())
        
        // Mostrar estadísticas del archivo resultado
        const stats = fs.statSync(outputFile)
        console.log(`📁 Archivo resultado: ${Math.round(stats.size / 1024)} KB`)
        
    } catch (error) {
        console.error('❌ Error en pipeline:', error)
    }
}

// ===================================
// EJERCICIO 4: STREAM DE BÚSQUEDA EN TIEMPO REAL
// Búsqueda eficiente sin cargar todo en memoria
// ===================================

async function searchUsersStream(searchTerm) {
    console.log(`\n🔍 EJERCICIO 4: BÚSQUEDA STREAMING - "${searchTerm}"`)
    console.log('Memoria inicial:', getMemoryUsage())
    
    const timer = measureTime('⏱️  Búsqueda streaming')
    timer.start()
    
    return new Promise((resolve, reject) => {
        let buffer = ''
        let totalChecked = 0
        let matches = []
        const maxResults = 10 // Limitar resultados para demo
        
        const readStream = fs.createReadStream(USERS_FILE, { 
            encoding: 'utf8',
            highWaterMark: 8 * 1024 // Chunks más pequeños para búsqueda
        })
        
        readStream.on('data', (chunk) => {
            buffer += chunk
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
            
            for (const line of lines) {
                if (line.trim()) {
                    totalChecked++
                    
                    try {
                        const user = JSON.parse(line)
                        const searchText = `${user.name} ${user.email} ${user.role}`.toLowerCase()
                        
                        if (searchText.includes(searchTerm.toLowerCase())) {
                            matches.push({
                                ...user,
                                matchIn: this.getMatchFields(user, searchTerm)
                            })
                            
                            console.log(`🎯 Match ${matches.length}: ${user.name} (${user.role})`)
                            
                            // Parar si encontramos suficientes resultados
                            if (matches.length >= maxResults) {
                                readStream.destroy() // Terminar stream temprano
                                break
                            }
                        }
                    } catch (error) {
                        // Ignorar errores de parsing en búsqueda
                    }
                }
                
                // Mostrar progreso cada 1000 checks
                if (totalChecked % 1000 === 0) {
                    console.log(`🔍 Revisados: ${totalChecked}, Encontrados: ${matches.length}`)
                }
            }
        })
        
        readStream.on('end', () => {
            timer.end()
            console.log(`✅ Búsqueda completada: ${matches.length} resultados de ${totalChecked} usuarios`)
            console.log('Memoria final:', getMemoryUsage())
            resolve(matches)
        })
        
        readStream.on('error', reject)
    })
}

// ===================================
// EJERCICIO 5: COMPARACIÓN DE VELOCIDAD
// Medir y comparar diferentes enfoques
// ===================================

async function speedComparison() {
    console.log('\n⚡ EJERCICIO 5: COMPARACIÓN DE VELOCIDAD\n')
    
    // Limpiar memoria antes de cada test
    if (global.gc) {
        global.gc()
    }
    
    console.log('='.repeat(60))
    console.log('1️⃣  MÉTODO SIN STREAMS')
    console.log('='.repeat(60))
    const result1 = await loadAllUsersInMemory()
    
    // Pausa para que se vea la diferencia
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (global.gc) {
        global.gc()
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('2️⃣  MÉTODO CON STREAMS')
    console.log('='.repeat(60))
    const result2 = await processUsersWithStreams()
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMEN COMPARATIVO')
    console.log('='.repeat(60))
    console.log('Ambos métodos procesaron la misma cantidad de usuarios')
    console.log('Diferencia principal: USO DE MEMORIA')
    console.log('- Sin streams: Carga todo el archivo en memoria')
    console.log('- Con streams: Procesa en chunks pequeños')
    console.log('- Beneficio: Archivos grandes no saturan la RAM')
}

// ===================================
// FUNCIONES DE UTILIDAD
// ===================================

function getMatchFields(user, searchTerm) {
    const term = searchTerm.toLowerCase()
    const fields = []
    
    if (user.name.toLowerCase().includes(term)) fields.push('name')
    if (user.email.toLowerCase().includes(term)) fields.push('email')
    if (user.role.toLowerCase().includes(term)) fields.push('role')
    
    return fields
}

// ===================================
// EJECUTAR EJERCICIOS
// ===================================

async function runAllExercises() {
    try {
        // Verificar que el archivo existe
        if (!fs.existsSync(USERS_FILE)) {
            console.error(`❌ Archivo no encontrado: ${USERS_FILE}`)
            console.log('💡 Ejecuta primero el generador de usuarios')
            return
        }
        
        const fileStats = fs.statSync(USERS_FILE)
        console.log(`📁 Archivo: ${USERS_FILE}`)
        console.log(`📏 Tamaño: ${Math.round(fileStats.size / 1024 / 1024 * 100) / 100} MB`)
        console.log(`📅 Creado: ${fileStats.birthtime.toLocaleString()}\n`)
        
        // Ejecutar ejercicios en secuencia
        await speedComparison()
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        await createProcessingPipeline()
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        await searchUsersStream('admin')
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Ejercicio con estadísticas en tiempo real
        console.log('\n📈 EJERCICIO EXTRA: ESTADÍSTICAS EN TIEMPO REAL')
        console.log('='.repeat(60))
        const timer = measureTime('⏱️  Generación de estadísticas')
        timer.start()
        
        const statsStream = new UserStatsStream({ batchSize: 1000 })
        const readStream = fs.createReadStream(USERS_FILE, { encoding: 'utf8' })
        
        const pipelineAsync = promisify(pipeline)
        await pipelineAsync(readStream, statsStream, fs.createWriteStream('/dev/null'))
        
        timer.end()
        console.log('Memoria final:', getMemoryUsage())
        
        console.log('\n🎉 TODOS LOS EJERCICIOS COMPLETADOS')
        console.log('\n💡 PUNTOS CLAVE APRENDIDOS:')
        console.log('✅ Streams procesan datos incrementalmente')
        console.log('✅ Uso de memoria constante vs creciente')
        console.log('✅ Mejor para archivos grandes')
        console.log('✅ Permite pipelines de transformación eficientes')
        console.log('✅ Búsquedas que pueden parar temprano')
        
    } catch (error) {
        console.error('❌ Error ejecutando ejercicios:', error)
    }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExercises()
}