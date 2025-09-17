import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Readable, Writable, Transform, pipeline } from 'stream'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ===================================
// DEMO 1: DIFERENCIA BÁSICA - MEMORIA
// ===================================

console.log('🎯 DEMOS BÁSICOS DE STREAMS\n')

async function demo1_MemoryDifference() {
    console.log('📊 DEMO 1: DIFERENCIA DE MEMORIA')
    console.log('=' .repeat(50))
    
    const largeData = 'x'.repeat(100 * 1024 * 1024) // 100MB de datos
    
    console.log('Creando 100MB de datos en memoria...')
    console.log('Memoria antes:', formatMemory(process.memoryUsage().heapUsed))
    
    // Método tradicional: todo en memoria
    console.log('\n🔴 MÉTODO TRADICIONAL (sin streams):')
    const start1 = process.memoryUsage().heapUsed
    
    // Simular procesamiento de todo el string
    const processed = largeData.split('').map(char => char.toUpperCase()).join('')
    console.log('Memoria después de procesar:', formatMemory(process.memoryUsage().heapUsed))
    console.log('Incremento memoria:', formatMemory(process.memoryUsage().heapUsed - start1))
    
    // Limpiar para la siguiente demo
    // Simular liberación de memoria (en realidad el GC lo hará cuando pueda)
    
    console.log('\n🟢 MÉTODO CON STREAMS:')
    const start2 = process.memoryUsage().heapUsed
    
    // Crear un stream que procesa en chunks
    let processedLength = 0
    const chunkSize = 1024 // 1KB chunks
    
    for (let i = 0; i < largeData.length; i += chunkSize) {
        const chunk = largeData.slice(i, i + chunkSize)
        const processedChunk = chunk.toUpperCase()
        processedLength += processedChunk.length
    }
    
    console.log('Memoria después de procesar con chunks:', formatMemory(process.memoryUsage().heapUsed))
    console.log('Incremento memoria:', formatMemory(process.memoryUsage().heapUsed - start2))
    console.log(`✅ Procesados: ${processedLength} caracteres`)
}

// ===================================
// DEMO 2: READABLE STREAMS PERSONALIZADOS
// ===================================

class NumberStream extends Readable {
    constructor(max, options = {}) {
        super({ objectMode: true, ...options })
        this.current = 1
        this.max = max
    }
    
    _read() {
        if (this.current <= this.max) {
            const data = {
                number: this.current,
                square: this.current ** 2,
                timestamp: Date.now()
            }
            this.push(JSON.stringify(data) + '\n')
            this.current++
        } else {
            this.push(null) // Fin del stream
        }
    }
}

async function demo2_CustomReadableStream() {
    console.log('\n📥 DEMO 2: READABLE STREAM PERSONALIZADO')
    console.log('=' .repeat(50))
    
    console.log('Creando stream de números del 1 al 10...')
    
    const numberStream = new NumberStream(10)
    let count = 0
    
    numberStream.on('data', (chunk) => {
        count++
        console.log(`📊 Dato ${count}:`, JSON.parse(chunk.toString().trim()))
    })
    
    numberStream.on('end', () => {
        console.log('✅ Stream terminado')
    })
    
    // Esperar a que termine
    await new Promise(resolve => numberStream.on('end', resolve))
}

// ===================================
// DEMO 3: TRANSFORM STREAMS
// ===================================

class MultiplyTransform extends Transform {
    constructor(multiplier, options = {}) {
        super({ objectMode: true, ...options })
        this.multiplier = multiplier
    }
    
    _transform(chunk, encoding, callback) {
        try {
            const data = JSON.parse(chunk.toString().trim())
            data.number = data.number * this.multiplier
            data.square = data.square * (this.multiplier ** 2)
            data.multipliedBy = this.multiplier
            
            this.push(JSON.stringify(data) + '\n')
            callback()
        } catch (error) {
            callback(error)
        }
    }
}

class FilterTransform extends Transform {
    constructor(predicate, options = {}) {
        super({ objectMode: true, ...options })
        this.predicate = predicate
        this.filtered = 0
        this.passed = 0
    }
    
    _transform(chunk, encoding, callback) {
        try {
            const data = JSON.parse(chunk.toString().trim())
            
            if (this.predicate(data)) {
                this.passed++
                this.push(chunk)
            } else {
                this.filtered++
            }
            
            callback()
        } catch (error) {
            callback(error)
        }
    }
    
