import { arch, availableParallelism, cpus, freemem, loadavg, platform, release, totalmem, uptime, version } from 'node:os'

export interface SystemStatusCpu {

  /** The model of the CPU (e.g., `Intel(R) Core(TM) i7-9700K CPU @ 3.60GHz`). */
  model: string

  /** The frequency of the CPU in MHz. */
  speed: number

  /** The CPU usage percentage. */
  usage: number
}

export interface SystemStatus {

  /** The uptime of the system in seconds. */
  uptime: number

  /** The architecture of the CPU (e.g., `x64`, `arm64`). */
  arch: string

  /** The family of the CPU architecture (e.g., `x86`, `arm`). */
  family: string

  /** The platform the system is running on (e.g., `linux`, `win32`, `darwin`). */
  platform: string

  /** The version of the kernel. */
  version: string

  /** The release version of the operating system. */
  release: string

  /** The amount of free memory in bytes. */
  memoryFree: number

  /** The amount of used memory in bytes. */
  memoryUsed?: number

  /** The total amount of memory in bytes. */
  memoryTotal: number

  /** The amount of available memory in bytes (total memory - free memory). */
  availmem: number

  /** The number of available parallelism threads. */
  availableParallelism: number

  /** The load average over the last 1, 5, and 15 minutes. */
  cpuAverageLoad: [number, number, number]

  /** The average CPU speed in MHz. */
  cpuAverageSpeed?: number

  /** A list of CPU information. */
  cpus: SystemStatusCpu[]
}

// Map CPU architecture to family
function getArchFamily(architecture = arch()): string {
  if (architecture === 'x64' || architecture === 'ia32') return 'x86'
  if (architecture === 'arm' || architecture === 'arm64') return 'arm'
  if (architecture === 'mips' || architecture === 'mipsel') return 'mips'
  if (architecture === 'ppc' || architecture === 'ppc64') return 'powerpc'
  if (architecture === 's390' || architecture === 's390x') return 's390'
  return architecture
}

/**
 * Get comprehensive system status information including CPU, memory, platform details, and performance metrics.
 *
 * @returns SystemStatus object containing all system information
 * @example
 * const status = getSystemStatus()
 * console.log(`Platform: ${status.platform} ${status.arch}`)
 * console.log(`Memory: ${Math.round(status.freemem / 1024 / 1024)} MB free of ${Math.round(status.totalmem / 1024 / 1024)} MB total`)
 * console.log(`CPU cores: ${status.cpus.length}`)
 */
export function getSystemStatus(): SystemStatus {
  const systemUptime = uptime()
  const systemTotalmem = totalmem()
  const systemFreemem = freemem()

  // --- Process CPU information.
  const cpuInfos: SystemStatusCpu[] = cpus().map(cpu => ({
    model: cpu.model,
    speed: cpu.speed, // CPU speed is already in MHz in Node.js
    usage: Math.round(
      (cpu.times.user + cpu.times.nice + cpu.times.sys)
      / (cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle)
      * 100,
    ),
  }))

  return {
    uptime: Math.floor(systemUptime),
    arch: arch(),
    family: getArchFamily(),
    platform: platform(),
    version: version(),
    release: release(),
    memoryFree: systemFreemem,
    memoryTotal: systemTotalmem,
    memoryUsed: systemTotalmem - systemFreemem,
    availmem: systemFreemem,
    availableParallelism: availableParallelism(),
    cpuAverageLoad: loadavg() as [number, number, number],
    cpuAverageSpeed: Math.round(cpuInfos.reduce((sum, cpu) => sum + cpu.speed, 0) / cpuInfos.length),
    cpus: cpuInfos,
  }
}
