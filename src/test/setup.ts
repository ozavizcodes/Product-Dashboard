import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test performed; this is a good practice to avoid memory leaks. 
// Vitest will automatically clean up the DOM after each test. 
afterEach(() => {
  cleanup()
})

