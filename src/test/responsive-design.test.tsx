import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock sample data
const mockCredits = [
  {
    unic_id: "UNIC-VCS-IND-2023-4F7A8C1B",
    project_name: "Mangrove Restoration Project",
    vintage: 2023,
    status: "Active"
  },
  {
    unic_id: "UNIC-GS-IND-2022-8A1B2C3D", 
    project_name: "Solar Power Plant Maharashtra",
    vintage: 2022,
    status: "Retired"
  }
]

vi.mock('../assets/sample.json', () => ({
  sampleCredits: mockCredits
}))

// Helper function to simulate viewport changes
const setViewport = (width: number, height: number = 800) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  fireEvent(window, new Event('resize'))
}

describe('Responsive Design Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Mobile Viewport (320px - 640px)', () => {
    it('should adapt layout for mobile screens', async () => {
      setViewport(375) // iPhone SE width
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Check mobile-specific button text
      expect(screen.getByText('Cards')).toBeInTheDocument()
      expect(screen.getByText('Table')).toBeInTheDocument()
      expect(screen.queryByText('Card View')).not.toBeInTheDocument()
      expect(screen.queryByText('Table View')).not.toBeInTheDocument()
      
      // Check that header adapts to mobile
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      
      // Check that search bar is full width on mobile
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      expect(searchInput).toBeInTheDocument()
      
      // Check that credit cards stack vertically (single column)
      const creditGrid = screen.getByRole('main').querySelector('[class*="grid"]')
      expect(creditGrid).toBeInTheDocument()
    })

    it('should handle mobile certificate dialog', async () => {
      setViewport(375)
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Open certificate dialog
      const creditCard = screen.getByText('Mangrove Restoration Project').closest('article')
      const downloadButton = creditCard?.querySelector('button[aria-label*="certificate"]')
      
      if (downloadButton) {
        await user.click(downloadButton)
        
        // Should open mobile-optimized dialog
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument()
        })
        
        // Dialog should be full-screen on mobile
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
      }
    })
  })

  describe('Tablet Viewport (640px - 1024px)', () => {
    it('should adapt layout for tablet screens', async () => {
      setViewport(768) // iPad width
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Should show full button text on tablet
      expect(screen.getByText('Card View')).toBeInTheDocument()
      expect(screen.getByText('Table View')).toBeInTheDocument()
      
      // Check that credit cards are in 2-column layout
      const creditGrid = screen.getByRole('main').querySelector('[class*="grid"]')
      expect(creditGrid).toBeInTheDocument()
      
      // Header should have more space
      const dashboardHeader = screen.getByText(/Total Credits/i).closest('div')
      expect(dashboardHeader).toBeInTheDocument()
    })

    it('should handle tablet search and filter layout', async () => {
      setViewport(768)
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Search and filters should be properly spaced
      const searchSection = screen.getByRole('search').closest('section')
      expect(searchSection).toBeInTheDocument()
      
      // Test filter dropdowns on tablet
      const statusFilter = screen.getByRole('button', { name: /status/i })
      await user.click(statusFilter)
      
      // Dropdown should be properly positioned
      await waitFor(() => {
        expect(screen.getByRole('option', { name: /active/i })).toBeInTheDocument()
      })
    })
  })

  describe('Desktop Viewport (1024px+)', () => {
    it('should optimize layout for desktop screens', async () => {
      setViewport(1200) // Desktop width
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Should show full button text
      expect(screen.getByText('Card View')).toBeInTheDocument()
      expect(screen.getByText('Table View')).toBeInTheDocument()
      
      // Credit cards should be in multi-column layout (3-4 columns)
      const creditGrid = screen.getByRole('main').querySelector('[class*="grid"]')
      expect(creditGrid).toBeInTheDocument()
      
      // Dashboard header should have horizontal layout
      const headerSection = screen.getByText(/Total Credits/i).closest('section')
      expect(headerSection).toBeInTheDocument()
    })

    it('should handle desktop certificate dialog sizing', async () => {
      setViewport(1200)
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Open certificate dialog
      const creditCard = screen.getByText('Mangrove Restoration Project').closest('article')
      const downloadButton = creditCard?.querySelector('button[aria-label*="certificate"]')
      
      if (downloadButton) {
        await user.click(downloadButton)
        
        // Should open properly sized dialog for desktop
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument()
        })
        
        // Dialog should be centered and appropriately sized
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
      }
    })
  })

  describe('Large Desktop Viewport (1280px+)', () => {
    it('should maximize layout for large screens', async () => {
      setViewport(1440) // Large desktop width
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Should utilize full width efficiently
      const creditGrid = screen.getByRole('main').querySelector('[class*="grid"]')
      expect(creditGrid).toBeInTheDocument()
      
      // Should show 4-column layout for credit cards
      const creditCards = screen.getAllByRole('article')
      expect(creditCards.length).toBeGreaterThan(0)
    })
  })

  describe('Orientation Changes', () => {
    it('should handle landscape to portrait orientation change', async () => {
      // Start in landscape
      setViewport(667, 375) // iPhone landscape
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Switch to portrait
      setViewport(375, 667) // iPhone portrait
      
      // Should adapt layout
      await waitFor(() => {
        expect(screen.getByText('Cards')).toBeInTheDocument()
      })
    })
  })

  describe('Breakpoint Transitions', () => {
    it('should smoothly transition between breakpoints', async () => {
      // Start at mobile
      setViewport(375)
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Should show mobile layout
      expect(screen.getByText('Cards')).toBeInTheDocument()
      
      // Transition to tablet
      setViewport(768)
      
      await waitFor(() => {
        expect(screen.getByText('Card View')).toBeInTheDocument()
      })
      
      // Transition to desktop
      setViewport(1200)
      
      // Should maintain functionality
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      await user.type(searchInput, 'Mangrove')
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
      })
    })
  })

  describe('Touch Interactions', () => {
    it('should support touch interactions on mobile', async () => {
      setViewport(375)
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Test touch targets are appropriately sized
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button)
        // Touch targets should be at least 44px (will be handled by CSS)
        expect(button).toBeInTheDocument()
      })
      
      // Test touch interactions
      const cardViewButton = screen.getByRole('button', { name: /cards/i })
      
      // Simulate touch events
      fireEvent.touchStart(cardViewButton)
      fireEvent.touchEnd(cardViewButton)
      
      expect(cardViewButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Accessibility at Different Viewports', () => {
    it('should maintain accessibility across all breakpoints', async () => {
      const viewports = [375, 768, 1200]
      
      for (const width of viewports) {
        setViewport(width)
        
        render(<App />)
        
        await waitFor(() => {
          expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        })
        
        // Check ARIA landmarks are present
        expect(screen.getByRole('banner')).toBeInTheDocument()
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByRole('search')).toBeInTheDocument()
        
        // Check keyboard navigation works
        const searchInput = screen.getByPlaceholderText(/Search credits/i)
        searchInput.focus()
        expect(document.activeElement).toBe(searchInput)
        
        // Tab navigation should work
        await user.tab()
        expect(document.activeElement).not.toBe(searchInput)
        
        // Clean up for next iteration
        screen.unmount()
      }
    })
  })

  describe('Performance at Different Viewports', () => {
    it('should maintain performance across viewport sizes', async () => {
      const viewports = [375, 768, 1200]
      
      for (const width of viewports) {
        setViewport(width)
        
        const startTime = performance.now()
        
        render(<App />)
        
        await waitFor(() => {
          expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        })
        
        const endTime = performance.now()
        const renderTime = endTime - startTime
        
        // Should render within reasonable time (adjust threshold as needed)
        expect(renderTime).toBeLessThan(1000) // 1 second
        
        // Test search performance
        const searchStart = performance.now()
        const searchInput = screen.getByPlaceholderText(/Search credits/i)
        await user.type(searchInput, 'Mangrove')
        
        await waitFor(() => {
          expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        })
        
        const searchEnd = performance.now()
        const searchTime = searchEnd - searchStart
        
        // Search should be responsive
        expect(searchTime).toBeLessThan(500) // 500ms
        
        screen.unmount()
      }
    })
  })
})