    _flush(callback) {
        console.log(`🔍 Filtro: ${this.passed} pasaron, ${this.filtered} filtrados`)
        callback()
    }
}

async function demo3_TransformStreams() {
    console.log('\n🔄 DEMO 3: TRANSFORM STREAMS')
    console.log('=' .repeat(50))
    
    console.log('Pipeline: Números → Multiplicar x3 → Filtrar pares → Salida')
    
    const pipelineAsync = promisify(pipeline)
    
    await pipelineAsync(
        new NumberStream(20),
        new MultiplyTransform(3),
        new FilterTransform(data => data.number % 2 === 0), // Solo números pares
        new Writable({
            objectMode: true,
            write(chunk, encoding, callback) {
                const data = JSON.parse(chunk.toString().trim())
                console.log(`✨ Resultado: ${data.number} (original: ${data.number / data.multipliedBy})`)
                callback()
            }
        })
    )
    
    console.log('✅ Pipeline completado')
}

// ===================================
// DEMO 4: BACKPRESSURE Y CONTROL DE FLUJO
// ===================================

class SlowProcessor extends Transform {
    constructor(delay = 100) {
        super({ objectMode: true })
        this.delay = delay
        this.processed = 0
    }
    
    async _transform(chunk, encoding, callback) {
        this.processed++
        console.log(`⚡ Procesando item ${this.processed}...`)
        
        // Simular procesamiento lento
        await new Promise(resolve => setTimeout(resolve, this.delay))
        
        const data = JSON.parse(chunk.toString())
        data.processedAt = new Date().toISOString()
        data.processedBy = 'SlowProcessor'
        
        this.push(JSON.stringify(data) + '\n')
        callback()
    }
}

class FastProducer extends Readable {
    constructor(count) {
        super({ objectMode: true })
        this.count = count
        this.current = 1
    }
    
    _read() {
        if (this.current <= this.count) {
            console.log(`🚀 Produciendo item ${this.current}`)
            const data = {
                id: this.current,
                data: `item-${this.current}`,
                createdAt: new Date().toISOString()
            }
            this.push(JSON.stringify(data) + '\n')
            this.current++
        } else {
            this.push(null)
        }
    }
}

async function demo4_Backpressure() {
    console.log('\n🚰 DEMO 4: BACKPRESSURE (Control de Flujo)')
    console.log('=' .repeat(50))
    console.log('Productor rápido → Procesador lento (automático backpressure)')
    
    const startTime = Date.now()
    const pipelineAsync = promisify(pipeline)
    
    await pipelineAsync(
        new FastProducer(5), // Produce 5 items rápidamente
        new SlowProcessor(500), // Procesa cada uno en 500ms
        new Writable({
            objectMode: true,
            write(chunk, encoding, callback) {
                const data = JSON.parse(chunk.toString().trim())
                console.log(`📦 Completado:`, data.id, 'en', Date.now() - startTime, 'ms')
                callback()
            }
        })
    )
    
    console.log(`✅ Demo backpressure completada en ${Date.now() - startTime}ms`)
    console.log('💡 Nota: El productor se pausó automáticamente cuando el procesador estaba ocupado')
}

// ===================================
// DEMO 5: MANEJO DE ERRORES
// ===================================

class ErrorProneTransform extends Transform {
    constructor() {
        super({ objectMode: true })
        this.processed = 0
    }
    
    _transform(chunk, encoding, callback) {
        this.processed++
        
        // Simular error en el 3er elemento
        if (this.processed === 3) {
            callback(new Error('💥 Error simulado en elemento 3'))
            return
        }
        
        const data = JSON.parse(chunk.toString())
        data.processed = true
        data.processedCount = this.processed
        
        this.push(JSON.stringify(data) + '\n')
        callback()
    }
}

async function demo5_ErrorHandling() {
    console.log('\n❌ DEMO 5: MANEJO DE ERRORES')
    console.log('=' .repeat(50))
    
    const pipelineAsync = promisify(pipeline)
    
    try {
        await pipelineAsync(
            new NumberStream(5),
            new ErrorProneTransform(),
            new Writable({
                objectMode: true,
                write(chunk, encoding, callback) {
                    const data = JSON.parse(chunk.toString().trim())
                    console.log('✅ Procesado exitosamente:', data.number)
                    callback()
                }
            })
        )
    } catch (error) {
        console.log('🚨 Error capturado:', error.message)
        console.log('💡 El pipeline se detuvo automáticamente cuando ocurrió el error')
    }
}

