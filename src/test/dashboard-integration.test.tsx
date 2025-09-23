import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { sampleCredits } from '../assets/sample.json'

// Mock the sample data
vi.mock('../assets/sample.json', () => ({
  sampleCredits: [
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
    },
    {
      unic_id: "UNIC-VCS-BRA-2021-9E2F3A4B",
      project_name: "Amazon Rainforest Conservation",
      vintage: 2021,
      status: "Active"
    }
  ]
}))

// Mock html2pdf
vi.mock('html2pdf.js', () => ({
  default: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    save: vi.fn().mockResolvedValue(undefined),
  }))
}))

describe('Dashboard Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Dashboard Load', () => {
    it('should render the complete dashboard with all components', async () => {
      render(<App />)
      
      // Check header is present
      expect(screen.getByRole('banner')).toBeInTheDocument()
      
      // Check main content area
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByLabelText('Carbon Credits Dashboard')).toBeInTheDocument()
      
      // Wait for data to load and check dashboard stats
      await waitFor(() => {
        expect(screen.getByText(/Total Credits/i)).toBeInTheDocument()
      })
      
      // Check search and filter components are present
      expect(screen.getByRole('search')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Search credits/i)).toBeInTheDocument()
      
      // Check view mode buttons
      expect(screen.getByRole('button', { name: /card view/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /table view/i })).toBeInTheDocument()
      
      // Check credit cards are rendered
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.getByText('Solar Power Plant Maharashtra')).toBeInTheDocument()
      })
    })

    it('should display correct statistics in dashboard header', async () => {
      render(<App />)
      
      await waitFor(() => {
        // Should show total credits count
        expect(screen.getByText('3')).toBeInTheDocument() // Total credits
        
        // Should show active and retired counts
        const activeCredits = screen.getByText('2') // Active credits
        const retiredCredits = screen.getByText('1') // Retired credits
        
        expect(activeCredits).toBeInTheDocument()
        expect(retiredCredits).toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    it('should filter credits by project name in real-time', async () => {
      render(<App />)
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Search for specific project
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      await user.type(searchInput, 'Mangrove')
      
      // Should show only matching results
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
      })
      
      // Clear search
      await user.clear(searchInput)
      
      // Should show all results again
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.getByText('Solar Power Plant Maharashtra')).toBeInTheDocument()
      })
    })

    it('should show no results message when search has no matches', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      await user.type(searchInput, 'NonexistentProject')
      
      await waitFor(() => {
        expect(screen.getByText(/No credits found/i)).toBeInTheDocument()
        expect(screen.queryByText('Mangrove Restoration Project')).not.toBeInTheDocument()
      })
    })
  })

  describe('Filter Functionality', () => {
    it('should filter credits by status', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Open status filter
      const statusFilter = screen.getByRole('button', { name: /status/i })
      await user.click(statusFilter)
      
      // Select "Active" filter
      const activeOption = screen.getByRole('option', { name: /active/i })
      await user.click(activeOption)
      
      // Should show only active credits
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.getByText('Amazon Rainforest Conservation')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
      })
    })

    it('should filter credits by vintage year', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Open vintage filter
      const vintageFilter = screen.getByRole('button', { name: /vintage/i })
      await user.click(vintageFilter)
      
      // Select "2023" filter
      const vintage2023 = screen.getByRole('option', { name: /2023/i })
      await user.click(vintage2023)
      
      // Should show only 2023 credits
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
        expect(screen.queryByText('Amazon Rainforest Conservation')).not.toBeInTheDocument()
      })
    })

    it('should clear all filters when clear button is clicked', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Apply search filter
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      await user.type(searchInput, 'Solar')
      
      await waitFor(() => {
        expect(screen.queryByText('Mangrove Restoration Project')).not.toBeInTheDocument()
      })
      
      // Clear filters
      const clearButton = screen.getByRole('button', { name: /clear filters/i })
      await user.click(clearButton)
      
      // Should show all results
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.getByText('Solar Power Plant Maharashtra')).toBeInTheDocument()
      })
    })
  })

  describe('View Mode Toggle', () => {
    it('should switch between card and table views', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Should start in card view
      expect(screen.getByRole('button', { name: /card view/i })).toHaveAttribute('aria-pressed', 'true')
      
      // Switch to table view
      const tableViewButton = screen.getByRole('button', { name: /table view/i })
      await user.click(tableViewButton)
      
      // Should show table view
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument()
        expect(tableViewButton).toHaveAttribute('aria-pressed', 'true')
      })
      
      // Switch back to card view
      const cardViewButton = screen.getByRole('button', { name: /card view/i })
      await user.click(cardViewButton)
      
      // Should show card view again
      await waitFor(() => {
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
        expect(cardViewButton).toHaveAttribute('aria-pressed', 'true')
      })
    })
  })

  describe('Credit Details Modal', () => {
    it('should open and close credit details modal', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Click on a credit card to open details
      const creditCard = screen.getByText('Mangrove Restoration Project').closest('article')
      expect(creditCard).toBeInTheDocument()
      
      const viewDetailsButton = within(creditCard!).getByRole('button', { name: /view details/i })
      await user.click(viewDetailsButton)
      
      // Should open modal
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Credit Details')).toBeInTheDocument()
      })
      
      // Close modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      
      // Should close modal
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('Certificate Download Workflow', () => {
    it('should open certificate dialog and handle download', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Click download certificate button
      const creditCard = screen.getByText('Mangrove Restoration Project').closest('article')
      const downloadButton = within(creditCard!).getByRole('button', { name: /download certificate/i })
      await user.click(downloadButton)
      
      // Should open certificate dialog
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText(/Certificate Preview/i)).toBeInTheDocument()
      })
      
      // Should show certificate content
      expect(screen.getByText('UNIC-VCS-IND-2023-4F7A8C1B')).toBeInTheDocument()
      expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      
      // Test PDF download
      const downloadPDFButton = screen.getByRole('button', { name: /download pdf/i })
      await user.click(downloadPDFButton)
      
      // Should call html2pdf (mocked)
      await waitFor(() => {
        expect(vi.mocked(require('html2pdf.js').default)).toHaveBeenCalled()
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('should adapt layout for mobile screens', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Check that mobile-specific elements are present
      const viewModeButtons = screen.getAllByRole('button', { name: /view/i })
      expect(viewModeButtons).toHaveLength(2)
      
      // Check that cards are displayed in single column on mobile
      const creditGrid = screen.getByRole('main').querySelector('[class*="grid"]')
      expect(creditGrid).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display error state when data loading fails', async () => {
      // Mock fetch to fail
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText(/Error Loading Dashboard/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })
    })

    it('should handle retry functionality', async () => {
      // Mock fetch to fail first, then succeed
      vi.spyOn(global, 'fetch')
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ sampleCredits })
        } as Response)
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText(/Error Loading Dashboard/i)).toBeInTheDocument()
      })
      
      // Click retry
      const retryButton = screen.getByRole('button', { name: /try again/i })
      await user.click(retryButton)
      
      // Should load successfully
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', async () => {
      render(<App />)
      
      // Check main landmarks
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('search')).toBeInTheDocument()
      
      // Check ARIA labels
      expect(screen.getByLabelText('Carbon Credits Dashboard')).toBeInTheDocument()
      expect(screen.getByLabelText(/Search credits/i)).toBeInTheDocument()
      
      await waitFor(() => {
        // Check credit cards have proper roles
        const creditCards = screen.getAllByRole('article')
        expect(creditCards.length).toBeGreaterThan(0)
      })
    })

    it('should support keyboard navigation', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Tab through interactive elements
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      searchInput.focus()
      expect(document.activeElement).toBe(searchInput)
      
      // Tab to view mode buttons
      await user.tab()
      const cardViewButton = screen.getByRole('button', { name: /card view/i })
      expect(document.activeElement).toBe(cardViewButton)
      
      // Tab to table view button
      await user.tab()
      const tableViewButton = screen.getByRole('button', { name: /table view/i })
      expect(document.activeElement).toBe(tableViewButton)
    })
  })

  describe('Performance', () => {
    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 150 }, (_, i) => ({
        unic_id: `UNIC-TEST-${i}`,
        project_name: `Test Project ${i}`,
        vintage: 2020 + (i % 4),
        status: i % 2 === 0 ? 'Active' : 'Retired' as const
      }))
      
      vi.mock('../assets/sample.json', () => ({
        sampleCredits: largeDataset
      }))
      
      render(<App />)
      
      // Should use virtual scrolling for large datasets
      await waitFor(() => {
        expect(screen.getByText('Test Project 0')).toBeInTheDocument()
      })
      
      // Should show performance optimizations are active
      const creditGrid = screen.getByRole('main').querySelector('[class*="virtual"]')
      expect(creditGrid).toBeInTheDocument()
    })
  })
})