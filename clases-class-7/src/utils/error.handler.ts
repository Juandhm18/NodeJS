  import { type Response } from 'express'
  import { type HttpErrorStatus } from '../types/types.ts'

  /**
   * Maneja los errores y responde con un formato estándar.
   *
   * @param res Express response
   * @param error Mensaje de error
   * @param code Código HTTP (por defecto 500)
   * @param details Información adicional opcional (debug, validaciones, etc.)
   */

  const handleHttp = (
    res: Response,
    error: string,
    code: HttpErrorStatus = 500,
    details?: unknown
  ) => {
    res.status(code).json({
      ok: false,
      error,
      ...(details ? { details } : {}), 
    })
    res.send({ error })
  }

  export { handleHttp }