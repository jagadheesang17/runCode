import { setupCourseCreation } from './utils/cookieSetup'

async function globalSetup() {
    await setupCourseCreation()
}

export default globalSetup
