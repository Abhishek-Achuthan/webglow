import { env, PORT } from './config/env'
import { connectDatabase } from './config/database'
import { createApp } from './app'

async function main(): Promise<void> {
  await connectDatabase()

  const app = createApp()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${env.NODE_ENV ?? 'development'} mode`)
  })
}

main().catch((err) => {
  console.error('Error during startup:', err)
  process.exit(1)
})
