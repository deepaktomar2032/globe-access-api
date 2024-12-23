const REQUIRED_ENV_KEYS: Set<string> = new Set()

const addEnvRequirements: (...envs: string[]) => void = (...envs: string[]): void => {
  envs.forEach((envKey: string) => REQUIRED_ENV_KEYS.add(envKey))
}

const requireEnvAnnotation: (...envs: string[]) => ClassDecorator = (...envs: string[]): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any): any => {
    addEnvRequirements(...envs)

    return target
  }
}

const checkRequiredEnvs: () => boolean = (): boolean => {
  console.info(`Required environment variables: ${[...REQUIRED_ENV_KEYS].join(', ')}`)

  const missingEnvs: string[] = [...REQUIRED_ENV_KEYS].filter(
    // eslint-disable-next-line no-prototype-builtins
    (requiredEnv: string): boolean => !process.env.hasOwnProperty(requiredEnv) || process.env[requiredEnv] === ''
  )

  if (missingEnvs.length > 0) {
    const errMessage: string = `The following environment variables are missing: ${missingEnvs.join(', ')}`
    console.error(errMessage)

    return true
  }
}

export { REQUIRED_ENV_KEYS, requireEnvAnnotation as RequireEnv, checkRequiredEnvs, addEnvRequirements }
