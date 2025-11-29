import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'
 
 // Test suite for the Button component 
describe('Button', () => {
  // Test that the button renders with children text
  it('renders with children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  // Test that the button calls onClick when clicked
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Test that the button is disabled when the disabled prop is true
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled button</Button>)
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
  })

  // Test that the button shows a loading spinner when the isLoading prop is true
  it('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>)
    const button = screen.getByRole('button', { name: /loading/i })
    // Button should still be in document but disabled as it is loading
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  // Test that the button applies variant styles correctly when the variant prop is changed
  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    let button = screen.getByRole('button', { name: /primary/i })
    expect(button).toHaveClass('bg-brand-500')

    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button', { name: /ghost/i })
    expect(button).toHaveClass('text-slate-200')
  })

})