// ===================================
// FUNCIONES UTILITARIAS
// ===================================

function formatMemory(bytes) {
    return `${Math.round(bytes / 1024 / 1024 * 100) / 100} MB`
}

// ===================================
// DEMO 6: COMPARACIÓN PRÁCTICA CON ARCHIVO REAL
// ===================================

async function demo6_RealFileComparison() {
    console.log('\n📂 DEMO 6: COMPARACIÓN CON ARCHIVO REAL')
    console.log('=' .repeat(50))
    
    const USERS_FILE = path.join(__dirname, '../src/users-large.jsonl')
    
    if (!fs.existsSync(USERS_FILE)) {
        console.log('⚠️  Archivo de usuarios no encontrado')
        console.log('💡 Ejecuta: npm run generate')
        return
    }
    
    const fileStats = fs.statSync(USERS_FILE)
    console.log(`📁 Archivo: ${formatMemory(fileStats.size)}`)
    
    // Método 1: Cargar todo
    console.log('\n🔴 Cargando archivo completo:')
    const memBefore1 = process.memoryUsage().heapUsed
    const startTime1 = Date.now()
    
    try {
        const content = fs.readFileSync(USERS_FILE, 'utf8')
        const lines = content.split('\n').filter(line => line.trim())
        const users = lines.map(line => JSON.parse(line))
        const activeUsers = users.filter(user => user.isActive)
        
        const memAfter1 = process.memoryUsage().heapUsed
        const time1 = Date.now() - startTime1
        
        console.log(`⏱️  Tiempo: ${time1}ms`)
        console.log(`📊 Memoria usada: ${formatMemory(memAfter1 - memBefore1)}`)
        console.log(`👥 Usuarios activos: ${activeUsers.length}/${users.length}`)
        
    } catch (error) {
        console.log('❌ Error:', error.message)
    }
    
    // Forzar garbage collection si está disponible
    if (global.gc) {
        global.gc()
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Método 2: Con streams
    console.log('\n🟢 Con streams:')
    const memBefore2 = process.memoryUsage().heapUsed
    const startTime2 = Date.now()
    
    let totalUsers = 0
    let activeUsers = 0
    let buffer = ''
    
    const readStream = fs.createReadStream(USERS_FILE, { encoding: 'utf8' })
    
    await new Promise((resolve, reject) => {
        readStream.on('data', (chunk) => {
            buffer += chunk
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
            
            lines.forEach(line => {
                if (line.trim()) {
                    totalUsers++
                    const user = JSON.parse(line)
                    if (user.isActive) activeUsers++
                }
            })
        })
        
        readStream.on('end', () => {
            if (buffer.trim()) {
                totalUsers++
                const user = JSON.parse(buffer)
                if (user.isActive) activeUsers++
            }
            resolve()
        })
        
        readStream.on('error', reject)
    })
    
    const memAfter2 = process.memoryUsage().heapUsed
    const time2 = Date.now() - startTime2
    
    console.log(`⏱️  Tiempo: ${time2}ms`)
    console.log(`📊 Memoria usada: ${formatMemory(memAfter2 - memBefore2)}`)
    console.log(`👥 Usuarios activos: ${activeUsers}/${totalUsers}`)
    
    console.log('\n📈 COMPARACIÓN:')
    console.log(`Diferencia tiempo: ${time1 - time2}ms (${time1 > time2 ? 'streams más rápido' : 'sin streams más rápido'})`)
    console.log(`Diferencia memoria: ${formatMemory(Math.abs((memAfter1 - memBefore1) - (memAfter2 - memBefore2)))}`)
}

// ===================================
// EJECUTAR TODOS LOS DEMOS
// ===================================

async function runAllDemos() {
    try {
        await demo1_MemoryDifference()
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        await demo2_CustomReadableStream()
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        await demo3_TransformStreams()
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        await demo4_Backpressure()
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        await demo5_ErrorHandling()
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        await demo6_RealFileComparison()
        
        console.log('\n🎉 TODOS LOS DEMOS COMPLETADOS!')
        console.log('\n💡 CONCEPTOS CLAVE DEMOSTRADOS:')
        console.log('✅ Streams usan menos memoria')
        console.log('✅ Backpressure automático')
        console.log('✅ Manejo de errores en pipelines')
        console.log('✅ Transform streams personalizados')
        console.log('✅ Control de flujo eficiente')
        
    } catch (error) {
        console.error('❌ Error en demos:', error)
    }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllDemos()
}